import type grapesjs from 'grapesjs';
import { RequiredPluginOptions } from '..';
import importCommand from './command-import-mjml';
import exportCommand from './command-export-mjml';

export default (editor: grapesjs.Editor, opt: RequiredPluginOptions) => {
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
