function render(template, data) {
  var regExp = /{{\s*(\^|#)\s*(.+?)\s*}}([^]+?){{\s*\/\s*\2\s*}}/g;
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
        result += render(innerTmpl, sectionData);
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
  var regExp = /{{(.+?)}}/g;
  var lastIndex = regExp.lastIndex = 0;
  var result = '';
  var match;

  template = template;

  while (match = regExp.exec(template)) {

    result += template.substring(lastIndex, match.index);

    var value = evalProp(data, match[1]);
    if (value !== undefined && value !== null) {
      result += value;
    }

    lastIndex = regExp.lastIndex;
  }

  result += template.substring(lastIndex);

  return result;
}

function evalProp(obj, nestedProp) {
  var nestedProps = nestedProp.split('.'), value = obj;
  for (var i = 0; i < nestedProps.length; ++i) {
    var prop = nestedProps[i];
    if (prop && !(value = value[prop])) {
      break;
    }
  }
  return (typeof(value) === 'function' ? value() : value);
}
