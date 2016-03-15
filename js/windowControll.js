$(function() {
  jenkinsCtr.init();
  $("#jenkins").append(jenkinsCtr.getTableHtml());
  //イベントのバインドをどこでやる？
  $("#jenkins .huga").on('click', function(){
    var job = new jenkinsJob("huga","blue","ジョブ名称１");
    job.executeJob();
  })

  var webview = $("#mainWebview")[0]
  //webviewの切り替えごとにイベント再設定が必要
  $("#btnBack").on('click', function() {
    webview.goBack();
  })
  $("#btnFwd").on('click', function() {
    webview.goForward();
  })
});
