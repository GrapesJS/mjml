import type { Editor } from 'grapesjs';
import { RequiredPluginOptions } from '..';

export default (editor: Editor, opts: RequiredPluginOptions, cmdId: string) => {
  const config = editor.getConfig();
  const pfx = config.stylePrefix || '';

  const getI18nLabel = (label: string) => editor.I18n.t(`grapesjs-mjml.panels.import.${label}`);

  editor.Commands.add(cmdId, {
    containerEl: null as HTMLDivElement | null,
    codeEditorMjml: null as any,

    onImport(code: string) {
      editor.Components.getWrapper()?.set('content', '');
      editor.setComponents(code.trim());
      editor.Modal.close();
    },

    createCodeEditor() {
      const el = document.createElement('div');
      const codeEditor = this.createCodeViewer();
      const codeEl = codeEditor.getElement();
      const labelImport = getI18nLabel('label');
      const btnEl = document.createElement('button');

      btnEl.type = 'button';
      btnEl.innerHTML = getI18nLabel('button');
      btnEl.className = `${pfx}btn-prim ${pfx}btn-import`;
      btnEl.onclick = () => this.onImport(codeEditor.editor.getValue());

      if (labelImport) {
        const labelEl = document.createElement('div');
        labelEl.className = `${pfx}import-label`;
        labelEl.innerHTML = labelImport;
        el.appendChild(labelEl);
      }

      codeEl.className = `${pfx}code-viewer`;
      codeEl.style.margin = '10px 0';

      el.appendChild(codeEl);
      el.appendChild(btnEl);

      return { codeEditor, el };
    },

    createCodeViewer() {
      return editor.CodeManager.createViewer({
        codeName: 'htmlmixed',
        theme: opts.codeViewerTheme,
        readOnly: false,
      });
    },

    getCodeContainer(): HTMLDivElement {
      let { containerEl } = this;

      if (!containerEl) {
        containerEl = document.createElement('div');
        this.containerEl = containerEl;
      }

      return containerEl;
    },

    run(editor, sender = {}) {
      const container = this.getCodeContainer();
      let { codeEditorMjml } = this;

      if (!codeEditorMjml) {
        const result = this.createCodeEditor();
        codeEditorMjml = result.codeEditor;
        this.codeEditorMjml = codeEditorMjml;
        container.appendChild(result.el);
      }

      if (codeEditorMjml) {
        codeEditorMjml.setContent(opts.importPlaceholder);
        codeEditorMjml.editor.refresh();
      }

      editor.Modal.open({
        title: getI18nLabel('title'),
        content: container
      }).onceClose(() => {
        sender.set && sender.set('active', false);
        editor.stopCommand(cmdId)
      });
    },

    stop(editor) {
      editor.Modal.close();
    },
  });
};
