grapesjs.plugins.add('gjs-mjml', (editor, opts = {}) => {
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

  /*
  styleManager : {
  sectors: [{
    name: 'General',
    buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
    properties:[{
        name: 'Alignment',
        property: 'float',
        type: 'radio',
        defaults: 'none',
        list: [
          { value: 'none', className: 'fa fa-times'},
          { value: 'left', className: 'fa fa-align-left'},
          { value: 'right', className: 'fa fa-align-right'}
        ],
      },
      { property: 'position', type: 'select'}
    ],
  },{
      name: 'Dimension',
      open: false,
      buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
      properties:[{
        property: 'margin',
        properties:[
          { name: 'Top', property: 'margin-top'},
          { name: 'Right', property: 'margin-right'},
          { name: 'Bottom', property: 'margin-bottom'},
          { name: 'Left', property: 'margin-left'}
        ],
      },{
        property  : 'padding',
        detached: true,
        properties:[
          { name: 'Top', property: 'padding-top'},
          { name: 'Right', property: 'padding-right'},
          { name: 'Bottom', property: 'padding-bottom'},
          { name: 'Left', property: 'padding-left'}
        ],
      }],
    },{
      name: 'Typography',
      open: false,
      buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'align', 'text-decoration', 'text-shadow'],
      properties:[
        { name: 'Font', property: 'font-family'},
        { name: 'Weight', property: 'font-weight'},
        { name:  'Font color', property: 'color'},
        {
          property: 'text-align',
          type: 'radio',
          defaults: 'left',
          list: [
            { value : 'left',  name : 'Left',    className: 'fa fa-align-left'},
            { value : 'center',  name : 'Center',  className: 'fa fa-align-center' },
            { value : 'right',   name : 'Right',   className: 'fa fa-align-right'},
            { value : 'justify', name : 'Justify',   className: 'fa fa-align-justify'}
          ],
        },{
          property: 'align',
          type: 'radio',
          defaults: 'left',
          list: [
            { value : 'left',  name : 'Left',    className: 'fa fa-align-left'},
            { value : 'center',  name : 'Center',  className: 'fa fa-align-center' },
            { value : 'right',   name : 'Right',   className: 'fa fa-align-right'},
            { value : 'justify', name : 'Justify',   className: 'fa fa-align-justify'}
          ],
        },{
          property: 'text-decoration',
          type: 'radio',
          defaults: 'none',
          list: [
            { value: 'none', name: 'None', className: 'fa fa-times'},
            { value: 'underline', name: 'underline', className: 'fa fa-underline' },
            { value: 'line-through', name: 'Line-through', className: 'fa fa-strikethrough'}
          ],
        },{
          property: 'text-shadow',
          properties: [
            { name: 'X position', property: 'text-shadow-h'},
            { name: 'Y position', property: 'text-shadow-v'},
            { name: 'Blur', property: 'text-shadow-blur'},
            { name: 'Color', property: 'text-shadow-color'}
          ],
      }],
    },{
      name: 'Decorations',
      open: false,
      buildProps: [ 'background-color', 'container-background-color', 'background-url', 'background-repeat',
        'background-size', 'border-radius', 'border', 'box-shadow'],
      properties: [{
        name: 'Background color',
        property: 'container-background-color',
        type: 'color',
      },{
        property: 'background-url',
        type: 'file',
      },{
        property: 'border-radius',
        properties  : [
          { name: 'Top', property: 'border-top-left-radius'},
          { name: 'Right', property: 'border-top-right-radius'},
          { name: 'Bottom', property: 'border-bottom-left-radius'},
          { name: 'Left', property: 'border-bottom-right-radius'}
        ],
      },{
        property: 'box-shadow',
        properties: [
          { name: 'X position', property: 'box-shadow-h'},
          { name: 'Y position', property: 'box-shadow-v'},
          { name: 'Blur', property: 'box-shadow-blur'},
          { name: 'Spread', property: 'box-shadow-spread'},
          { name: 'Color', property: 'box-shadow-color'},
          { name: 'Shadow type', property: 'box-shadow-type'}
        ],
      },
      {
        property: 'border-detached',
        name: 'Border detached',
        type: 'composite',
        properties: ['border-width'],
        detached: true,
        properties: [
          { name: 'Width', property: 'border-width', type:'integer'},
          { name: 'Style', property: 'border-style', type:'select',
          list:[
              { value : 'none'},
              { value : 'solid'},
              { value : 'dotted'},
              { value : 'dashed'},
              { value : 'double'},
              { value : 'groove'},
              { value : 'ridge'},
              { value : 'inset'},
              { value : 'outset'}
            ]},
          { name: 'Color', property: 'border-color', type:'color'},
        ],
      }],
    }
  ],
  },
   */

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
