# babel-plugin-i18n-replace

Replace i18n translation keys with their values during compilation using babel.

## Installation

```sh
npm install --save-dev babel-plugin-i18n-replace
```

## Usage

### Via webpack (Recommended)

Checkout [example application](examples/webpack-integration/).
It illustrates full application setup reading translations from json files
and providing run-time interpolation support.

### Via Node API

```javascript
require('babel').transform('code', {
  plugins: [
    [
      'i18n-replace', {
        alias: '__t',
        replaceWith: 'interpolate',
        translations: {
          'user.name': 'User is %{name}.',
          'user.surname': 'Surname'
        }
      }
    ]
  ]
});
```

### Via `.babelrc`

**.babelrc**

```json
{
  "plugins": [
    [
      "i18n-replace", {
        "alias": "__t",
        "replaceWith": "interpolate",
        "translations": {
          "user.name": "User is %{name}.",
          "user.surname": "Surname"
        }
      }
    ]
  ]
}
```

If you want to read translations from file, use webpack configuration.

### Limitations

- New translations are only picked up on webpack server start
as those are provided in webpack config.

- Translation keys nesting is not supported. It's easy to add though.

- Translation keys have to be static strings,
as those are replaced with translated text compile-time.
Interpolation (e.g. replacing `{name}` with current user name) should be performed run-time.
This is achieved by replacing translation alias with an interpolation function:

```javascript
// application code
__t('user.name', { name: user.name })

// generated code
translations.interpolate('user.name', { name: user.name })

// interpolation function
const interpolate = (string, options) => {
  if (!options) return string;

  return Object.keys(options).reduce(
    (result, key) => result.replace(`%{${key}}`, options[key]),
    string
  );
};

// check out actual implementation in webpack-integration example
```
