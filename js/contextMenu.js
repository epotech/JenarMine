var contextMenu = (function() {
  var electron = require('electron');
  var remote = electron.remote;
  var {Menu, MenuItem} = remote;
  var menu;
  var targetFrame;

  function setWebview(viewObj) {
    if (!viewObj) return;
    targetFrame = viewObj;
    setMenu();
    unbindEvent();
    setEvent();
  }
  //右クリックメニューを設定
  function setMenu() {
    menu = new Menu();
    menu.append(
      new MenuItem({label: '現在のURLをコピー', click() {
         electron.clipboard.writeText(targetFrame.getURL())
       }})
    );
  }
  function unbindEvent() {
    targetFrame.removeEventListener("contextmenu", popupMenu);
  }
  function setEvent() {
    targetFrame.addEventListener("contextmenu", popupMenu);
  }
  var popupMenu = function(e){
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
  }
  //公開フィールド、メソッドを返す
  return {
    setWebview: setWebview
  };
})();
