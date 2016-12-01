const directTranslation = (key, translations) => translations[key];

const nestedTranslation = (key, translations) =>
  key.split('.').reduce(
    (translationPath, currentKey) => translationPath[currentKey] || {},
    translations
  );

const translationByKey = (key, translations, returnKeyOnMissing) => {
  const value = directTranslation(key, translations) || nestedTranslation(key, translations);
  if (typeof value === "string") return value;
  return returnKeyOnMissing ? key : null;
}

module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(path, state) {
        const { alias, translations, returnKeyOnMissing } = state.opts;
        if (t.isIdentifier(path.node.callee, { name: alias })) {
          const keyNode = path.node.arguments[0];
          if (!t.isStringLiteral(keyNode)) {
            throw path.buildCodeFrameError(
              '[i18n-translate] Translation must be a static string, not an expression'
            );
          }

          const key = keyNode.value;
          const value = translationByKey(key, state.opts.translations, returnKeyOnMissing);
          if (!value) {
            throw path.buildCodeFrameError('[i18n-translate] Translation not found for ' + key);
          }

          path.replaceWith(
            t.callExpression(
              t.identifier(state.opts.replaceWith || ''),
              [t.stringLiteral(value)].concat(path.node.arguments.slice(1))
            )
          );
        }
      },
    },
  };
};
