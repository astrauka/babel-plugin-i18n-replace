module.exports = function ({ types: t }) {
  return {
    visitor: {
      Expression(path, state) {
        if (t.isIdentifier(path.node.callee, { name: state.opts.alias })) {
          const keyNode = path.node.arguments[0];
          if (!t.isStringLiteral(keyNode)) {
            throw path.buildCodeFrameError(
              '[i18n-translate] Translation must be a static string, not an expression'
            );
          }

          const key = keyNode.value;
          const value = state.opts.translations[key];
          if (!value) {
            throw path.buildCodeFrameError('[i18n-translate] Translation not found for' + key);
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
