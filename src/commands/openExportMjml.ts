// @ts-nocheck TODO remove this comment with the next grapesjs release
import type grapesjs from 'grapesjs';
import { cmdGetMjml, cmdGetMjmlToHtml } from '.';
import { RequiredPluginOptions } from '..';

export default (editor: grapesjs.Editor, opts: RequiredPluginOptions, cmdId: string) => {
  const { Commands } = editor;

  Commands.add(cmdId, {
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

    createCodeViewer(): any {
      // @ts-ignore
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
      let codeEditorMjml = this.codeEditorMjml as any;
      let codeEditorHtml = this.codeEditorHtml as any;

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
