# GrapesJS MJML

> Requires GrapesJS v0.15.9 or higher

[![build](https://github.com/artf/grapesjs-mjml/workflows/build/badge.svg)](https://github.com/artf/grapesjs-mjml/actions)

This plugin enables the usage of [MJML](https://mjml.io/) components inside the GrapesJS environment. MJML components are rendered in real-time using the official v4 compiler (+ some mocks to make it run in the browser), therefore the result is, almost, the same as using the [MJML Live Editor](https://mjml.io/try-it-live).


[Demo](http://grapesjs.com/demo-mjml.html)

Supported MJML components (using default mjml-browser parser):
`mj-mjml`
`mj-head`
`mj-body`
`mj-wrapper`
`mj-group`
`mj-section`
`mj-column`
`mj-text`
`mj-image`
`mj-button`
`mj-social`
`mj-social-element`
`mj-divider`
`mj-spacer`
`mj-style`
`mj-font`
`mj-hero`
`mj-navbar`
`mj-navbar-link`
`mj-raw`


## Options

|Option|Description|Default|
|-|-|-
|`blocks`|Which blocks to add|(all)|
|`block`|Add custom block options, based on block id.|`(blockId) => ({})`|
|`codeViewerTheme`|Code viewer theme.|`hopscotch`|
|`customComponents`|List of components which will be added to default one |`[]` |
|`importPlaceholder`|Placeholder MJML template for the import modal|`''`|
|`imagePlaceholderSrc`|Image placeholder source|`'https://via.placeholder.com/350x250/78c5d6/fff'`|
|`i18n`|I18n object containing language [more info](https://grapesjs.com/docs/modules/I18n.html#configuration)|`{}`|
|`mjmlParser`|Custom [mjml-browser](https://www.npmjs.com/package/mjml-browser) instance. Allows to extend MJML functionality or add custom MJML components |`(input: string \| MJMLJsonObject, opt: MJMLParsingOptions) => MJMLParseResults`|
|`overwriteExport`|Overwrite default export command|`true`|
|`preMjml`|String before the MJML in export code|`''`|
|`postMjml`|String after the MJML in export code|`''`|
|`resetBlocks`|Clean all previous blocks if true|`true`|
|`resetDevices`|Clean all previous devices and set a new one for mobile|`true`|
|`resetStyleManager`|Reset the Style Manager and add new properties for MJML|`true`|
|`resetDevices`|Clean all previous devices and set a new one for mobile|`true`|
|`hideSelector`|Hide the default selector manager|`true`|
|`useXmlParser`|Experimental: use XML parser instead of HTML. This should allow importing void MJML elements (without closing tags) like `<mj-image/>`|`false`|
|`columnsPadding`|Column padding (this way it's easier to select columns)|`10px 0`|
|`useCustomTheme`|Load custom preset theme|`true`|


## Download

* `npm i grapesjs-mjml`



## Usage

```html
<link href="path/to/grapes.min.css" rel="stylesheet"/>
<script src="path/to/grapes.min.js"></script>
<script src="path/to/grapesjs-mjml.min.js"></script>

<div id="gjs">
  <mjml>
    <mj-body>
      <!-- Your MJML body here -->
      <mj-section>
        <mj-column>
          <mj-text>My Company</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
</div>

<script type="text/javascript">
  const editor = grapesjs.init({
      fromElement: true,
      container: '#gjs',
      plugins: ['grapesjs-mjml'],
      pluginsOpts: {
        'grapesjs-mjml': {/* ...options */}
      }
  });
</script>
```

#### Or using ESM imports:

```js
import 'grapesjs/dist/css/grapes.min.css'
import grapesJS from 'grapesjs'
import grapesJSMJML from 'grapesjs-mjml'

grapesJS.init({
   fromElement: true,
   container: '#gjs',
   plugins: [grapesJSMJML],
   pluginsOpts: {
      [grapesJSMJML]: {/* ...options */}
   },
});
```

#### i18n usage:

```js
import 'grapesjs/dist/css/grapes.min.css'
import grapesJS from 'grapesjs'
import nl from 'grapesjs/locale/nl'
import grapesJSMJML from 'grapesjs-mjml'
import mjmlNL from 'grapesjs-mjml/locale/nl'

grapesJS.init({
   fromElement: true,
   container: '#gjs',
   i18n: {
      // locale: 'en', // default locale
      // detectLocale: true, // by default, the editor will detect the language
      // localeFallback: 'en', // default fallback
      messages: { nl: nl },
   },
   plugins: [grapesJSMJML],
   pluginsOpts: {
      [grapesJSMJML]: {
        // Optional options
        i18n: { nl: mjmlNL }
      }
   },
});
```

### Using Independent mjml-browser Build

In case, you have your own version of MJML with custom or extended components, it is possible
to override default [mjml parser](https://github.com/mjmlio/mjml/tree/master/packages/mjml-browser)
with custom one and create custom grapesJS components.

For further info how to create MJML Component, you can
[visit components folder](https://github.com/GrapesJS/mjml/tree/master/src/components)
or you can go to [docs](https://grapesjs.com/docs/modules/Components.html#define-custom-component-type).

```ts
import 'grapesjs/dist/css/grapes.min.css'
import grapesJS from 'grapesjs'
import grapesJSMJML from 'grapesjs-mjml'
import customMjmlParser from 'custom-mjml-parser';

import customImage from 'custom/components/path'

grapesJS.init({
   fromElement: true,
   container: '#gjs',
   plugins: [grapesJSMJML],
   pluginsOpts: {
      [grapesJSMJML]: {
        mjmlParser: customMjmlParser,
        customComponents: [
          customImage,
        ]
      }
   },
});
```

## Development

Clone the repository

```sh
$ git clone https://github.com/GrapesJS/mjml.git
$ cd mjml
```

Install it

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```

## Releasing

1) Run `npm run v:patch` to bump the version in package.json and create a git tag
2) Push the commit + new tag
3) Go to github and draft a new release
4) Select the new tag and add some release notes
5) Hit publish, the release will automatically publish to npm

## License

BSD 3-Clause
