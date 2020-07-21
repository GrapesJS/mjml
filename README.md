# GrapesJS MJML

> Requires GrapesJS v0.14.62 or higher

[![build](https://github.com/artf/grapesjs-mjml/workflows/build/badge.svg)](https://github.com/artf/grapesjs-mjml/actions)

This plugin enables the usage of [MJML](https://mjml.io/) components inside the GrapesJS environment. MJML components are rendered in real-time using the official v4 compiler (+ some mocks to make it run in the browser), therefore the result is, almost, the same as using the [MJML Live Editor](https://mjml.io/try-it-live).


[Demo](http://grapesjs.com/demo-mjml.html)
<p align="center"><img src="http://grapesjs.com/img/grapesjs-mjml-demo.jpg" alt="GrapesJS" align="center"/></p>
<br/>

Supported components:
`mj-wrapper`
`mj-group`
`mj-section`
`mj-column`
`mj-text`
`mj-image`
`mj-button`
`mj-social`
`mj-divider`
`mj-spacer`
`mj-style`
`mj-font`
`mj-hero`


## Options

|Option|Description|Default|
|-|-|-
|`categoryLabel`|Category for blocks|`''`|
|`importPlaceholder`|Import placeholder MJML|`''`|
|`modalTitleImport`|Title for the import modal|`Import MJML`|
|`modalBtnImport`|Test for the import button|`Import`|
|`modalLabelImport`|Description for the import modal|`''`|
|`modalTitleExport`|Title for the export modal|`Export MJML`|
|`modalLabelExport`|Description for the export modal|`''`|
|`overwriteExport`|Overwrite default export command|`true`|
|`preMjml`|String before the MJML in export code|`''`|
|`postMjml`|String after the MJML in export code|`''`|
|`resetBlocks`|Clean all previous blocks if true|`true`|
|`resetDevices`|Clean all previous devices and set a new one for mobile|`true`|,
|`resetStyleManager`|Reset the Style Manager and add new properties for MJML|`true`|,


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
  var editor = grapesjs.init({
      fromElement: 1,
      container : '#gjs',
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
   fromElement: 1,
   container : '#gjs',
   avoidInlineStyle : false,
   plugins: [grapesJSMJML],
   pluginsOpts: {
      [grapesJSMJML]: {/* ...options */}
   }
});
```


## Development

Clone the repository

```sh
$ git clone https://github.com/artf/grapesjs-mjml.git
$ cd grapesjs-mjml
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
