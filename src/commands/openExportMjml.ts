import type { Editor } from 'grapesjs';
import { cmdGetMjml, cmdGetMjmlToHtml } from '.';
import { RequiredPluginOptions } from '..';

export default (editor: Editor, opts: RequiredPluginOptions, cmdId: string) => {
  const { Commands } = editor;

  Commands.add(cmdId, {
    containerEl: null as HTMLElement | null,
    codeEditorMjml: null as any,
    codeEditorHtml: null as any,

    createCodeEditor(label: string) {
      const el = document.createElement('div');
      const elLabel = document.createElement('div');
      const codeEditor = this.createCodeViewer();

      elLabel.innerHTML = label;
      el.style.flex = '1 0 auto';
      el.style.padding = '5px';
      el.style.maxWidth = '50%';
      el.style.boxSizing = 'border-box';
      el.appendChild(elLabel);
      el.appendChild(codeEditor.getElement());

      return { codeEditor, el };
    },

    createCodeViewer() {
      return editor.CodeManager.createViewer({
        codeName: 'htmlmixed',
        theme: opts.codeViewerTheme,
      });
    },

    getCodeContainer(): HTMLDivElement {
      let containerEl = this.containerEl as HTMLDivElement;

      if (!containerEl) {
        containerEl = document.createElement('div');
        containerEl.style.display = 'flex';
        containerEl.style.justifyContent = 'space-between';
        this.containerEl = containerEl;
      }

      return containerEl;
    },

    run(editor, sender) {
      const container = this.getCodeContainer();
      let codeEditorMjml = this.codeEditorMjml;
      let codeEditorHtml = this.codeEditorHtml;

      if (!codeEditorMjml) {
        const codeViewer = this.createCodeEditor('MJML');
        codeEditorMjml = codeViewer.codeEditor;
        this.codeEditorMjml = codeEditorMjml;
        container.appendChild(codeViewer.el);
      }

      if (!codeEditorHtml) {
        const codeViewer = this.createCodeEditor('HTML');
        codeEditorHtml = codeViewer.codeEditor;
        this.codeEditorHtml = codeEditorHtml;
        container.appendChild(codeViewer.el);
      }

      editor.Modal
        .open({
          title: editor.I18n.t('grapesjs-mjml.panels.export.title'),
          content: container
        })
        .onceClose(() => {
          sender.set && sender.set('active', false);
          editor.stopCommand(cmdId)
        })

      if (codeEditorMjml) {
        codeEditorMjml.setContent(Commands.run(cmdGetMjml));
        codeEditorMjml.editor.refresh();
      }

      if (codeEditorHtml) {
        const mjmlResult = Commands.run(cmdGetMjmlToHtml);
        mjmlResult.errors?.forEach((error: any) => {
          editor.log(error.formattedMessage, {
            ns: cmdGetMjmlToHtml,
            level: 'warning',
            // @ts-ignore
            error,
          });
        });
        codeEditorHtml.setContent(mjmlResult.html);
        codeEditorHtml.editor.refresh();
      }
    },

    stop(editor) {
      editor.Modal.close();
    },
  });
};
