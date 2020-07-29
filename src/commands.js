import tglImagesCommand from './toggleImagesCommand';
import importCommand from './command-import-mjml';
import exportCommand from './command-export-mjml';

export default (editor, opt = {}) => {
  const cmd = editor.Commands;
  const exportName = opt.overwriteExport ? 'export-template' : 'mjml-export';

  cmd.add('mjml-import', importCommand(editor, opt));
  cmd.add('mjml-import:change', {
    run() {
      const code = editor.getHtml();
      return code.trim();
    }
  });
  cmd.add(exportName, exportCommand(editor, opt));

  cmd.add(opt.cmdTglImages, tglImagesCommand(opt));

  cmd.add('undo', {
    run(editor, sender) {
      sender.set('active', 0);
      editor.UndoManager.undo(1);
    }
  });

  cmd.add('redo', {
    run(editor, sender) {
      sender.set('active', 0);
      editor.UndoManager.redo(1);
    }
  });
  cmd.add('set-device-desktop', {
    run(editor) {
      editor.setDevice('Desktop');
    }
  });
  cmd.add('set-device-tablet', {
    run(editor) {
      editor.setDevice('Tablet');
    }
  });
  cmd.add('set-device-mobile', {
    run(editor) {
      editor.setDevice('Mobile portrait');
    }
  });

};
