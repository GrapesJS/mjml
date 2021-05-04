import loadBlocks from './blocks';
import loadComponents from './components';
import loadCommands from './commands';
import loadButtons from './buttons';
import loadStyle from './style';
import en from './locale/en';

const masterPlugin = (editor, opt = {}) => {
  const config = editor.getConfig();
  const opts = {
    editor,
    // Default template in case the canvas is empty
    defaultTemplate: '',

    // Code viewer theme
    codeViewerTheme: 'hopscotch',

    // Import placeholder MJML
    importPlaceholder: '',

    // Image placeholder source for mj-image block
    imagePlaceholderSrc: '',

    // Overwrite default export command
    overwriteExport: 1,

    // String before the MJML in export code
    preMjml: '',

    // String after the MJML in export code
    postMjml: '',

    // Export 'mjml', 'html' or both (leave empty) TODO
    exportOnly: '',

    // Clean all previous blocks if true
    resetBlocks: 1,

    // Reset the Style Manager and add new properties for MJML
    resetStyleManager: 1,

    // Column padding (this way it's easier select columns)
    columnsPadding: '10px 0',

    i18n: {},

    // Custom fonts for include on MJML to HTML export options
    // e.g.: {
    //  Montserrat: 'https://fonts.googleapis.com/css?family=Montserrat',
    //  'Open Sans': 'https://fonts.googleapis.com/css?family=Open+Sans'
    // }
    fonts: {},

    ...opt,
  };

  // I need to prevent forced class creation as classes aren't working
  // at the moment
  config.forceClass = 0;

  // Don't need to create css rules with media
  config.devicePreviewMode = 1;

  // Doesn't work without inline styling
  config.avoidInlineStyle = 0;

  // Load i18n files
  editor.I18n.addMessages({
    en,
    ...opts.i18n,
  });

  [
    loadBlocks,
    loadComponents,
    loadCommands,
    loadButtons,
    loadStyle,
  ].forEach(module => module(editor, opts));

  // Update devices
  if (opts.resetDevices) {
    const dm = editor.DeviceManager;
    dm.getAll().reset();
    dm.add('Desktop', '');
    dm.add('Mobile', '320px');
    dm.add('Tablet', '820px');
  }
};
export default masterPlugin;
export const blocksPlugin = masterPlugin.blocksPlugin = loadBlocks;
export const componentsPlugin = masterPlugin.componentsPlugin = loadComponents;
export const commandsPlugin = masterPlugin.commandsPlugin =  loadCommands;
export const buttonsPlugin = masterPlugin.buttonsPlugin = loadButtons;
export const stylePlugin = masterPlugin.stylePlugin = loadStyle;
