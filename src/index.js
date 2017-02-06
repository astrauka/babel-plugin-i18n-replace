const directTranslation = (key, translations) => translations[key];

const nestedTranslation = (key, translations) =>
  key.split('.').reduce(
    (translationPath, currentKey) => translationPath && translationPath[currentKey],
    translations
  );

const translationByKey = (key, translations, returnKeyOnMissing, allowStructures) => {
  const directValue = directTranslation(key, translations);
  // allow null and false values
  const value = directValue === undefined ? nestedTranslation(key, translations) : directValue;

  if (typeof value === "string") return value;
  if (allowStructures && value !== undefined) return JSON.stringify(value);
  return returnKeyOnMissing ? key : null;
}

module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(path, state) {
        const { alias, translations, returnKeyOnMissing, allowStructures } = state.opts;
        if (t.isIdentifier(path.node.callee, { name: alias })) {
          const keyNode = path.node.arguments[0];
          if (!t.isStringLiteral(keyNode)) {
            throw path.buildCodeFrameError(
              '[i18n-translate] Translation must be a static string, not an expression'
            );
          }

          const key = keyNode.value;
          const value = translationByKey(key, translations, returnKeyOnMissing, allowStructures);
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
