export default (editor, opt = {}) => {
  const bm = editor.BlockManager;
  const allBlocks = {
    category: opt.categoryLabel,
  };

  opt.resetBlocks && bm.getAll().reset();

  bm.add('mj-1-column', {
    label: '1 Column',
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
      </mj-section>`,
    attributes: { class: 'gjs-fonts gjs-f-b1' },
    ...allBlocks,
  });

  bm.add('mj-2-columns', {
    label: '2 Columns',
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
        <mj-column><mj-text>Content 2</mj-text></mj-column>
      </mj-section>`,
    attributes: { class: 'gjs-fonts gjs-f-b2' },
    ...allBlocks,
  });

  bm.add('mj-3-columns', {
    label: '3 Columns',
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
        <mj-column><mj-text>Content 2</mj-text></mj-column>
        <mj-column><mj-text>Content 3</mj-text></mj-column>
      </mj-section>`,
    attributes: { class: 'gjs-fonts gjs-f-b3' },
    ...allBlocks,
  });

  bm.add('mj-text', {
    label: 'Text',
    content: '<mj-text>Insert text here</mj-text>',
    attributes: { class: 'gjs-fonts gjs-f-text' },
    ...allBlocks,
  });

  bm.add('mj-button', {
    label: 'Button',
    content: '<mj-button>Button</mj-button>',
    attributes: { class: 'gjs-fonts gjs-f-button' },
    ...allBlocks,
  });

  bm.add('mj-image', {
    label: 'Image',
    content: '<mj-image src="http://placehold.it/350x250/78c5d6/fff">',
    attributes: { class: 'fa fa-image' },
    ...allBlocks,
  });

  bm.add('mj-divider', {
    label: 'Divider',
    content: '<mj-divider/>',
    attributes: { class: 'gjs-fonts gjs-f-divider' },
    ...allBlocks,
  });

  bm.add('mj-social-group', {
    label: 'Group Social',
    content: `<mj-social font-size="12px" icon-size="24px" border-radius="12px" mode="horizontal">
        <mj-social-element name="facebook"></mj-social-element>
        <mj-social-element name="google"></mj-social-element>
        <mj-social-element name="twitter"></mj-social-element>
      </mj-social>`,
    attributes: { class: 'fa fa-share-alt' },
    ...allBlocks,
  });

  bm.add('mj-social-element', {
    label: 'Social Element',
    content: '<mj-social-element name="facebook" />',
    attributes: { class: 'fa fa-share-alt' },
    ...allBlocks,
  });

  bm.add('mj-spacer', {
    label: 'Spacer',
    content: '<mj-spacer/>',
    attributes: { class: 'fa fa-arrows-v' },
    ...allBlocks,
  });

  bm.add('mj-navbar', {
    label: 'NavBar',
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
    label: 'NavBar Link',
    content: `<mj-navbar-link>Link 1</mj-navbar-link>`,
    attributes: { class: 'gjs-fonts gjs-f-button' },
    ...allBlocks,
  });

  bm.add('mj-carousel', {
    label: 'Carousel',
    content: `<mj-carousel>
    <mj-carousel-image src="https://www.mailjet.com/wp-content/uploads/2016/11/ecommerce-guide.jpg"></mj-carousel-image>
    <mj-carousel-image src="https://www.mailjet.com/wp-content/uploads/2016/09/3@1x.png"></mj-carousel-image>
    <mj-carousel-image src="https://www.mailjet.com/wp-content/uploads/2016/09/1@1x.png"></mj-carousel-image>
    </mj-carousel>`,
    attributes: { class: 'fa fa-images' },
    allBlocks
  });

  bm.add('mj-carousel-image', {
    label: 'Carousel Image',
    content: '<mj-carousel-image src="http://placehold.it/350x250/78c5d6/fff" ></mj-carousel-image>',
    attributes: { class: 'fa fa-image' },
    allBlocks
  });

};
