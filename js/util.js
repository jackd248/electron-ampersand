function resize() {
    var preview = document.querySelector('.preview .content');
    var editor = document.querySelector('.editor .content');
    var height = preview.offsetHeight > editor.offsetHeight ? preview.offsetHeight + 120 : editor.offsetHeight + 120;

    var ed = document.querySelector('.editor .content');
    var pre = document.querySelector('.preview .content');

    if (ed.clientHeight > pre.clientHeight) {
        if (height > ed.clientHeight) {
            ed.style.height = height + 'px';
        }
        pre.style.height = ed.clientHeight + 'px';
    } else {
        if (height > pre.clientHeight) {
            pre.style.height = height + 'px';
        }
        ed.style.height = pre.clientHeight + 'px';
    }
}
function clearContent() {
    document.querySelector('.preview').innerHTML = '';
}

function togglePreview() {
    document.querySelector('.preview').classList.toggle('offscreen');
    document.querySelector('.editor').classList.toggle('fullscreen');
    document.querySelector('.toggle-preview').classList.toggle('active');
    setOption('preview',document.querySelector('.editor').classList.contains('fullscreen'));
    editor.refresh();
}

function toggleMenu() {
    document.querySelector('.menu').classList.toggle('hidden');
    if (!document.querySelector('.menu').classList.contains('hidden')) {
        document.querySelector('.menu ul li a:first-child').focus();
    }
}

function hideMenu() {
    document.querySelector('.menu').classList.remove('hidden');
    document.querySelector('.menu').classList.add('hidden');
}

function wordCount(str) {
    if (str == null) {
        return 0;
    }
    return str.split(" ").length;
}

function updateWindowTitle(filename) {
    document.querySelector('.editor .header .filename').innerHTML = trimFileName(filename);
}

function showSaveIndicator() {
    var e = document.querySelector('.editor .header .save-indicator');
    e.className=e.className.replace('hidden','');
}

function hideSaveIndicator() {
    document.querySelector('.editor .header .save-indicator').classList.remove('hidden');
    document.querySelector('.editor .header .save-indicator').classList.add('hidden');
}

function trimFileName(fullPath) {
    var parts = fullPath.split('/');
    return parts[parts.length-1];
}

function fileNameToHtml(filename) {
    var parts = filename.split('.');
    return parts[0] + '.html';
}

function showDarkTheme() {
    clearTheme();
    document.querySelector('.preview').classList.toggle('dark');
    document.querySelector('.menu').classList.remove('light');
    document.querySelector('.info').classList.remove('light');
    editor.setOption('theme','ampersand');
    setOption('theme','dark');
}

function showLightTheme() {
    clearTheme();
    document.querySelector('.editor').classList.toggle('light');
    document.querySelector('.menu').classList.toggle('light');
    document.querySelector('.info').classList.toggle('light');
    editor.setOption('theme','ampersand-light');
    setOption('theme','light');
}

function showSplitTheme() {
    setOption('theme','split');
    editor.setOption('theme','ampersand');
    clearTheme();
}

function clearTheme() {
    var p = document.querySelector('.preview');
    var e = document.querySelector('.editor');
    var m = document.querySelector('.menu');
    var i = document.querySelector('.info');
    p.className=p.className.replace('dark','');
    e.className=e.className.replace('light','');
    m.className=m.className.replace('light','');
    i.className=i.className.replace('light','');
}

function addRecentFile(filename) {
    var array = store.get('recentFiles') ? store.get('recentFiles') : [];
    if (!(array.indexOf(filename) != -1)) {
        array.unshift(filename);
    }
    if (array.length > 3) {
        array.pop();
    }
    store.set('recentFiles', array);
}

function setOption(option, value) {
    store.set(option, value);
}

function addToast(message, type) {
    var toast = '<div class="toast ' + type + '">' + message + '</div>';
    var info = document.querySelector('.info');
    info.innerHTML = toast;
}

function toggleLineNumbers() {
    if (editor.getOption("lineNumbers")) {
        editor.setOption("lineNumbers", false);
        setOption("lineNumbers", false);
    } else {
        editor.setOption("lineNumbers", true);
        setOption("lineNumbers", true);
    }
}

function print() {
    // printDivCSS = new String ('<link href="../css/primer.css" rel="stylesheet" type="text/css">')
    // window.frames["print_frame"].document.body.innerHTML=printDivCSS + document.getElementById('html').innerHTML;
    // window.frames["print_frame"].window.focus();
    // window.frames["print_frame"].window.print();
}

// Generations and clean state of CodeMirror
var getGeneration = function () {
    return this.editor.doc.changeGeneration();
}

var setClean = function () {
    this.latestGeneration = this.getGeneration();
}

var isClean = function () {
    return this.editor.doc.isClean(this.latestGeneration);
}

function newCodeMirrorInstance(value) {
    document.getElementsByClassName("codemirror-textarea")[0].remove();
    document.querySelector('.editor .content').innerHTML = '<textarea class="codemirror-textarea" id="codemirror"></textarea>';
    var code = document.getElementsByClassName("codemirror-textarea")[0];
    editor = CodeMirror.fromTextArea(code, {
        lineNumbers : store.get("lineNumbers") ? store.get("lineNumbers") : false,
        mode:  "gfm",
        theme: "ampersand",
        lineWrapping: true,
        matchBrackets: true
    });

    editor.on("change", function() {
        markdownToHtml(editor.getValue());
    });
    if (value) {
        editor.getDoc().setValue(value);
    }
}

function showRecentFiles() {
    if (store.get('recentFiles')) {
        var array = store.get('recentFiles');
        var el = document.querySelector('.recent-files');
        el.innerHTML = '';
        array.forEach(function(i) {
            if (currentFile != i) {
                el.innerHTML += '<li><a onclick="openFile(\'' + i + '\')">' + trimFileName(i) + '</a></li>';
            }
        });
    }
}