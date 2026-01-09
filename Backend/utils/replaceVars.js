function replaceVars(template, values) {
  let result = template;

  values.forEach(value => {
    result = result.replace("{#var#}", value);
  });

  return result;
}

module.exports = replaceVars;