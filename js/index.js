'use strict';

// アプリケーションをコントロールするモジュール
var electron = require('electron');
var app = electron.app;
// ウィンドウを作成するモジュール
var BrowserWindow = electron.BrowserWindow;

// メインウィンドウはGCされないようにグローバル宣言
var mainWindow = null;

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// Electronの初期化完了後に実行
app.on('ready', function () {
    // メイン画面の表示。ウィンドウの幅、高さを指定できる
    mainWindow = new BrowserWindow({
        title: 'JenarMine'
    });
    
    mainWindow.maximize();
    mainWindow.loadURL('file://' + __dirname + '/../index.html');

    // ウィンドウが閉じられたらアプリも終了
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
