import type grapesjs from 'grapesjs';
import { RequiredPluginOptions } from '.';

export default (editor: grapesjs.Editor, opts: RequiredPluginOptions) => {
  const bm = editor.BlockManager;
  const allBlocks = {
    category: editor.I18n.t('grapesjs-mjml.category'),
  };

  const imagePlaceholderSrc = opts.imagePlaceholderSrc || 'https://via.placeholder.com/350x250/78c5d6/fff';
  const socialIcon = `<svg viewBox="0 0 24 24">
    <path fill="currentColor" d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" />
  </svg>`;

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

  addBlock('mj-button', {
    label: editor.I18n.t('grapesjs-mjml.components.names.button'),
    media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M20 20.5C20 21.3 19.3 22 18.5 22H13C12.6 22 12.3 21.9 12 21.6L8 17.4L8.7 16.6C8.9 16.4 9.2 16.3 9.5 16.3H9.7L12 18V9C12 8.4 12.4 8 13 8S14 8.4 14 9V13.5L15.2 13.6L19.1 15.8C19.6 16 20 16.6 20 17.1V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.1 2.9 14 4 14H8V12H4V4H20V12H18V14H20C21.1 14 22 13.1 22 12V4C22 2.9 21.1 2 20 2Z" />
    </svg>`,
    content: '<mj-button>Button</mj-button>',
  });

  addBlock('mj-image', {
    label: editor.I18n.t('grapesjs-mjml.components.names.image'),
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z" />
    </svg>`,
    content: `<mj-image src="${imagePlaceholderSrc}"/>`,
    activate: true,
  });

  addBlock('mj-divider', {
    label: editor.I18n.t('grapesjs-mjml.components.names.divider'),
    media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M21 18H2V20H21V18M19 10V14H4V10H19M20 8H3C2.45 8 2 8.45 2 9V15C2 15.55 2.45 16 3 16H20C20.55 16 21 15.55 21 15V9C21 8.45 20.55 8 20 8M21 4H2V6H21V4Z" />
    </svg>`,
    content: '<mj-divider/>',
  });

  addBlock('mj-social-group', {
    label: editor.I18n.t('grapesjs-mjml.components.names.socialGroup'),
    media: socialIcon,
    content: `<mj-social font-size="12px" icon-size="24px" border-radius="12px" mode="horizontal">
        <mj-social-element name="facebook"></mj-social-element>
        <mj-social-element name="google"></mj-social-element>
        <mj-social-element name="twitter"></mj-social-element>
      </mj-social>`,
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
