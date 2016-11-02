# babel-plugin-i18n-replace

Babel - replace i18n translation keys with their values during compilation.

## Installation

```sh
npm install --save-dev babel-plugin-i18n-replace
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["i18n-replace"]
}
```

### Via CLI

```sh
babel --plugins i18n-replace script.js
```

### Via Node API

```javascript
require('babel').transform('code', {
  plugins: ['i18n-replace']
});
```
