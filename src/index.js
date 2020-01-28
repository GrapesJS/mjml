import loadBlocks from './blocks';
import loadComponents from './components';
import loadCommands from './commands';
import loadButtons from './buttons';
import loadStyle from './style';

const masterPlugin = (editor, opt = {}) => {
  const config = editor.getConfig();
  const opts = {
    editor,
    cmdBtnMoveLabel: 'Move',
    cmdBtnUndoLabel: 'Undo',
    cmdBtnRedoLabel: 'Redo',
    cmdBtnDesktopLabel: 'Desktop',
    cmdBtnTabletLabel: 'Tablet',
    cmdBtnMobileLabel: 'Mobile',

    expTplBtnTitle: 'View Code',
    fullScrBtnTitle: 'FullScreen',
    swichtVwBtnTitle: 'View Components',
    defaultTemplate: '', // Default template in case the canvas is empty
    categoryLabel: '',

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

    ...opt,
  };

  // I need to prevent forced class creation as classes aren't working
  // at the moment
  config.forceClass = 0;

  // Don't need to create css rules with media
  config.devicePreviewMode = 1;

  // Doesn't work without inline styling
  config.avoidInlineStyle = 0;

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
