export default (editor, opt = {}) => {

  let config = editor.getConfig();
  let codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
  let btnImp = document.createElement('button');
  let container = document.createElement('div');
  let pfx = config.stylePrefix || '';

  // Init import button
  btnImp.innerHTML = opt.modalBtnImport;
  btnImp.className = pfx + 'btn-prim ' + pfx + 'btn-import';
  btnImp.onclick = () => {
    let code = codeViewer.editor.getValue();
    code = code.replace(/<\/?mj-body>|<\/?mjml>/ig, '');
    editor.DomComponents.getWrapper().set('content', '');
    editor.setComponents(code.trim());
    editor.Modal.close();
  };

  // Init code viewer
  codeViewer.set({
    codeName: 'htmlmixed',
    theme: opt.codeViewerTheme,
    readOnly: 0
  });

  return {

    run(editor, sender = {}) {
      let modal = editor.Modal;
      let modalContent = modal.getContentEl();
      let viewer = codeViewer.editor;
      modal.setTitle(opt.modalTitleImport);

      // Init code viewer if not yet instantiated
      if (!viewer) {
        let txtarea = document.createElement('textarea');
        let labelImport = opt.modalLabelImport;
        if (labelImport) {
          let labelEl = document.createElement('div');
          labelEl.className = pfx + 'import-label';
          labelEl.innerHTML = labelImport;
          container.appendChild(labelEl);
        }
        container.appendChild(txtarea);
        container.appendChild(btnImp);
        codeViewer.init(txtarea);
        viewer = codeViewer.editor;
      }

      modal.setContent('');
      modal.setContent(container);
      codeViewer.setContent(opt.importPlaceholder);
      modal.open();
      viewer.refresh();
      sender.set && sender.set('active', 0);
    },

  }
}
