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
var $ = require('jquery');
var Ps = require('perfect-scrollbar');
var store = JsonStorage.create(localStorage, 'markdown-ampersand', { stringify: true });
var md = require('markdown-it')({
    html:         true,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />).
                                // This is only for full CommonMark compatibility.
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
                                // useful for external highlighters.
    linkify:      true,        // Autoconvert URL-like text to links

    // Enable some language-neutral replacement + quotes beautification
    typographer:  true,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '“”‘’',

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    highlight: function (/*str, lang*/) { return ''; }
})
    .use(require('markdown-it-emoji'))
    .use(require('markdown-it-footnote'))
    .use(require('markdown-it-deflist'))
    .use(require('markdown-it-sub'))
    .use(require('markdown-it-ins'))
    .use(require('markdown-it-mark'))
    .use(require('markdown-it-container'))
    .use(require('markdown-it-abbr'))
    .use(require('markdown-it-highlightjs'));

var currentFile = '';
var savedContent = '';
var isFileLoadedInitially = false;

var code = document.getElementsByClassName("codemirror-textarea")[0];
var editor = CodeMirror.fromTextArea(code, {
    lineNumbers : store.get("lineNumbers") ? store.get("lineNumbers") : false,
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
        if (editor.getValue() == '') {
            document.querySelector('.editor .hint').classList.remove('hidden');
            document.querySelector('.preview .hint').classList.remove('hidden');
        } else {
            document.querySelector('.editor .hint').classList.add('hidden');
            document.querySelector('.preview .hint').classList.add('hidden');
        }
    });

    loadSettings();
    loadEventListener();
};

function loadEventListener() {
    document.querySelector('.toggle-preview').addEventListener('click', togglePreview, false);

    document.querySelector('.toggle-menu').addEventListener('click', toggleMenu, false);


    document.querySelector('div:not(.menu)').addEventListener('click', function() {
        if (!document.querySelector('.menu').classList.contains('hidden')) {
            hideMenu();
        }
    });

    syncScrollbars();
}

function loadSettings() {
    /*
     * Available settings options:
     *
     * Theme
     * Last File
     * Preview
     * LineNumbers
     */

    if (store.get('theme')) {
        switch(store.get('theme')) {
            case 'dark':
                showDarkTheme();
                break;
            case 'light':
                showLightTheme();
                break;
            case 'split':
                showSplitTheme();
                break;
            default:
                showSplitTheme();
        }
    }

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

    if (store.get('preview') != '') {
        if (store.get('preview')) {
            togglePreview();
        }
    }

    if (store.get('lineNumbers') != '') {
        if (!store.get('lineNumbers')) {
            toggleLineNumbers();
        }
    }



}

function markdownToHtml(markdown) {
    var html = md.render( markdown );
    document.getElementById("html").innerHTML = html;
    tableStyling();
    document.querySelector('.word-count').innerHTML = wordCount(markdown);
}