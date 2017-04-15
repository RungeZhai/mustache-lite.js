function render(template, data) {
  var regExp = /(\n?[^\S\n]*){{\s*(\^|#)\s*(.+?)\s*}}([^\S\n]*)(\n?[^]+?)(\n?[^\S\n]*){{\s*\/\s*\3\s*}}([^\S\n]*)/g;
  var lastIndex = regExp.lastIndex = 0;
  var result = '', match;

  while (match = regExp.exec(template)) {
    var matchIndex = match.index, flag = match[2], key = match[3], tmplInnerSection = match[5];

    // space stripping
    if (!(match[1] && match[5] && match[1][0] === '\n' && match[5][0] === '\n')) {
      matchIndex += match[1].length;
      tmplInnerSection = match[4] + tmplInnerSection;
    }

    if (!(match[6] && match[6][0] === '\n' && template[regExp.lastIndex] === '\n')) {
      tmplInnerSection += match[6];
      regExp.lastIndex -= match[7].length;
    }

    var tmplBetweenSections = template.substring(lastIndex, matchIndex);
    result += renderSingleSection(tmplBetweenSections, data);
    
    var sectionData = evalProp(data, key);
    if (flag === '#' && sectionData) {
      var dataType = Object.prototype.toString.call(sectionData);
      if (dataType === '[object Array]') {
        sectionData.forEach(function (el) {
          result += render(tmplInnerSection, el);
        });
      } else if (dataType === '[object Object]') {
        sectionData.parent = data;
        result += render(tmplInnerSection, sectionData);
      } else if (dataType === '[object Function]') {
        result += sectionData.call(data, tmplInnerSection, function(template) {
          return renderSingleSection(template, data);
        });
      } else {
        result += render(tmplInnerSection, data);
      }
    } else if (flag === '^' && !sectionData) {
      result += render(tmplInnerSection, data);
    }
    lastIndex = regExp.lastIndex;
  }

  result += renderSingleSection(template.substring(lastIndex), data);

  return result;
}

function renderSingleSection(template, data) {
  var regExp = /{{{\s*(.+?)\s*}}}|{{&\s*(.+?)\s*}}|{{\s*(.+?)\s*}}/g;
  var lastIndex = regExp.lastIndex = 0;
  var result = '';
  var match;

  template = template;

  while (match = regExp.exec(template)) {

    result += template.substring(lastIndex, match.index);
    var matched = match[1] || match[2] || match[3];
    var escape = match[3];

    var value = evalProp(data, matched);
    if (value !== undefined && value !== null) {
      result += escape ? escapeHtml('' + value) : value;
    }

    lastIndex = regExp.lastIndex;
  }

  result += template.substring(lastIndex);

  return result;
}

function evalProp(obj, nestedProp) {
  var context = obj, lookupHit = false, value;

  while (value = context) {
    if ((nestedProp = nestedProp.trim()) !== '.') {
      var nestedProps = nestedProp.split('.');
      for (var i = 0; i < nestedProps.length; ++i) {
        var prop = nestedProps[i].trim();
        if (i === nestedProps.length - 1) {
          lookupHit = (typeof value === 'object' && (prop in value));
        }
        value = value[prop];
        if (value === undefined || value === null) {
          break;
        }
      }
    } else {
      lookupHit = true;
    }

    if (lookupHit) break;

    context = context.parent;
  }

  return (typeof(value) === 'function' ? value.call(obj) : value);
}

var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
    return entityMap[s];
  });
}

