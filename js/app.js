/**
 * Created by konradmichalik on 26.07.16.
 */
const {remote} = require('electron');
var ipc = require('electron').ipcRenderer;
var dialog = require('electron').remote.dialog;
var fs = remote.require('fs');
const {Menu, MenuItem} = remote;
const BrowserWindow = remote.BrowserWindow;
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