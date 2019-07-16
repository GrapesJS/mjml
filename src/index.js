export default (editor, opts = {}) => {
    let c = opts || {};
    let config = editor.getConfig();
    let pfx = config.stylePrefix;

    let defaults = {
        editor,
        cmdBtnMoveLabel: 'Move',
        cmdBtnUndoLabel: 'Undo',
        cmdBtnRedoLabel: 'Redo',
        cmdBtnDesktopLabel: 'Desktop',
        cmdBtnTabletLabel: 'Tablet',
        cmdBtnMobileLabel: 'Mobile',

        expTplBtnTitle: c.expTplBtnTitle || 'View Code',
        fullScrBtnTitle: c.fullScrBtnTitle || 'FullScreen',
        swichtVwBtnTitle: c.swichtVwBtnTitle || 'View Components',
        defaultTemplate: '', // Default template in case the canvas is empty
        categoryLabel: '',

        // Code viewer theme
        codeViewerTheme: 'hopscotch',

        // Import placeholder MJML
        importPlaceholder: '',

        // Title for the import modal
        modalTitleImport: 'Import MJML',

        // Test for the import button
        modalBtnImport: 'Import',

        // Description for the import modal
        modalLabelImport: '',

        // Title for the export modal
        modalTitleExport: 'Export MJML',

        // Description for the export modal
        modalLabelExport: '',

        // Overwrite default export command
        overwriteExport: 1,

        // String before the MJML in export code
        preMjml: '',

        // String after the MJML in export code
        postMjml: '',

        // Export 'mjml', 'html' or both (leave empty) TODO
        exportOnly: '',

        // Clean all previous blocks if true
        resetBlocks: 1,

        // Reset the Style Manager and add new properties for MJML
        resetStyleManager: 1,

        // Column padding (this way it's easier select columns)
        columnsPadding: '10px 0',

        ...opts,
    };

    // Change some config
    config.devicePreviewMode = 1;

    // Load defaults
    for (let name in defaults) {
        if (!(name in c))
            c[name] = defaults[name];
    }

    // I need to prevent forced class creation as classes aren't working
    // at the moment
    config.forceClass = 0;

    // Don't need to create css rules with media
    config.devicePreviewMode = 1;

    // Add Blocks
    require('./blocks').default(editor, opts);

    // Add Components
    require('./components').default(editor, opts);

    // Add Commands
    require('./commands').default(editor, opts);

    // Add Buttons
    require('./buttons').default(editor, opts);

    // Extend Style Manager
    require('./style').default(editor, opts);

    // Update devices
    if (opts.resetDevices) {
        const dm = editor.DeviceManager;
        dm.getAll().reset();
        dm.add('Desktop', '');
        dm.add('Mobile', '320px');
        dm.add('Tablet', '820px');
    }


};
