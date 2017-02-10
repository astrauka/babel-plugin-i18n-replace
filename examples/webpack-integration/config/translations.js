const pluralize = (translations, count) => {
  switch (count) {
    case 0: return translations.zero || translations.other;
    case 1: return translations.one;
    default: return translations.other;
  }
};

// interpolates translation text at runtime
export const interpolate = (string, options) => {
  if (!options) return string;

  // support pluralization
  const replacement = string.startsWith('pluralize_##_')
    ? pluralize(JSON.parse(string.split('_##_')[1]), options.count)
    : string;

  return Object.keys(options).reduce(
    (result, key) => result.replace(`%{${key}}`, options[key]),
    replacement
  );
};

module.exports = {
  interpolate,
};
