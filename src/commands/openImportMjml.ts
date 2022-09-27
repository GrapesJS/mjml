import type grapesjs from 'grapesjs';
import { RequiredPluginOptions } from '..';

export default (editor: grapesjs.Editor, opts: RequiredPluginOptions, cmdId: string) => {
  const config = editor.getConfig();
  // @ts-ignore
  // const codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
  // const btnImp = document.createElement('button');
  // const container = document.createElement('div');
  const pfx = config.stylePrefix || '';

  // Init import button
  // btnImp.innerHTML = editor.I18n.t('grapesjs-mjml.panels.import.button');
  // btnImp.className = `${pfx}btn-prim ${pfx}btn-import`;
  // btnImp.onclick = () => {
  //   const code = codeViewer.editor.getValue();
  //   editor.DomComponents.getWrapper().set('content', '');
  //   editor.setComponents(code.trim());
  //   editor.Modal.close();
  //   editor.runCommand('mjml-import:change');
  // };

  // Init code viewer
  // codeViewer.set({
  //   codeName: 'htmlmixed',
  //   theme: opts.codeViewerTheme,
  //   readOnly: 0
  // });

  const { Commands } = editor;

  const getI18nLabel = (label: string) => editor.I18n.t(`grapesjs-mjml.panels.import.${label}`)

  Commands.add(cmdId, {
    onImport(code: string) {
      editor.Components.getWrapper().set('content', '');
      editor.setComponents(code.trim());
      editor.Modal.close();
    },

    createCodeEditor() {
      const el = document.createElement('div');
      const codeEditor = this.createCodeViewer();
      const codeEl = codeEditor.getElement();
      const labelImport = getI18nLabel('label');
      const btnEl = document.createElement('button');

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

    createCodeViewer(): any {
      // @ts-ignore
      return editor.CodeManager.createViewer({
        codeName: 'htmlmixed',
        theme: opts.codeViewerTheme,
        readOnly: false,
      });
    },

    getCodeContainer(): HTMLDivElement {
      let containerEl = this.containerEl as HTMLDivElement;

      if (!containerEl) {
        containerEl = document.createElement('div');
        this.containerEl = containerEl;
      }

      return containerEl;
    },

    run(editor, sender = {}) {
      const container = this.getCodeContainer();
      let codeEditorMjml = this.codeEditorMjml as any;
      // let viewer = codeViewer.editor;

      // NEW
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

      // Init code viewer if not yet instantiated
      // if (!viewer) {
      //   const txtarea = document.createElement('textarea');
      //   const labelImport = getI18nLabel('label');

      //   if (labelImport) {
      //     let labelEl = document.createElement('div');
      //     labelEl.className = pfx + 'import-label';
      //     labelEl.innerHTML = labelImport;
      //     container.appendChild(labelEl);
      //   }

      //   container.appendChild(txtarea);
      //   container.appendChild(btnImp);
      //   codeViewer.init(txtarea);
      //   viewer = codeViewer.editor;
      // }

      editor.Modal.open({
        title: getI18nLabel('title'),
        content: container
      }).onceClose(() => {
        sender.set && sender.set('active', false);
        editor.stopCommand(cmdId)
      });

      // codeViewer.setContent(opts.importPlaceholder);
      // viewer.refresh();
    },

    stop(editor) {
      editor.Modal.close();
    },
  });
};
