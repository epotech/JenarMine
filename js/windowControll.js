$(function() {
  jenkinsCtr.init();

  //キーダウンイベントを制御し、webView内の操作をブラウザのように行う
  document.onkeydown = function(e) {
    if (document.getElementById(currentTabName + '_frame')) {
      if (e.ctrlKey) {
        if (e.keyCode == 116) {
          document.getElementById(currentTabName + '_frame').reload();
        } else if (e.keyCode == 8) {
          document.getElementById(currentTabName + '_frame').goBack();
        }
      }
    }
  };
})

//タブを変更する際の挙動を定義
function ChangeTab(tabname) {
  $(function() {
    $('#redmine').css('display', 'none');
    $('#redmine_lnk').css('opacity', '0.6');
    $('#jenkins').css('display', 'none');
    $('#jenkins_lnk').css('opacity', '0.6');
    $('#sonar').css('display', 'none');
    $('#sonar_lnk').css('opacity', '0.6');
    $('#setting').css('display', 'none');
    $('#' + tabname).css('display', 'block');
    $('#' + tabname + '_lnk').css('opacity', '1.0');
    currentTabName = tabname;
  });
}
