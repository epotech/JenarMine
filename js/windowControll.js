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
    $('#tab1').css('display', 'none');
    $('#tab1_lnk').css('opacity', '0.6');
    $('#tab2').css('display', 'none');
    $('#tab2_lnk').css('opacity', '0.6');
    $('#tab3').css('display', 'none');
    $('#tab3_lnk').css('opacity', '0.6');
    $('#tab4').css('display', 'none');
    $('#' + tabname).css('display', 'block');
    $('#' + tabname + '_lnk').css('opacity', '1.0');
    currentTabName = tabname;
  });
}
