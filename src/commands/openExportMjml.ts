import type grapesjs from 'grapesjs';
import { RequiredPluginOptions } from '..';
import { mjmlConvert } from '../components/utils.js';

type CommandInterface = Parameters<grapesjs.Commands["add"]>[1];

export default (editor: grapesjs.Editor, opts: RequiredPluginOptions, cmdId: string): CommandInterface => {
  const config = editor.getConfig();
  // @ts-ignore
  const codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
  const container = document.createElement('div');
  const cmdm = editor.Commands;
  container.style.display = 'flex';
  container.style.justifyContent = 'space-between';

  // Init code viewer
  codeViewer.set({
    codeName: 'htmlmixed',
    theme: opts.codeViewerTheme,
  });

  const getMjml = () => {
    const mjml = opts.preMjml + editor.getHtml() + opts.postMjml;
    return mjmlConvert(mjml, opts.fonts);
  };

  // Set the command which could be used outside
  cmdm.add('mjml-get-code', {
    run() {
      return getMjml();
    }
  });

  let mjmlCodeViewer: any;
  let htmlCodeViewer: any;

  return {
    buildEditor(label: string): any {
      // const ecm = editor.CodeManager;
      // @ts-ignore
      // const cm = ecm.getViewer('CodeMirror').clone();
      // const txtarea = document.createElement('textarea');
      const el = document.createElement('div');
      el.style.flex = '1 0 auto';
      el.style.padding = '5px';
      el.style.maxWidth = '50%';
      el.style.boxSizing = 'border-box';

      // const codeEditor = cm.set({
      //   label: label,
      //   codeName: 'htmlmixed',
      //   theme: opts.codeViewerTheme,
      //   input: txtarea,
      // });
      // @ts-ignore
      const codeEditor = editor.CodeManager.createViewer({
        label,
        codeName: 'htmlmixed',
        theme: opts.codeViewerTheme,
      });

      // @ts-ignore
      // const elEditor = new ecm.EditorView({ model: codeEditor, config }).render().el;
      // el.appendChild(elEditor);
      // codeEditor.init(txtarea);
      el.appendChild(codeEditor.getElement());
      return { codeEditor, el };


      // const type = !isUndefined(opts.type) ? opts.type : defaultViewer;
      // const viewer = this.getViewer(type) && this.getViewer(type).clone();
      // const cont = document.createElement('div');
      // const txtarea = document.createElement('textarea');
      // cont.appendChild(txtarea);
      // viewer.set(opts);
      // viewer.init(txtarea);
      // viewer.setElement(cont);
    },

    run(editor, sender) {
      const title = editor.I18n.t('grapesjs-mjml.panels.export.title');

      if (!mjmlCodeViewer) {
        // @ts-ignore
        const codeViewer = this.buildEditor('MJML');
        mjmlCodeViewer = codeViewer.codeEditor;
        container.appendChild(codeViewer.el);
      }

      if (!htmlCodeViewer) {
        // @ts-ignore
        const codeViewer = this.buildEditor('HTML');
        htmlCodeViewer = codeViewer.codeEditor;
        container.appendChild(codeViewer.el);
      }

      editor.Modal
        .open({
          title,
          content: container
        })
        .onceClose(() => {
          sender.set && sender.set('active', false);
          editor.stopCommand(cmdId)
        })

      if (mjmlCodeViewer) {
        mjmlCodeViewer.setContent(opts.preMjml + editor.getHtml() + opts.postMjml);
        mjmlCodeViewer.editor.refresh();
      }

      if (htmlCodeViewer) {
        const mjml = getMjml();
        if (mjml.errors.length) {
          mjml.errors.forEach((err: any) => {
            console.warn(err.formattedMessage);
          });
        }
        htmlCodeViewer.setContent(mjml.html);
        htmlCodeViewer.editor.refresh();
      }
    },

    stop(editor) {
      editor.Modal.close();
    },
  };
};
