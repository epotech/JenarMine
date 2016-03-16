$(function() {
  jenkinsCtr.init();
  jenkinsCtr.writeTableHtml();

  var webview = $("#mainWebview")[0]
  //webviewの切り替えごとにイベント再設定が必要
  $("#btnBack").on('click', function() {
    webview.goBack();
  })
  $("#btnFwd").on('click', function() {
    webview.goForward();
  })
});
