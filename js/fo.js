function saveHtml() {
    var options = {};
    if (store.get('filename')) {
        options.defaultPath = fileNameToHtml(store.get('filename'));
    }
    dialog.showSaveDialog(options, function (fileName) {
        if (fileName === undefined) {
            console.log("You didn't save the file");
            return;
        }
        var htmlValue = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>' + trimFileName(fileName)+ '</title>\n</head>\n<body>';
        htmlValue += document.querySelector('#html').innerHTML + '\n</body>';
        fs.writeFile(fileName, htmlValue, function (err) {
            if(err){
                alert("An error ocurred creating the file "+ err.message)
            }
        });

        addToast('File exported as HTML', 'success');
    });
}

function saveAs() {
    var options = {};
    if (store.get('filename')) {
        options.defaultPath = store.get('filename');
    }
    dialog.showSaveDialog(options, function (fileName) {
        if (fileName === undefined) {
            console.log("You didn't save the file");
            return;
        }
        store.set('filename', fileName);

        var markdownValue = editor.getValue();
        fs.writeFile(fileName, markdownValue, function (err) {
            if(err){
                alert("An error ocurred creating the file "+ err.message)
            }
        });
        this.currentFile = fileName;
        updateWindowTitle(this.currentFile);
        this.savedContent = markdownValue;
        hideSaveIndicator();
        addToast('File saved', 'success');
    });
}

function save() {
    if (store.get('filename')) {
        var fileName = store.get('filename');
        if (fileName === undefined) {
            console.log("You didn't save the file");
            return;
        }

        store.set('filename', fileName);

        var markdownValue = editor.getValue();
        fs.writeFile(fileName, markdownValue, function (err) {
            if(err){
                alert("An error ocurred creating the file "+ err.message)
            }
        });
        this.currentFile = fileName;
        updateWindowTitle(fileName);
        this.savedContent = markdownValue;
        hideSaveIndicator();
        addToast('File saved', 'success');
    } else {
        saveAs();
    }
}

function open() {
    var options = {'properties' : ['openFile'], 'filters' : [{name: 'Markdown', 'extensions':['md']}]};
    if (store.get('filename')) {
        options.defaultPath = store.get('filename');
    }

    dialog.showOpenDialog(options, function (fileName) {
        if (fileName === undefined) {
            console.log("You didn't open the file");
            return;
        }

        store.set('filename', fileName[0]);

        // fileName is a string that contains the path and filename created in the save file dialog.
        fs.readFile(fileName[0], 'utf-8', function (err, data) {
            if (err) {
                alert("An error ocurred while opening the file " + err.message)
            }
            this.savedContent = data;
            editor.getDoc().setValue(data);
        });
        this.isFileLoadedInitially = true;
        this.currentFile = fileName[0];
        updateWindowTitle(this.currentFile);
        hideSaveIndicator();
        addRecentFile(fileName[0]);
        showRecentFiles();
        addToast('File opened', 'info');
    });
}

function openFile(fileName) {
    fs.readFile(fileName, 'utf-8', function (err, data) {
        if (err) {
            alert("An error ocurred while opening the file " + err.message)
        }
        this.savedContent = data;
        editor.getDoc().setValue(data);
    });
    this.isFileLoadedInitially = true;
    this.currentFile = fileName;
    updateWindowTitle(this.currentFile);
    hideSaveIndicator();
    addRecentFile(fileName);
    showRecentFiles();
    addToast('File opened', 'info');
    toggleMenu();
}

function newFile() {
    store.set('filename', null);
    this.currentFile = '';
    clearContent();
    this.savedContent = '';
    editor.getDoc().setValue('');
    updateWindowTitle('untitled.md');
    showSaveIndicator();
    showRecentFiles();
    addToast('New File', 'info');
}

ipc.on('file-new', newFile);

ipc.on('file-save', save);

ipc.on('file-save-as', saveAs);

ipc.on('file-open', open);

ipc.on('print', print);

ipc.on('export-as-html', saveHtml);

ipc.on('export-as-pdf', saveHtml);

ipc.on('toggle-preview', togglePreview);

ipc.on('dark-theme', showDarkTheme);

ipc.on('light-theme', showLightTheme);

ipc.on('split-theme', showSplitTheme);

ipc.on('zoom-in', fontBigger);

ipc.on('zoom-out', fontSmaller);

ipc.on('toggle-menu', toggleMenu);

ipc.on('ctrl+b', function() {
    toggleFormat('bold');
});

ipc.on('ctrl+i', function() {
    toggleFormat('italic');
});

ipc.on('ctrl+/', function() {
    toggleFormat('strikethrough');
});

ipc.on('ctrl+l', function() {
    drawLink();
});

ipc.on('ctrl+h', function() {
    toggleHeadingSmaller();
});

ipc.on('ctrl+alt+i', function() {
    drawImage();
});

ipc.on('ctrl+shift+t', function() {
    drawTable();
});

ipc.on('ctrl+f', function() {
    CodeMirror.execCommand('find');
});

ipc.on('ctrl+shift+f', function() {
    CodeMirror.execCommand('replace');
});