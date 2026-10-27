# GrapesJS MJML

> Requires GrapesJS v0.15.9 or higher

[![build](https://github.com/GrapesJS/mjml/actions/workflows/build.yml/badge.svg)](https://github.com/artf/grapesjs-mjml/actions)

This plugin enables the usage of [MJML](https://mjml.io/) components inside the GrapesJS environment. MJML components are rendered in real-time using the official v4 compiler (+ some mocks to make it run in the browser), therefore the result is, almost, the same as using the [MJML Live Editor](https://mjml.io/try-it-live).


[Demo](http://grapesjs.com/demo-mjml.html)

Supported MJML components (using the bundled MJML v4 browser compiler):
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
|`customComponents`|Functions that register custom GrapesJS component types for MJML tags|`[]`|
|`importPlaceholder`|Placeholder MJML template for the import modal|`''`|
|`imagePlaceholderSrc`|Image placeholder source|`'https://via.placeholder.com/350x250/78c5d6/fff'`|
|`i18n`|I18n object containing language [more info](https://grapesjs.com/docs/modules/I18n.html#configuration)|`{}`|
|`mjmlParser`|Custom MJML compiler|Bundled MJML v4 browser compiler|
|`mjmlPresets`|MJML component classes and validation dependencies used by every preview and export in this editor|`[]`|
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

### Custom MJML components

The plugin exports `mjml2html`, `BodyComponent`, `HeadComponent`, `registerComponent`, and `registerDependencies` from the same bundled MJML v4 compiler. These exports work in the browser and in Node without a DOM.

Custom tags need both an MJML rendering class and a GrapesJS component type.
Use `mjmlPresets` to make the rendering classes available to every preview and export in one editor:

```ts
import grapesjs from 'grapesjs';
import grapesMjml, { BodyComponent } from 'grapesjs-mjml';

class MjCallout extends BodyComponent {
  static componentName = 'mj-callout';
  static endingTag = true;
  static allowedAttributes = { color: 'color' };
  static defaultAttributes = { color: '#123456' };
  static dependencies = { 'mj-column': ['mj-callout'], 'mj-callout': [] };

  render() {
    return this.renderMJML(
      `<mj-text padding="0" color="${this.getAttribute('color')}">${this.getContent()}</mj-text>`
    );
  }
}

const editor = grapesjs.init({
  // ...
  plugins: [(editor) => grapesMjml(editor, {
    mjmlPresets: [{
      components: [MjCallout],
      dependencies: MjCallout.dependencies,
    }],
    customComponents: [(editor) => {
      editor.Components.addType('mj-callout', {
        extend: 'mj-text',
        isComponent: (el) => el.tagName?.toLowerCase() === 'mj-callout',
        model: { defaults: { tagName: 'mj-callout', 'style-default': {} } },
      });
    }],
  })],
});

editor.addComponents({
  type: 'mjml',
  components: [{
    type: 'mj-body',
    components: [{
      type: 'mj-section',
      components: [{
        type: 'mj-column',
        components: [{ type: 'mj-callout', content: 'Custom content' }],
      }],
    }],
  }],
});

const mjml = editor.runCommand('mjml-code');
const { html, errors } = editor.runCommand('mjml-code-to-html', {
  validationLevel: 'strict',
});
```

The GrapesJS definition above inherits the text component's editing and preview
behavior because this custom tag produces the same HTML structure. Components
with other structures may need their own view helpers.

For shared registrations using the bundled compiler, import `registerComponent` from `grapesjs-mjml` and register before initializing editors:

```ts
import { registerComponent } from 'grapesjs-mjml';

registerComponent(MjCallout, { registerDependencies: true });
```

This replaces the `mjmlPresets` entry in the example; the GrapesJS
`customComponents` registration is still required. Calling `registerComponent`
from a separate installation of `mjml-core` affects that installation's registry.
An explicit `mjmlParser` uses its own registry.

Additional `presets` passed to `mjml2html` or the `mjml-code-to-html` command apply
only to that compilation. Command presets are appended to `mjmlPresets`, so a
command can override a component for one export.

### Using an independent MJML compiler

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

Use Node.js 22.13+ or 24+. CI runs the checks on Node.js 22 and 24.

Clone the repository

```sh
$ git clone https://github.com/GrapesJS/mjml.git
$ cd mjml
```

Install it

```sh
$ npm i
```

`npm run build` bundles the plugin and the MJML compiler together into `dist/index.js`. Tests run directly against the source; no preliminary build is required. `npm run test:bundle` checks the generated bundle after building it.
The `dts-bundle-generator` override preserves nested MJML re-exports in the generated package declarations.

Run the checks

```sh
$ npm run lint
$ npm run typecheck
$ npm test
$ npm run build
$ npm run test:bundle
```

Start the dev server

```sh
$ npm start
```

## Releasing

Start with a clean working tree, then prepare a stable release or release candidate:

```sh
$ npm run release:core
$ npm run release:rc
```

These commands update `package.json` and
`package-lock.json`, create a `release-v<version>` branch, and commit the version
change. The stable command bumps the patch version, or promotes the current
prerelease to its stable version. The RC command increments the current RC, or
starts the next patch at `-rc.0`.

Push the release branch and open a PR targeting `master`. Keep the generated
commit message when merging (use it as the squash commit title):
`Release grapesjs-mjml rc: v<version>` or
`Release grapesjs-mjml latest: v<version>`.

The publish workflow runs the checks, builds the package, and publishes to npm
with the matching `rc` or `latest` tag. A GitHub release is optional and does not
trigger publishing.

## License

BSD 3-Clause
