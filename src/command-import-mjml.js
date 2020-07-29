export default (editor, opt = {}) => {
  const config = editor.getConfig();
  const codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
  const btnImp = document.createElement('button');
  const container = document.createElement('div');
  const pfx = config.stylePrefix || '';

  // Init import button
  btnImp.innerHTML = editor.I18n.t('grapesjs-mjml.panels.import.button');
  btnImp.className = `${pfx}btn-prim ${pfx}btn-import`;
  btnImp.onclick = () => {
    const code = codeViewer.editor.getValue();
    editor.DomComponents.getWrapper().set('content', '');
    editor.setComponents(code.trim());
    editor.Modal.close();
    editor.runCommand('mjml-import:change');
  };

  // Init code viewer
  codeViewer.set({
    codeName: 'htmlmixed',
    theme: opt.codeViewerTheme,
    readOnly: 0
  });

  return {
    run(editor, sender = {}) {
      const modal = editor.Modal;
      let viewer = codeViewer.editor;
      modal.setTitle(editor.I18n.t('grapesjs-mjml.panels.import.title'));

      // Init code viewer if not yet instantiated
      if (!viewer) {
        const txtarea = document.createElement('textarea');
        const labelImport = editor.I18n.t('grapesjs-mjml.panels.import.label');

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

  };
};
