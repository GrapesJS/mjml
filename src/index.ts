import type grapesjs from 'grapesjs';
import loadBlocks from './blocks';
import loadComponents from './components';
import loadCommands from './commands';
import loadPanels from './panels';
import loadStyle from './style';
import en from './locale/en';

export type PluginOptions = {
  /**
   * Which blocks to add.
   * @default (all)
   */
  blocks?: string[];

  /**
   * Add custom block options, based on block id.
   * @default (blockId) => ({})
   * @example (blockId) => (blockId === 'mj-hero' ? { attributes: {...} } : {})
   */
  block?: (blockId: string) => ({});

  /**
   * Code viewer theme.
   * @default 'hopscotch'
   */
  codeViewerTheme?: string;

  /**
   * Placeholder MJML template for the import modal
   * @default ''
   */
  importPlaceholder?: string;

  /**
   * Image placeholder source for mj-image block
   * @default ''
   */
  imagePlaceholderSrc?: string;

  /**
   * Overwrite default export command
   * @default true
   */
  overwriteExport?: boolean;

  /**
   * String before the MJML in export code
   * @default ''
   */
  preMjml?: string;

  /**
   * String after the MJML in export code
   * @default ''
   */
  postMjml?: string;

  /**
   * Clean all previous blocks if true
   * @default true
   */
  resetBlocks?: boolean;

  /**
   * Reset the Style Manager and add new properties for MJML
   * @default true
   */
  resetStyleManager?: boolean;

  /**
   * Clean all previous devices and set a new one for mobile
   * @default true
   */
  resetDevices?: boolean;

  /**
   * Hide the default selector manager
   * @default true
   */
   hideSelector?: boolean;

  /**
   * Experimental: use XML parser instead of HTML.
   * This should allow importing void MJML elements (without closing tags) like <mj-image/>.
   * @default false
   * @experimental
   */
   useXmlParser?: boolean;

  /**
   * Column padding (this way it's easier to select columns)
   * @default '10px 0'
   */
  columnsPadding?: string;

  /**
   * I18n object containing languages, [more info](https://grapesjs.com/docs/modules/I18n.html#configuration).
   * @default {}
   */
  i18n?: Record<string, any>;

  /**
   * Custom fonts on exported HTML header, [more info](https://github.com/mjmlio/mjml#inside-nodejs).
   * @default {}
   * @example
   * {
   *   Montserrat: 'https://fonts.googleapis.com/css?family=Montserrat',
   *   'Open Sans': 'https://fonts.googleapis.com/css?family=Open+Sans'
   * }
   */
  fonts?: Record<string, any>;

  /**
   * Load custom preset theme.
   * @default true
   */
  useCustomTheme?: boolean;
};

export type RequiredPluginOptions = Required<PluginOptions>;

const plugin: grapesjs.Plugin<PluginOptions> = (editor, opt = {}) => {
  const opts: RequiredPluginOptions = {
    blocks: [
      'mj-1-column', 'mj-2-columns', 'mj-3-columns', 'mj-text', 'mj-button', 'mj-image', 'mj-divider', 'mj-social-group',
      'mj-social-element', 'mj-spacer', 'mj-navbar', 'mj-navbar-link', 'mj-hero', 'mj-wrapper', 'mj-raw'
    ],
    block: () => ({}),
    codeViewerTheme: 'hopscotch',
    importPlaceholder: '',
    imagePlaceholderSrc: '',
    overwriteExport: true,
    preMjml: '',
    postMjml: '',
    resetBlocks: true,
    resetStyleManager: true,
    resetDevices: true,
    hideSelector: true,
    useXmlParser: false,
    useCustomTheme: true,
    columnsPadding: '10px 0',
    i18n: {},
    fonts: {},
    // Export 'mjml', 'html' or both (leave empty) TODO
    // exportOnly: '',
    ...opt,
  };

  const config = editor.getConfig();

  // I need to prevent forced class creation as classes aren't working
  // at the moment
  // @ts-ignore
  config.forceClass = false;

  // Don't need to create css rules with media
  // @ts-ignore
  config.devicePreviewMode = true;

  // Doesn't work without inline styling
  // @ts-ignore
  config.avoidInlineStyle = false;

  // Hide default selector manager
  if (opts.hideSelector) {
    const smConfig = editor.SelectorManager.getConfig();
    // @ts-ignore
    smConfig.custom = true;
  }

  // Use XML Parser
  if (opts.useXmlParser) {
    editor.Parser.getConfig().optionsHtml.htmlType = 'text/xml';
  }

  if (opts.useCustomTheme && typeof window !== 'undefined') {
    const primaryColor = '#2c2e35';
    const secondaryColor = '#888686';
    const quaternaryColor = '#f45e43';
    const prefix = 'gjs-';
    let cssString = '';

    [
      ['one', primaryColor],
      ['two', secondaryColor],
      ['four', quaternaryColor],
    ].forEach(([cnum, ccol]) => {
      cssString += `
        .${prefix}${cnum}-bg {
          background-color: ${ccol};
        }
        .${prefix}${cnum}-color {
          color: ${ccol};
        }
        .${prefix}${cnum}-color-h:hover {
          color: ${ccol};
        }
      `;
    });

    const style = document.createElement('style');
    style.innerText = cssString;
    document.head.appendChild(style);
  }

  // @ts-ignore Load i18n files
  editor.I18n.addMessages({
    en,
    ...opts.i18n,
  });

  [
    loadBlocks,
    loadComponents,
    loadCommands,
    loadPanels,
    loadStyle,
  ].forEach(module => module(editor, opts));
};

export default plugin;
