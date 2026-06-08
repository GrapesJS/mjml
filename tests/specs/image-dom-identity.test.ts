import grapesjs, { Editor } from 'grapesjs';
import grapesJSMJML from '../../src';

const rawMjml = `
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-image src="https://example.com/image.png"></mj-image>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`;

describe('mj-image DOM identity', () => {
  let editor: Editor;

  beforeEach((done) => {
    document.body.innerHTML = '<div id="gjs"></div>';
    editor = grapesjs.init({
      container: '#gjs',
      plugins: [grapesJSMJML],
    });

    editor.getModel().loadOnStart();
    editor.on('change:readyLoad', () => done());
  });

  afterEach(() => {
    editor.destroy();
  });

  const getImage = () => {
    editor.addComponents(rawMjml);

    return editor.getWrapper()!.findType('mj-image')[0];
  };

  test('preserves the rendered subtree when an MJML attribute changes', () => {
    const image = getImage();
    const root = image.getEl()!;
    const td = root.querySelector('td');
    const img = root.querySelector('img');

    image.addAttributes({ alt: 'updated' });

    expect(image.getEl()).toBe(root);
    expect(root.querySelector('td')).toBe(td);
    expect(root.querySelector('img')).toBe(img);
    expect(img?.getAttribute('alt')).toBe('updated');
  });

  // The actual anti-flicker guarantee: a non-src edit must NOT re-set the img's
  // `src` attribute. Node identity alone (the tests above) does not prove this —
  // `setAttribute('src', sameValue)` keeps the node yet still makes the browser
  // refetch/repaint the image. This pins `syncAttributes`' "write only changed
  // attributes" guard, so dropping that guard fails here even though identity holds.
  test('does not re-set src on a non-src edit (the no-refetch guarantee)', () => {
    const image = getImage();
    const img = image.getEl()!.querySelector('img')!;
    const originalSrc = img.getAttribute('src');
    const setAttribute = jest.spyOn(img, 'setAttribute');

    image.addAttributes({ alt: 'updated' });

    const srcWrites = setAttribute.mock.calls.filter(([name]) => name === 'src');
    expect(srcWrites).toHaveLength(0);
    expect(img.getAttribute('src')).toBe(originalSrc);

    setAttribute.mockRestore();
  });

  test('preserves the rendered img node when src changes', () => {
    const image = getImage();
    const img = image.getEl()!.querySelector('img');

    image.set('src', 'https://example.com/updated.png');

    expect(image.getEl()!.querySelector('img')).toBe(img);
    expect(img?.getAttribute('src')).toBe('https://example.com/updated.png');
  });

  test('preserves the rendered img node when style changes', () => {
    const image = getImage();
    const img = image.getEl()!.querySelector('img');

    image.addStyle({ width: '200px' });

    expect(image.getEl()!.querySelector('img')).toBe(img);
    expect(img?.getAttribute('width')).toBe('200');
  });

  test('updates wrapper attributes without replacing the rendered subtree', () => {
    const image = getImage();
    const td = image.getEl()!.querySelector('td');
    const img = image.getEl()!.querySelector('img');
    const style = td?.getAttribute('style');

    image.addStyle({ 'padding-top': '20px' });

    expect(image.getEl()!.querySelector('td')).toBe(td);
    expect(image.getEl()!.querySelector('img')).toBe(img);
    expect(td?.getAttribute('style')).not.toBe(style);
  });

  test('updates a linked image after its wrapper has been added', () => {
    const image = getImage();

    image.addAttributes({ href: 'https://example.com/first' });

    const link = image.getEl()!.querySelector('a');
    const img = image.getEl()!.querySelector('img');

    image.addAttributes({ href: 'https://example.com/second' });

    expect(image.getEl()!.querySelector('a')).toBe(link);
    expect(image.getEl()!.querySelector('img')).toBe(img);
    expect(link?.getAttribute('href')).toBe('https://example.com/second');
  });

  test('removes a link wrapper when href is removed', () => {
    const image = getImage();

    image.addAttributes({ href: 'https://example.com' });
    image.removeAttributes(['href']);

    expect(image.getEl()!.querySelector('a')).toBeNull();
    expect(image.getEl()!.querySelector('img')).toBeTruthy();
  });

  // Known limitation: adding/removing the link wrapper changes the subtree
  // structure (td > img <-> td > a > img), so the index-based reconciliation
  // replaces the <img> rather than moving it. This test locks that behavior so
  // the boundary is intentional and a future change to it is caught.
  test('replaces the rendered img when a link wrapper is added or removed', () => {
    const image = getImage();
    const imgBefore = image.getEl()!.querySelector('img');

    image.addAttributes({ href: 'https://example.com' });
    const imgWrapped = image.getEl()!.querySelector('img');

    expect(image.getEl()!.querySelector('a')).toBeTruthy();
    expect(imgWrapped).not.toBe(imgBefore);

    image.removeAttributes(['href']);
    const imgUnwrapped = image.getEl()!.querySelector('img');

    expect(image.getEl()!.querySelector('a')).toBeNull();
    expect(imgUnwrapped).not.toBe(imgWrapped);
  });
});
