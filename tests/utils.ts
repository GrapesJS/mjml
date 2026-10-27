import grapesjs, { CanvasFrameEventProps, EditorConfig, Plugin } from 'grapesjs';

// Prevent jsdom from repeating iframe initialization after document.close().
const stopIframeReload = ({ el }: CanvasFrameEventProps) => {
  el.onload = null;
};

const fixJsDom: Plugin = (editor) => {
  editor.on(editor.Canvas.events.frameLoad, stopIframeReload);
};

export function createTestEditor(config: EditorConfig) {
  const editor = grapesjs.init({
    storageManager: false,
    ...config,
    plugins: [fixJsDom, ...(config.plugins || [])],
  });

  // The hidden editor emits its own frame events.
  editor.getModel().shallow.on(editor.Canvas.events.frameLoad, stopIframeReload);

  return editor;
}
