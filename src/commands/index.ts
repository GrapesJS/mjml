import type grapesjs from 'grapesjs';
import { RequiredPluginOptions } from '..';
import importCommand from './command-import-mjml';
import exportCommand from './command-export-mjml';

export const cmdDeviceDesktop = 'set-device-desktop';
export const cmdDeviceTablet = 'set-device-tablet';
export const cmdDeviceMobile = 'set-device-mobile';
export const cmdImportMjml = 'mjml-import';

export default (editor: grapesjs.Editor, opts: RequiredPluginOptions) => {
  const { Commands } = editor;
  const exportName = opts.overwriteExport ? 'export-template' : 'mjml-export';

  Commands.add('mjml-import', importCommand(editor, opts));
  Commands.add('mjml-import:change', {
    run() {
      const code = editor.getHtml();
      return code.trim();
    }
  });
  Commands.add(exportName, exportCommand(editor, opts));

  // Device commands
  Commands.add(cmdDeviceDesktop, {
    run: ed => ed.setDevice('Desktop'),
    stop: () => {},
  });
  Commands.add(cmdDeviceTablet, {
    run: ed => ed.setDevice('Tablet'),
    stop: () => {},
  });
  Commands.add(cmdDeviceMobile, {
    run: ed => ed.setDevice('Mobile portrait'),
    stop: () => {},
  });

};
