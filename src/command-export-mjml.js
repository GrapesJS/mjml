import { mjml2html } from 'mjml';

export default (editor, opt = {}) => {
  let config = editor.getConfig();
  let codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
  let container = document.createElement('div');
  container.style = 'display: flex; justify-content: space-between;';
  let pfx = config.stylePrefix || '';
  var cmdm = editor.Commands;

  // Init code viewer
  codeViewer.set({
    codeName: 'htmlmixed',
    theme: opt.codeViewerTheme,
  });

  const getMjml = () => {
    const mjml = opt.preMjml + editor.getHtml()  + opt.postMjml;
    return mjml2html(mjml);
  };

  // Set the command which could be used outside
  cmdm.add('mjml-get-code', {
    run() {
      return getMjml();
    }
  });

  let mjmlCode;
  let htmlCode;

  return {

    buildEditor(label) {
      const ecm = editor.CodeManager;
      let cm = ecm.getViewer('CodeMirror').clone();

      let txtarea = document.createElement('textarea');
      let el = document.createElement('div');
      el.style = 'flex:1 0 auto; padding:5px; max-width:50%; box-sizing:border-box;';

      let codeEditor = cm.set({
        label: label,
        codeName: 'htmlmixed',
        theme: opt.codeViewerTheme,
        input: txtarea,
      });

      let elEditor = new ecm.EditorView({model: codeEditor, config  }).render().el;
      el.appendChild(elEditor);
      codeEditor.init(txtarea);
      return {codeEditor, el};
    },

    run(editor, sender = {}) {
      let modal = editor.Modal;
      let modalContent = modal.getContentEl();
      modal.setTitle(opt.modalTitleExport);
      modal.setContent('');
      modal.setContent(container);

      if (!mjmlCode) {
        let codeViewer = this.buildEditor('MJML');
        mjmlCode = codeViewer.codeEditor;
        container.appendChild(codeViewer.el);
      }
      if (!htmlCode) {
        let codeViewer = this.buildEditor('HTML');
        htmlCode = codeViewer.codeEditor;
        container.appendChild(codeViewer.el);
      }

      modal.open();

      if (mjmlCode) {
        mjmlCode.setContent(opt.preMjml + editor.getHtml()  + opt.postMjml);
        //mjmlCode.editor.setOption('lineWrapping', 1);
        mjmlCode.editor.refresh();
      }
      if (htmlCode) {
        let mjml = getMjml();
        if(mjml.errors.length) {
          mjml.errors.forEach((err) => {
            console.warn(err.formattedMessage);
          });
        }
        htmlCode.setContent(mjml.html);
        //htmlCode.editor.setOption('lineWrapping', 1);
        htmlCode.editor.refresh();
      }

      sender.set && sender.set('active', 0);
    },

  }
}
