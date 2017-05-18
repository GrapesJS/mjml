export default (editor, opt = {}) => {
  let cmd = editor.Commands;
  let importCommand = require('./command-import-mjml');
  let exportCommand = require('./command-export-mjml');
  let exportName = opt.overwriteExport ? 'export-template' : 'mjml-export';

  cmd.add('mjml-import', importCommand.default(editor, opt));
  cmd.add(exportName, exportCommand.default(editor, opt));
}
