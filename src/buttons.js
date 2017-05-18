export default (editor, opt = {}) => {

  let pnm = editor.Panels;
  let optPanel = pnm.getPanel('options');

  pnm.addButton('options', {
    id: 'mjml-import',
    className: 'fa fa-download',
    command: 'mjml-import',
  });

}
