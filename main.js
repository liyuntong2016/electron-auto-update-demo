const { app, BrowserWindow } = require('electron')

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win

function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({ width: 800, height: 600 })

  // 然后加载应用的 index.html。
  win.loadFile('index.html')
  // win.loadURL('http://localhost:8080')

  // 打开开发者工具
  win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。



const electron = require('electron')
//自动更新
const autoUpdater = electron.autoUpdater
function startupEventHandle(){
  if(require('electron-squirrel-startup')) return;
  var handleStartupEvent = function () {
    if (process.platform !== 'win32') {
      return false;
    }
    var squirrelCommand = process.argv[1];
    switch (squirrelCommand) {
      case '--squirrel-install':
      case '--squirrel-updated':
        install();
        return true;
      case '--squirrel-uninstall':
        uninstall();
        app.quit();
        return true;
      case '--squirrel-obsolete':
        app.quit();
        return true;
    }
      // 安装
    function install() {
      var cp = require('child_process');    
      var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
      var target = path.basename(process.execPath);
      var child = cp.spawn(updateDotExe, ["--createShortcut", target], { detached: true });
      child.on('close', function(code) {
          app.quit();
      });
    }
    // 卸载
    function uninstall() {
      var cp = require('child_process');    
      var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
      var target = path.basename(process.execPath);
      var child = cp.spawn(updateDotExe, ["--removeShortcut", target], { detached: true });
      child.on('close', function(code) {
          app.quit();
      });
    }
  };
  if (handleStartupEvent()) {
    return ;
  }
}
function updateHandle(){
  const { ipcMain } = require('electron')
  ipcMain.on('check-for-update', function(event, arg) {
    let appName='某个项目更新';
    let appIcon=__dirname + '/favicon.ico';
    let message={
      error:'检查更新出错',
      checking:'正在检查更新……',
      updateAva:'下载更新成功',
      updateNotAva:'现在使用的就是最新版本，不用更新',
      downloaded:'最新版本已下载，将在重启程序后更新'
    };
    const os = require('os');
    const {dialog} = require('electron');
    autoUpdater.setFeedURL('http://localhost:8080/znyts/');//放最新版本文件的文件夹的服务器地址
    autoUpdater.on('error', function(error){
      return dialog.showMessageBox(win, {
          type: 'info',
          icon: appIcon,
          buttons: ['下一步'],
          title: appName,
          message: message.error,
          detail: '\r'+error
      });
    })
    .on('checking-for-update', function(e) {
        return dialog.showMessageBox(win, {
          type: 'info',
          icon: appIcon,
          buttons: ['下一步'],
          title: appName,
          message: message.checking
      });
    })
    .on('update-available', function(e) {
        var downloadConfirmation = dialog.showMessageBox(win, {
            type: 'info',
            icon: appIcon,
            buttons: ['下一步'],
            title: appName,
            message: message.updateAva
        });
        if (downloadConfirmation === 0) {
            return;
        }
    })
    .on('update-not-available', function(e) {
        return dialog.showMessageBox(win, {
            type: 'info',
            icon: appIcon,
            buttons: ['下一步'],
            title: appName,
            message: message.updateNotAva
        });
    })
    .on('update-downloaded',  function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        var index = dialog.showMessageBox(win, {
            type: 'info',
            icon: appIcon,
            buttons: ['现在重启此程序','稍后重启此程序'],
            title: appName,
            message: message.downloaded,
            detail: releaseName + "\n\n" + releaseNotes
        });
        if (index === 1) return;
        autoUpdater.quitAndInstall();
    });
    autoUpdater.checkForUpdates();
 });
}

startupEventHandle()
updateHandle()