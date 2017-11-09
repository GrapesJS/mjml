import grapesjs from 'grapesjs';

export default grapesjs.plugins.add('gjs-mjml', (editor, opts = {}) => {
  let c = opts;

  let defaults = {
    // Code viewer theme
    codeViewerTheme: 'hopscotch',

    // Import placeholder MJML
    importPlaceholder: '',

    // Title for the import modal
    modalTitleImport: 'Import MJML',

    // Test for the import button
    modalBtnImport: 'Import',

    // Description for the import modal
    modalLabelImport: '',

    // Title for the export modal
    modalTitleExport: 'Export MJML',

    // Description for the export modal
    modalLabelExport: '',

    // Overwrite default export command
    overwriteExport: 1,

    // String before the MJML in export code
    preMjml: '<mjml><mj-body>',

    // String after the MJML in export code
    postMjml: '</mj-body></mjml>',

    // Export 'mjml', 'html' or both (leave empty) TODO
    exportOnly: '',

    // Clean all previous blocks if true
    resetBlocks: 1,

    // Clean all previous devices and set a new one for mobile
    resetDevices: 1,

    // Reset the Style Manager and add new properties for MJML
    resetStyleManager: 1,

    // Column padding (this way it's easier select columns)
    columnsPadding: '10px 0',
  };

  // Load defaults
  for (let name in defaults) {
    if (!(name in c))
      c[name] = defaults[name];
  }

  let config = editor.getConfig();

  // I need to prevent forced class creation as classes aren't working
  // at the moment
  config.forceClass = 0;

  // Don't need to create css rules with media
  config.devicePreviewMode = 1;

  // Add Blocks
  require('./blocks').default(editor, c);

  // Add Components
  require('./components').default(editor, c);

  // Add Commands
  require('./commands').default(editor, c);

  // Add Buttons
  require('./buttons').default(editor, c);

  // Extend Style Manager
  require('./style').default(editor, c);

  // Update devices
  if (c.resetDevices) {
    const dm = editor.DeviceManager;
    dm.getAll().reset();
    dm.add('Desktop', '');
    dm.add('Mobile', '320px');
  }

});
