'use strict';

var electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;

const globalShortcut = electron.globalShortcut;
const Menu = electron.Menu;
const dialog = electron.dialog;

const Config = require('./package.json');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
let mainWindow;


function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: true,
        titleBarStyle: 'hidden',
        //frame: false,
        icon: __dirname + '/icon.png'
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the devtools.
    // mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });


    //Open anchor links in browser
    mainWindow.webContents.on('will-navigate', function(e, url) {
        e.preventDefault();
        electron.shell.openExternal(url);
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    createWindow();
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});

var menuTemplate = [
    {
        label: 'Markdown Editor',
        submenu: [
            {label: "About Ampersand", click: function () {
                dialog.showMessageBox({title: "About Ampersand", type:"info", message: "A lightweight markdown editor. \nMIT Copyright (c) 2016 Konrad Michalik <hello@konradmichalik.eu>", buttons: ["Close"] });
            }},
            {type: "separator"},
            {label: "Settings", accelerator: "CmdOrCtrl+U", click: function() {
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('toggle-menu');
            }},
            {
                label: "Quit",
                accelerator: "Command+Q",
                selector: 'terminate:'
            }
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
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('print');
            }},
            {label: "Export as HTML", accelerator: "CmdOrCtrl+H", click: function() {
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('export-as-html');
            }},
            {label: "Export as PDF", accelerator: "CmdOrCtrl+G", click: function() {
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('export-as-pdf');
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
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click (item, focusedWindow) {
                    if (focusedWindow) focusedWindow.reload()
                }
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click (item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                }
            },
            {type: "separator"},
            {label: "Toggle Preview", accelerator:"CmdOrCtrl+0", click: function(){
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('toggle-preview');
            }},
            {label: "Dark Theme", accelerator:"CmdOrCtrl+1", click: function(){
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('dark-theme');
            }},
            {label: "Light Theme", accelerator:"CmdOrCtrl+2", click: function(){
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('light-theme');
            }},
            {label: "Split Theme", accelerator:"CmdOrCtrl+3", click: function(){
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('split-theme');
            }},
            {type: "separator"},
            {label: "Toggle Line Numbers", click: function(){
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('toggle-line-numbers');
            }}
        ]
    },
    {
        label: "&Help",
        submenu: [
            {label: "Documentation", click: function () {
                electron.shell.openExternal(Config.repository.docs);
            }},
            {label: "Report Issue", click: function () {
                electron.shell.openExternal(Config.bugs.url);
            }}
        ]
    }
];


