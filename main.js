'use strict';

var electron = require('electron');
// Module to control application life.
const {app, globalShortcut} = require('electron')
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;
//var globalShortcut = require('electron');

const Config = require('./package.json');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
let mainWindow;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: true,
        titleBarStyle: 'hidden',
        frame: false,
        icon: __dirname + '/icon.png'
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the devtools.
    mainWindow.openDevTools();

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

    // Regestering global shortcuts for formatting markdown
    var focusedWindow = BrowserWindow.getFocusedWindow();
    globalShortcut.register('CmdOrCtrl+b', function() {
        focusedWindow.webContents.send('ctrl+b');
    });

    globalShortcut.register('CmdOrCtrl+i', function() {
        focusedWindow.webContents.send('ctrl+i');
    });

    globalShortcut.register('CmdOrCtrl+/', function() {
        focusedWindow.webContents.send('ctrl+/');
    });

    globalShortcut.register('CmdOrCtrl+l', function() {
        focusedWindow.webContents.send('ctrl+l');
    });

    globalShortcut.register('CmdOrCtrl+h', function() {
        focusedWindow.webContents.send('ctrl+h');
    });

    globalShortcut.register('CmdOrCtrl+Alt+i', function() {
        focusedWindow.webContents.send('ctrl+alt+i');
    });

    globalShortcut.register('CmdOrCtrl+Shift+t', function() {
        focusedWindow.webContents.send('ctrl+shift+t');
    });
});


