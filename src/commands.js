import tglImagesCommand from './toggleImagesCommand';

export default (editor, opt = {}) => {
  const cmd = editor.Commands;
  const importCommand = require('./command-import-mjml');
  const exportCommand = require('./command-export-mjml');
  const exportName = opt.overwriteExport ? 'export-template' : 'mjml-export';

  cmd.add('mjml-import', importCommand.default(editor, opt));
  cmd.add(exportName, exportCommand.default(editor, opt));

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

}
