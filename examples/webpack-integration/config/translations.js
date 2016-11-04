// interpolates translation text at runtime
const interpolate = (string, options) => {
  if (!options) return string;

  return Object.keys(options).reduce(
    (result, key) => result.replace(`%{${key}}`, options[key]),
    string
  );
};

module.exports = {
  interpolate,
};
