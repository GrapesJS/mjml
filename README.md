# GrapesJS MJML

This plugin enables the usage of [MJML](https://mjml.io/) components inside the GrapesJS environment. MJML components are rendered in real-time using the official compiler, therefore the result is, almost, the same as using the [MJML Live Editor](https://mjml.io/try-it-live).

Supported components:
`mj-container`
`mj-section`
`mj-column`
`mj-text`
`mj-image`
`mj-button`
`mj-social`
`mj-divider`


## Options

* `importPlaceholder` Import placeholder MJML, default: '',
* `modalTitleImport` Title for the import modal, default: 'Import MJML',
* `modalBtnImport` Test for the import button, default: 'Import',
* `modalLabelImport` Description for the import modal, default: '',
* `modalTitleExport` Title for the export modal, default: 'Export MJML',
* `modalLabelExport` Description for the export modal, default: '',
* `overwriteExport` Overwrite default export command, default: 'true',
* `preMjml` String before the MJML in export code, default: '<mjml><mj-body>',
* `postMjml` String after the MJML in export code, default: '</mj-body></mjml>',
* `resetBlocks` Clean all previous blocks if true, default: 'true',
* `resetBlocks` Clean all previous devices and set a new one for mobile, default: 'true',
* `resetStyleManager` Reset the Style Manager and add new properties for MJML, default: 'true',


## Download

* `npm i grapesjs-mjml` or `yarn add grapesjs-mjml`



## Usage

```html
<link href="path/to/grapes.min.css" rel="stylesheet"/>
<script src="path/to/grapes.min.js"></script>
<script src="path/to/grapesjs-mjml.min.js"></script>

<div id="gjs">
  <!-- Your body MJML here -->
  <mj-container>
        <mj-section>
          <mj-column>
            <mj-text>My Company</mj-text>
          </mj-column>
        </mj-section>
  <mj-container>
</div>

<script type="text/javascript">
  var editor = grapesjs.init({
      fromElement: 1,
      container : '#gjs',
      plugins: ['gjs-mjml'],
      pluginsOpts: {
        'gjs-mjml': {/* ...options */}
      }
  });
</script>
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

Build before the commit. This will also increase the patch level version of the package

```sh
$ npm run build
```



## License

BSD 3-Clause
