export default (editor, opt = {}) => {
  const bm = editor.BlockManager;
  const allBlocks = {
    category: editor.I18n.t('grapesjs-mjml.category'),
  };

  const imagePlaceholderSrc = opt.imagePlaceholderSrc || 'https://via.placeholder.com/350x250/78c5d6/fff';

  opt.resetBlocks && bm.getAll().reset();

  bm.add('mj-1-column', {
    label: editor.I18n.t('grapesjs-mjml.components.names.oneColumn'),
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
      </mj-section>`,
    attributes: { class: 'gjs-fonts gjs-f-b1' },
    ...allBlocks,
  });

  bm.add('mj-2-columns', {
    label: editor.I18n.t('grapesjs-mjml.components.names.twoColumn'),
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
        <mj-column><mj-text>Content 2</mj-text></mj-column>
      </mj-section>`,
    attributes: { class: 'gjs-fonts gjs-f-b2' },
    ...allBlocks,
  });

  bm.add('mj-3-columns', {
    label: editor.I18n.t('grapesjs-mjml.components.names.threeColumn'),
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
        <mj-column><mj-text>Content 2</mj-text></mj-column>
        <mj-column><mj-text>Content 3</mj-text></mj-column>
      </mj-section>`,
    attributes: { class: 'gjs-fonts gjs-f-b3' },
    ...allBlocks,
  });

  bm.add('mj-text', {
    label: editor.I18n.t('grapesjs-mjml.components.names.text'),
    content: '<mj-text>Insert text here</mj-text>',
    attributes: { class: 'gjs-fonts gjs-f-text' },
    ...allBlocks,
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
