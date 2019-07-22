export default (editor, opt = {}) => {

  const tltAttr = 'title';
  const tltPosAttr = 'data-tooltip-pos';

  let updateTooltip = (coll) => {
    coll.each((item) => {
      var attrs = item.get('attributes');
      attrs[tltPosAttr] = 'bottom';
      item.set('attributes', attrs);
    });
  };

  let pnm = editor.Panels;


  pnm.addButton('options', {
    id: 'mjml-import',
    className: 'fa fa-download',
    command: 'mjml-import',
  });

  let optPanel = pnm.getPanel('options');
  if (optPanel) {
    // Fix tooltip position
    let cmdBtns = optPanel.get('buttons');
    cmdBtns.each((btn) => {
      const attrs = btn.get('attributes');
      attrs[tltPosAttr] = 'bottom';
      btn.set('attributes', attrs);
    });
    // Remove preview
    let prvBtn = pnm.addButton('options', 'preview');
    prvBtn && cmdBtns.remove(prvBtn);
  }

  // Clean commands panel
  let cmdPanel = pnm.getPanel('options');
  if (cmdPanel) {
    let cmdBtns = cmdPanel.get('buttons');
    // cmdBtns.reset();
    cmdBtns.add([{
      id: 'undo',
      className: 'fa fa-undo',
      command: 'undo',
      attributes: { [tltAttr]: opt.cmdBtnUndoLabel }
    }, {
      id: 'redo',
      className: 'fa fa-repeat',
      command: 'redo',
      attributes: { [tltAttr]: opt.cmdBtnRedoLabel }
    }]);
    updateTooltip(cmdBtns);
  }
  // Turn off default devices select and create new one
  editor.getConfig().showDevices = 0;
  let devicePanel = pnm.addPanel({
    id: 'devices-c'
  });
  let deviceBtns = devicePanel.get('buttons');
  devicePanel.get('buttons').add([{
    id: 'deviceDesktop',
    command: 'set-device-desktop',
    className: 'fa fa-desktop',
  }, {
    id: 'deviceTablet',
    command: 'set-device-tablet',
    className: 'fa fa-tablet',
  }, {
    id: 'deviceMobile',
    command: 'set-device-mobile',
    className: 'fa fa-mobile',
  }]);
  updateTooltip(deviceBtns);

}
