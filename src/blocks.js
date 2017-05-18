export default (editor, opt = {}) => {
  let bm = editor.BlockManager;

  if (opt.resetBlocks) {
    bm.getAll().reset();
  }
/*
  bm.add('mj-section', {
    label: 'Section',
    content: '<mj-section></mj-section>',
    attributes: {
      class: 'gjs-fonts gjs-f-b1',
      // Workaround
      'data-type': 'mj-section',
    },
  });

  bm.add('mj-column', {
    label: 'Column',
    content: '<mj-column></mj-column>',
    attributes: {
      class: 'gjs-fonts gjs-f-b3',
      'data-type': 'mj-column',
    },
  });

  */

  bm.add('mj-1-column', {
    label: '1 Column',
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
      </mj-section>`,
    attributes: {
      class: 'gjs-fonts gjs-f-b1',
      // Workaround
      'data-type': 'mj-section',
    },
  });

  bm.add('mj-2-columns', {
    label: '2 Columns',
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
        <mj-column><mj-text>Content 2</mj-text></mj-column>
      </mj-section>`,
    attributes: {
      class: 'gjs-fonts gjs-f-b2',
      // Workaround
      'data-type': 'mj-section',
    },
  });

  bm.add('mj-3-columns', {
    label: '3 Columns',
    content: `<mj-section>
        <mj-column><mj-text>Content 1</mj-text></mj-column>
        <mj-column><mj-text>Content 2</mj-text></mj-column>
        <mj-column><mj-text>Content 3</mj-text></mj-column>
      </mj-section>`,
    attributes: {
      class: 'gjs-fonts gjs-f-b3',
      // Workaround
      'data-type': 'mj-section',
    },
  });

  bm.add('mj-text', {
    label: 'Text',
    content: '<mj-text>Insert text here</mj-text>',
    attributes: {
      class: 'gjs-fonts gjs-f-text',
      'data-type': 'mj-text',
    },
  });

  bm.add('mj-button', {
    label: 'Button',
    content: '<mj-button>Button</mj-button>',
    attributes: {
      class: 'gjs-fonts gjs-f-button',
      'data-type': 'mj-button',
    },
  });

  bm.add('mj-image', {
    label: 'Image',
    content: '<mj-image src="http://placehold.it/350x250/78c5d6/fff">',
    attributes: {
      class: 'fa fa-image',
      'data-type': 'mj-image',
    },
  });

  bm.add('mj-divider', {
    label: 'Divider',
    content: '<mj-divider/>',
    attributes: {
      class: 'gjs-fonts gjs-f-divider',
      'data-type': 'mj-divider',
    },
  });

  bm.add('mj-social', {
    label: 'Social',
    content: '<mj-social/>',
    attributes: {
      class: 'fa fa-share-alt',
      'data-type': 'mj-social',
    },
  });
}
