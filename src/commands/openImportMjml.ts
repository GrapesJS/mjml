import type grapesjs from 'grapesjs';
import { RequiredPluginOptions } from '..';

export default (editor: grapesjs.Editor, opts: RequiredPluginOptions, cmdId: string) => {
  const config = editor.getConfig();
  // @ts-ignore
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
    theme: opts.codeViewerTheme,
    readOnly: 0
  });

  const { Commands } = editor;

  const getI18nLabel = (label: string) => editor.I18n.t(`grapesjs-mjml.panels.import.${label}`)

  Commands.add(cmdId, {
    run(editor, sender = {}) {
      let viewer = codeViewer.editor;

      // Init code viewer if not yet instantiated
      if (!viewer) {
        const txtarea = document.createElement('textarea');
        const labelImport = getI18nLabel('label');

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

      editor.Modal.open({
        title: getI18nLabel('title'),
        content: container
      }).onceClose(() => {
        sender.set && sender.set('active', false);
        editor.stopCommand(cmdId)
      });

      codeViewer.setContent(opts.importPlaceholder);
      viewer.refresh();
    },

    stop(editor) {
      editor.Modal.close();
    },
  });
};
