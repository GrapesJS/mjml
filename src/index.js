export default (editor, opts = {}) => {
    let c = opts || {};
    let config = editor.getConfig();
    let pfx = config.stylePrefix;

    let defaults = {
        editor,
        pfx: pfx || '',
        cmdOpenImport: 'gjs-open-import-template',
        cmdTglImages: 'gjs-toggle-images',
        cmtTglImagesLabel: 'Toggle Images',
        cmdBtnMoveLabel: 'Move',
        cmdBtnUndoLabel: 'Undo',
        cmdBtnRedoLabel: 'Redo',
        cmdBtnDesktopLabel: 'Desktop',
        cmdBtnTabletLabel: 'Tablet',
        cmdBtnMobileLabel: 'Mobile',
        modalTitleImport: 'Import template',
        modalTitleExport: 'Export template',
        modalLabelImport: '',
        modalLabelExport: '',
        modalBtnImport: 'Import',
        codeViewerTheme: 'hopscotch',
        openBlocksBtnTitle: c.openBlocksBtnTitle || '',
        openLayersBtnTitle: c.openLayersBtnTitle || '',
        openSmBtnTitle: c.openSmBtnTitle || '',
        openTmBtnTitle: c.openTmBtnTitle || '',
        expTplBtnTitle: c.expTplBtnTitle || 'View Code',
        fullScrBtnTitle: c.fullScrBtnTitle || 'FullScreen',
        swichtVwBtnTitle: c.swichtVwBtnTitle || 'View Components',
        categoryLabel: c.categoryLabel || '',
        importPlaceholder: '',
        defaultTemplate: '', // Default template in case the canvas is empty
        inlineCss: 1,
        cellStyle: {
            padding: 0,
            margin: 0,
            'vertical-align': 'top',
        },
        tableStyle: {
            height: '150px',
            margin: '0 auto 10px auto',
            padding: '5px 5px 5px 5px',
            width: '100%'
        },
        sect100BlkLabel: '1 Section',
        sect50BlkLabel: '1/2 Section',
        sect30BlkLabel: '1/3 Section',
        sect37BlkLabel: '3/7 Section',
        buttonBlkLabel: 'Button',
        dividerBlkLabel: 'Divider',
        textBlkLabel: 'Text',
        textSectionBlkLabel: 'Text Section',
        imageBlkLabel: 'Image',
        quoteBlkLabel: 'Quote',
        linkBlkLabel: 'Link',
        linkBlockBlkLabel: 'Link Block',
        gridItemsBlkLabel: 'Grid Items',
        listItemsBlkLabel: 'List Items',
        assetsModalTitle: c.assetsModalTitle || 'Select image',
        styleManagerSectors: [{
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
            properties:[{
                property: 'margin',
                properties:[
                    { name: 'Top', property: 'margin-top'},
                    { name: 'Left', property: 'margin-left'},
                    { name: 'Right', property: 'margin-right'},
                    { name: 'Bottom', property: 'margin-bottom'}
                ],
            },{
                property  : 'padding',
                properties:[
                    { name: 'Top', property: 'padding-top'},
                    { name: 'Right', property: 'padding-right'},
                    { name: 'Bottom', property: 'padding-bottom'},
                    { name: 'Left', property: 'padding-left'}
                ],
            }],
        },{
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'font-style', 'vertical-align', 'text-shadow'],
            properties:[
                { name: 'Font', property: 'font-family'},
                { name: 'Weight', property: 'font-weight'},
                { name: 'Font color', property: 'color'},
                {
                    property: 'text-align',
                    type: 'radio',
                    defaults: 'left',
                    list: [
                        { value: 'left', name: 'Left', className: 'fa fa-align-left'},
                        { value: 'center', name: 'Center', className: 'fa fa-align-center' },
                        { value: 'right', name: 'Right', className: 'fa fa-align-right'},
                        { value: 'justify', name: 'Justify', className: 'fa fa-align-justify'}
                    ],
                },{
                    property: 'text-decoration',
                    type: 'radio',
                    defaults: 'none',
                    list: [
                        { value: 'none', name: 'None', className: 'fa fa-times'},
                        { value: 'underline', name: 'underline', className: 'fa fa-underline' },
                        { value: 'line-through', name: 'Line-through', className: 'fa fa-strikethrough'}
                    ],
                },{
                    property: 'font-style',
                    type: 'radio',
                    defaults: 'normal',
                    list: [
                        { value: 'normal', name: 'Normal', className: 'fa fa-font'},
                        { value: 'italic', name: 'Italic', className: 'fa fa-italic'}
                    ],
                },{
                    property: 'vertical-align',
                    type: 'select',
                    defaults: 'baseline',
                    list: [
                        { value: 'baseline'},
                        { value: 'top'},
                        { value: 'middle'},
                        { value: 'bottom'}
                    ],
                },{
                    property: 'text-shadow',
                    properties: [
                        { name: 'X position', property: 'text-shadow-h'},
                        { name: 'Y position', property: 'text-shadow-v'},
                        { name: 'Blur', property: 'text-shadow-blur'},
                        { name: 'Color', property: 'text-shadow-color'}
                    ],
                }],
        },{
            name: 'Decorations',
            open: false,
            buildProps: ['background-color', 'border-collapse', 'border-radius', 'border', 'background'],
            properties: [{
                property: 'background-color',
                name: 'Background',
            },{
                property: 'border-radius',
                properties  : [
                    { name: 'Top', property: 'border-top-left-radius'},
                    { name: 'Right', property: 'border-top-right-radius'},
                    { name: 'Bottom', property: 'border-bottom-left-radius'},
                    { name: 'Left', property: 'border-bottom-right-radius'}
                ],
            },{
                property: 'border-collapse',
                type: 'radio',
                defaults: 'separate',
                list: [
                    { value: 'separate', name: 'No'},
                    { value: 'collapse', name: 'Yes'}
                ],
            },
                /*
                { // Too much low support
                  property: 'box-shadow',
                  properties: [
                    { name: 'X position', property: 'box-shadow-h'},
                    { name: 'Y position', property: 'box-shadow-v'},
                    { name: 'Blur', property: 'box-shadow-blur'},
                    { name: 'Spread', property: 'box-shadow-spread'},
                    { name: 'Color', property: 'box-shadow-color'},
                    { name: 'Shadow type', property: 'box-shadow-type'}
                  ],
                },*/{
                    property: 'border',
                    properties: [
                        { name: 'Width', property: 'border-width', defaults: '0'},
                        { name: 'Style', property: 'border-style'},
                        { name: 'Color', property: 'border-color'},
                    ],
                },{
                    property: 'background',
                    properties: [
                        { name: 'Image', property: 'background-image'},
                        { name: 'Repeat', property:   'background-repeat'},
                        { name: 'Position', property: 'background-position'},
                        { name: 'Attachment', property: 'background-attachment'},
                        { name: 'Size', property: 'background-size'}
                    ],
                }],
        }]
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
