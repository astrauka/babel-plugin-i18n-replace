# babel-plugin-i18n-replace

Replace i18n translation keys with their values during compilation using babel.

Supports flat and nested translation keys.

## How it works

```javascript
// application code
__t('greet.user', { name: user.name })

// compile-time generated code
translations.interpolate('Hello, %{name}', { name: user.name })

// interpolation function to replace interpolation arguments at run-time
// you will have to define it and can skip it if no interpolation is required

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

// run-time result
'Hello, John'
```

Check out example in
[webpack-integration example](examples/webpack-integration/).

## Installation

```sh
npm install --save-dev babel-plugin-i18n-replace
```

## Usage

Checkout [tests](test/) for usage examples.

### Options

* `alias (string)` - function name to match
* `relpaceWith (string)` - function name to replace with
* `returnKeyOnMissing (boolean)` - when translation key not found, use the key for value
* `allowStructures (boolean)` - allow numbers, hashes, etc instead of only strings as values - those will be converted to JSON strings
* `translations (object)` - translations map

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
        returnKeyOnMissing: false,
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
        "returnKeyOnMissing": false,
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

### Pluralization

**Work with `allowStructures: false` only.**

Imagine we have the following pluralization keys:
```json
{
  "likes": {
    "one": "%{name} has %{count} like.",
    "other": "%{name} has %{count} likes."
  }
}
```

We can determine run-time only which of these translations should be used,
so the plugin returns `pluralize_##_{json_pluralization_options}`.

```javascript
'pluralize_##_{"likes":{"one":"%{name} has %{count} like.","other":"%{name} has %{count} likes."}}'
```

Your interpolation function should handle this.
See [example application](examples/webpack-integration/config/translations.js).

### Limitations

- New translations are only picked up on webpack server start
as those are provided in webpack config.

- Translation keys have to be static strings,
as those are replaced with translated text compile-time.
Interpolation (e.g. replacing `{name}` with current user name) should be performed run-time.
This is achieved by replacing translation alias with an interpolation function.
