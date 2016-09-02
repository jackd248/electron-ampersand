var Menu = require('electron');
var menu = new Menu();
var template = [
    {
        label: 'Markdown Editor',
        submenu: [
            {label: "Settings", accelerator: "CmdOrCtrl+U", click: function() {
                toggleMenu();
            }},
            {
                label: "Quit",
                accelerator: "Command+Q",
                selector: 'terminate:'
            },
        ]
    },
    {
        label: "&File",
        submenu: [
            {label: "New", accelerator: "CmdOrCtrl+N", click: function() {
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('file-new');
            }},
            {label: "Open", accelerator: "CmdOrCtrl+O", click: function() {
                let focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('file-open');
            }},
            {label: "Save", accelerator: "CmdOrCtrl+S", click: function() {
                let focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('file-save');
            }},
            {label: "Save As", accelerator: "CmdOrCtrl+Shift+S", click: function() {
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('file-save-as');
            }},
            {type: "separator"},
            {label: "Print", accelerator: "CmdOrCtrl+P", click: function() {
                print();
            }},
            {label: "Export as HTML", accelerator: "CmdOrCtrl+H", click: function() {
                saveHtml();
            }},
            {label: "Export as PDF", accelerator: "CmdOrCtrl+G", click: function() {
                //TODO
            }}
        ]
    },
    {
        label: "&Edit",
        submenu: [
            {label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo"},
            {label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo"},
            {type: "separator"},
            {label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut"},
            {label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy"},
            {label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste"},
            {label: "Select All", accelerator: "CmdOrCtrl+A", role: 'selectall'},
            {type: "separator"},
            {label: "Search", accelerator: "CmdOrCtrl+F", click: function() {
                let focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('ctrl+f');
            }},
            {label: "Replace", accelerator: "CmdOrCtrl+Shift+F", click: function() {
                let focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('ctrl+shift+f');
            }}
        ]
    },
    {
        label: "&View",
        submenu: [
            {label: "Toggle Full Screen", accelerator:"F11", click: function(){
                let focusedWindow = BrowserWindow.getFocusedWindow();
                let isFullScreen = focusedWindow.isFullScreen();
                focusedWindow.setFullScreen(!isFullScreen);
            }},
            {label: "Toggle Preview", accelerator:"CmdOrCtrl+0", click: function(){
                togglePreview();
            }},
            {label: "Dark Theme", accelerator:"CmdOrCtrl+1", click: function(){
                showDarkTheme();
            }},
            {label: "Light Theme", accelerator:"CmdOrCtrl+2", click: function(){
                showLightTheme();
            }},
            {label: "Split Theme", accelerator:"CmdOrCtrl+3", click: function(){
                showSplitTheme();
            }}
        ]
    },
    {
        label: "&Help",
        submenu: [
            {label: "Documentation", click: function () {
                shell.openExternal(Config.repository.docs);
            }},
            {label: "Report Issue", click: function () {
                shell.openExternal(Config.bugs.url);
            }},
            {label: "About Ampersand", click: function () {
                dialog.showMessageBox({title: "About Ampersand", type:"info", message: "A lightweight markdown editor. \nMIT Copyright (c) 2016 Konrad Michalik <hello@konradmichalik.eu>", buttons: ["Close"] });
            }}
        ]
    }
];

menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);