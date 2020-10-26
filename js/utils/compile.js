const TEMPLATE_REGEXP = /\{\{(.*?)\}\}/gi;

const get = (obj, path, defaultValue) => {
  const keys = path.split(".");

  let result = obj;
  for (let key of keys) {
    result = result[key];

    if (result === undefined) {
      return defaultValue;
    }
  }

  return result || defaultValue;
};

export default (template, ctx) => {
  let tmpl = template;
  let key = null;

  // Важно делать exec именно через константу, иначе уйдете в бесконечный цикл
  while ((key = TEMPLATE_REGEXP.exec(tmpl))) {
    if (key[1]) {
      const tmplValue = key[1].trim();
      const data = get(ctx, tmplValue);

      if (typeof data === "function") {
        window[tmplValue] = data;
        tmpl = tmpl.replace(
          new RegExp(key[0], "gi"),
          `window.${key[1].trim()}(event)`
        );
        continue;
      }
      tmpl = tmpl.replace(new RegExp(key[0], "gi"), data);
    }
  }

  return tmpl;
};
