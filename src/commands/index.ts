import type grapesjs from 'grapesjs';
import { RequiredPluginOptions } from '..';
import importCommand from './openImportMjml';
import exportCommand from './openExportMjml';

export const cmdDeviceDesktop = 'set-device-desktop';
export const cmdDeviceTablet = 'set-device-tablet';
export const cmdDeviceMobile = 'set-device-mobile';
export const cmdImportMjml = 'mjml-import';
export const cmdGetMjml = 'get-mjml';

export default (editor: grapesjs.Editor, opts: RequiredPluginOptions) => {
  const { Commands } = editor;
  const exportName = opts.overwriteExport ? 'export-template' : 'mjml-export';

  Commands.add(cmdImportMjml, importCommand(editor, opts));
  Commands.add(exportName, exportCommand(editor, opts));
  Commands.add(cmdGetMjml, (ed) => ed.getHtml().trim());

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
