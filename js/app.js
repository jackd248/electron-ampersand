/**
 * Created by konradmichalik on 26.07.16.
 */
var remote = require('electron').remote;
var fs = remote.require('fs');
var ipc = require('electron').ipcRenderer;
var dialog = require('electron').remote.dialog;
var BrowserWindow = remote.BrowserWindow;
var localStorage = require('localStorage');
var JsonStorage = require('json-storage').JsonStorage;
var store = JsonStorage.create(localStorage, 'markdown-ampersand', { stringify: true });

var currentFile = '';
var savedContent = '';
var isFileLoadedInitially = false;

var code = document.getElementsByClassName("codemirror-textarea")[0];
var editor = CodeMirror.fromTextArea(code, {
    lineNumbers : false,
    mode:  "gfm",
    theme: "ampersand",
    lineWrapping: true,
    matchBrackets: true
});


// `remote.require` since `Menu` is a main-process module.
var buildEditorContextMenu = remote.require('electron-editor-context-menu');

window.addEventListener('contextmenu', function(e) {
    // Only show the context menu in text editors.
    if (!e.target.closest('textarea, input, [contenteditable="true"],section')) return;

    var menu = buildEditorContextMenu();

    // The 'contextmenu' event is emitted after 'selectionchange' has fired but possibly before the
    // visible selection has changed. Try to wait to show the menu until after that, otherwise the
    // visible selection will update after the menu dismisses and look weird.
    setTimeout(function() {
        menu.popup(remote.getCurrentWindow());
    }, 30);
});


window.onload = function ()
{
    editor.on("change", function() {
        markdownToHtml(editor.getValue());
        if (savedContent != editor.getValue()) {
            showSaveIndicator();
        } else {
            hideSaveIndicator();
        }
    });

    loadEventListener();

    // Get the most recently saved file
    if (store.get('filename')) {
        var filename = store.get('filename');
        fs.readFile(filename, 'utf-8', function (err, data) {
            if(err){
                alert("An error ocurred while opening the file "+ err.message)
            }
            savedContent = data;
            editor.getDoc().setValue(data);
        });
        this.isFileLoadedInitially = true;
        this.currentFile = filename;
        updateWindowTitle(filename);
        hideSaveIndicator();
        showRecentFiles();
    }

};

function loadEventListener() {
    document.querySelector('.toggle-preview').addEventListener('click', togglePreview, false);

    [].forEach.call(document.querySelectorAll('.toggle-menu'), function (el) {
        el.addEventListener('click', function() {
            toggleMenu();
        }, false);
    });
}

function markdownToHtml(md) {
    var html = markdown.toHTML( md );
    document.getElementById("html").innerHTML = html;
    document.querySelector('.word-count').innerHTML = wordCount(md);
    // resize();
}