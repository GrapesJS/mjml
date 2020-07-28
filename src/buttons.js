export default (editor) => {
  const tltAttr = 'title';
  const tltPosAttr = 'data-tooltip-pos';
  const pnm = editor.Panels;
  const optPanel = pnm.getPanel('options');
  const cmdPanel = pnm.getPanel('options');
  const updateTooltip = (coll) => {
    coll.each((item) => {
      var attrs = item.get('attributes');
      attrs[tltPosAttr] = 'bottom';
      item.set('attributes', attrs);
    });
  };


  pnm.addButton('options', {
    id: 'mjml-import',
    className: 'fa fa-download',
    command: 'mjml-import',
    attributes: { [tltAttr]: editor.I18n.t('grapesjs-mjml.panels.buttons.import') }
  });

  if (optPanel) {
    // Fix tooltip position
    const cmdBtns = optPanel.get('buttons');
    cmdBtns.each((btn) => {
      const attrs = btn.get('attributes');
      attrs[tltPosAttr] = 'bottom';
      btn.set('attributes', attrs);
    });
    // Remove preview
    const prvBtn = pnm.addButton('options', 'preview');
    prvBtn && cmdBtns.remove(prvBtn);
  }

  // Clean commands panel
  if (cmdPanel) {
    const cmdBtns = cmdPanel.get('buttons');
    // cmdBtns.reset();
    cmdBtns.add([{
      id: 'undo',
      className: 'fa fa-undo',
      command: 'undo',
      attributes: { [tltAttr]: editor.I18n.t('grapesjs-mjml.panels.buttons.undo') }
    }, {
      id: 'redo',
      className: 'fa fa-repeat',
      command: 'redo',
      attributes: { [tltAttr]: editor.I18n.t('grapesjs-mjml.panels.buttons.redo') }
    }]);
    updateTooltip(cmdBtns);
  }
  // Turn off default devices select and create new one
  editor.getConfig().showDevices = 0;
  const devicePanel = pnm.addPanel({ id: 'devices-c' });
  const deviceBtns = devicePanel.get('buttons');
  devicePanel.get('buttons').add([{
    id: 'deviceDesktop',
    command: 'set-device-desktop',
    className: 'fa fa-desktop',
    attributes: { [tltAttr]: editor.I18n.t('grapesjs-mjml.panels.buttons.desktop') }
  }, {
    id: 'deviceTablet',
    command: 'set-device-tablet',
    className: 'fa fa-tablet',
    attributes: { [tltAttr]: editor.I18n.t('grapesjs-mjml.panels.buttons.tablet') }
  }, {
    id: 'deviceMobile',
    command: 'set-device-mobile',
    className: 'fa fa-mobile',
    attributes: { [tltAttr]: editor.I18n.t('grapesjs-mjml.panels.buttons.mobile') }
  }]);
  updateTooltip(deviceBtns);

};
