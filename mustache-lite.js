function render(template, data) {

  if (typeof template !== 'string') {
    throw new TypeError('Invalid template! Template should be a "string" ' +
                        'but "' + Object.prototype.toString.call(template) + '" was given as the first ' +
                        'argument for #render(template, view)');
  }

  // space stripping & preprocessing
  template = template.replace(/\n[^\S\n]*{{\s*(!|\^|#|\/)\s*(.+?)\s*}}[^\S\n]*(?=\n)/g, 
                              function(match, $1, $2, offset, original) {
                                return '{{' + $1 + $2 + '}}';
                              });

  var regExp = /{{(\^|#)(.+?)}}([^]+?){{\/\2}}/g;
  var lastIndex = regExp.lastIndex = 0;
  var result = '', match;

  while (match = regExp.exec(template)) {
    var key = match[2], flag = match[1], innerTmpl = match[3];
    var templateBetweenSections = template.substring(lastIndex, match.index);
    result += renderSingleSection(templateBetweenSections, data);
    
    var sectionData = evalProp(data, key);
    if (flag === '#' && sectionData) {
      var dataType = Object.prototype.toString.call(sectionData);
      if (dataType === '[object Array]') {
        sectionData.forEach(function (el) {
          result += render(innerTmpl, el);
        });
      } else if (dataType === '[object Object]') {
        sectionData.parent = data;
        result += render(innerTmpl, sectionData);
      } else if (dataType === '[object Function]') {
        result += sectionData.call(data, innerTmpl, function(template) {
          return renderSingleSection(template, data);
        });
      } else {
        result += render(innerTmpl, data);
      }
    } else if (flag === '^' && !sectionData) {
      result += render(innerTmpl, data);
    }
    lastIndex = regExp.lastIndex;
  }

  result += renderSingleSection(template.substring(lastIndex), data);

  return result;
}

function renderSingleSection(template, data) {
  var regExp = /{{{%(.+?)%}}}|{{{\s*(.+?)\s*}}}|{{&\s*(.+?)\s*}}|{{%(.+?)%}}|{{\s*(.+?)\s*}}/g;
  var lastIndex = regExp.lastIndex = 0;
  var result = '';
  var match;

  template = template;

  while (match = regExp.exec(template)) {

    result += template.substring(lastIndex, match.index);
    var matched = match[1] || match[2] || match[3] || match[4] || match[5];
    var escape = match[5] || match[4];

    var value = match[1] || match[4] || evalProp(data, matched);
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

