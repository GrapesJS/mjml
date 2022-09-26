import type grapesjs from 'grapesjs';
import { RequiredPluginOptions } from '.';

export default (editor: grapesjs.Editor, opts: RequiredPluginOptions) => {
  const bm = editor.BlockManager;
  const allBlocks = {
    category: editor.I18n.t('grapesjs-mjml.category'),
  };

  const imagePlaceholderSrc = opts.imagePlaceholderSrc || 'https://via.placeholder.com/350x250/78c5d6/fff';

  opts.resetBlocks && bm.getAll().reset();

  const addBlock = (id: string, def: grapesjs.BlockOptions) => {
    opts.blocks.indexOf(id)! >= 0 && editor.Blocks.add(id, {
      select: true,
      category: editor.I18n.t('grapesjs-mjml.category'),
      ...def,
      ...opts.block(id),
    });
  };

  addBlock('mj-1-column', {
    label: editor.I18n.t('grapesjs-mjml.components.names.oneColumn'),
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M2 20h20V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"/>
    </svg>`,
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
      </mj-section>`,
  });

  addBlock('mj-2-columns', {
    label: editor.I18n.t('grapesjs-mjml.components.names.twoColumn'),
    media: `<svg viewBox="0 0 23 24">
      <path fill="currentColor" d="M2 20h8V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM13 20h8V4h-8v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1Z"/>
    </svg>`,
    content: `<mj-section>
      <mj-column><mj-text>Content 1</mj-text></mj-column>
      <mj-column><mj-text>Content 2</mj-text></mj-column>
    </mj-section>`,
  });

  addBlock('mj-3-columns', {
    label: editor.I18n.t('grapesjs-mjml.components.names.threeColumn'),
    media: `<svg viewBox="0 0 23 24">
      <path fill="currentColor" d="M2 20h4V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM17 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1ZM9.5 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"/>
    </svg>`,
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
        <mj-column><mj-text>Content 2</mj-text></mj-column>
        <mj-column><mj-text>Content 3</mj-text></mj-column>
      </mj-section>`,
  });

  addBlock('mj-text', {
    label: editor.I18n.t('grapesjs-mjml.components.names.text'),
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
    </svg>`,
    content: '<mj-text>Insert text here</mj-text>',
    activate: true,
  });

  bm.add('mj-button', {
    label: editor.I18n.t('grapesjs-mjml.components.names.button'),
    content: '<mj-button>Button</mj-button>',
    attributes: { class: 'gjs-fonts gjs-f-button' },
    ...allBlocks,
  });

  bm.add('mj-image', {
    label: editor.I18n.t('grapesjs-mjml.components.names.image'),
    content: '<mj-image src="' + imagePlaceholderSrc + '"/>',
    attributes: { class: 'fa fa-image' },
    ...allBlocks,
  });

  bm.add('mj-divider', {
    label: editor.I18n.t('grapesjs-mjml.components.names.divider'),
    content: '<mj-divider/>',
    attributes: { class: 'gjs-fonts gjs-f-divider' },
    ...allBlocks,
  });

  bm.add('mj-social-group', {
    label: editor.I18n.t('grapesjs-mjml.components.names.socialGroup'),
    content: `<mj-social font-size="12px" icon-size="24px" border-radius="12px" mode="horizontal">
        <mj-social-element name="facebook"></mj-social-element>
        <mj-social-element name="google"></mj-social-element>
        <mj-social-element name="twitter"></mj-social-element>
      </mj-social>`,
    attributes: { class: 'fa fa-share-alt' },
    ...allBlocks,
  });

  bm.add('mj-social-element', {
    label: editor.I18n.t('grapesjs-mjml.components.names.socialElement'),
    content: '<mj-social-element name="facebook" />',
    attributes: { class: 'fa fa-share-alt' },
    ...allBlocks,
  });

  bm.add('mj-spacer', {
    label: editor.I18n.t('grapesjs-mjml.components.names.spacer'),
    content: '<mj-spacer/>',
    attributes: { class: 'fa fa-arrows-v' },
    ...allBlocks,
  });

  bm.add('mj-navbar', {
    label: editor.I18n.t('grapesjs-mjml.components.names.navBar'),
    content: `<mj-navbar>
    <mj-navbar-link>Getting started</mj-navbar-link>
    <mj-navbar-link>Try it live</mj-navbar-link>
    <mj-navbar-link>Templates</mj-navbar-link>
    <mj-navbar-link>Components</mj-navbar-link>
    </mj-navbar>`,
    attributes: { class: 'fa fa-bars' },
    ...allBlocks,
  });

  bm.add('mj-navbar-link', {
    label: editor.I18n.t('grapesjs-mjml.components.names.navLink'),
    content: `<mj-navbar-link>Link 1</mj-navbar-link>`,
    attributes: { class: 'gjs-fonts gjs-f-button' },
    ...allBlocks,
  });

  bm.add('mj-hero', {
    label: editor.I18n.t('grapesjs-mjml.components.names.hero'),
    content: `<mj-hero mode="fixed-height" height="469px" background-width="600px" background-height="469px" background-url="https://cloud.githubusercontent.com/assets/1830348/15354890/1442159a-1cf0-11e6-92b1-b861dadf1750.jpg" background-color="#2a3448" padding="100px 0px">
      <mj-text padding="20px" color="#ffffff" font-family="Helvetica" align="center" font-size="45px" line-height="45px" font-weight="900">
        GO TO SPACE
      </mj-text>
      <mj-button href="https://mjml.io/" align="center">
        ORDER YOUR TICKET NOW
      </mj-button>
    </mj-hero>`,
    attributes: { class: 'fa fa-id-card' },
    ...allBlocks,
  });

  bm.add('mj-wrapper', {
    label: editor.I18n.t('grapesjs-mjml.components.names.wrapper'),
    content: `<mj-wrapper border="1px solid #000000" padding="50px 30px">
    <mj-section border-top="1px solid #aaaaaa" border-left="1px solid #aaaaaa" border-right="1px solid #aaaaaa" padding="20px">
      <mj-column>
        <mj-image padding="0" src="${imagePlaceholderSrc}" />
      </mj-column>
    </mj-section>
    <mj-section border-left="1px solid #aaaaaa" border-right="1px solid #aaaaaa" padding="20px" border-bottom="1px solid #aaaaaa">
      <mj-column border="1px solid #dddddd">
        <mj-text padding="20px"> First line of text </mj-text>
        <mj-divider border-width="1px" border-style="dashed" border-color="lightgrey" padding="0 20px" />
        <mj-text padding="20px"> Second line of text </mj-text>
      </mj-column>
    </mj-section>
  </mj-wrapper>`,
    attributes: { class: 'fa fa-window-maximize' },
    ...allBlocks,
  });

  bm.add('mj-raw', {
    label: editor.I18n.t('grapesjs-mjml.components.names.raw'),
    content: `<mj-raw>
      <div class="container">
        <img class="item" src="https://source.unsplash.com/random/200x141" alt="Example image">
        <img class="item" src="https://source.unsplash.com/random/200x142" alt="Example image">
        <img class="item" src="https://source.unsplash.com/random/200x143" alt="Example image">
        <img class="item" src="https://source.unsplash.com/random/200x144" alt="Example image">
        <img class="item" src="https://source.unsplash.com/random/200x145" alt="Example image">
        <img class="item" src="https://source.unsplash.com/random/200x146" alt="Example image">
      </div>
    </mj-raw>`,
    attributes: { class: 'fa fa-html5' },
    ...allBlocks,
  });

};
