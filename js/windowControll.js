//タブを変更する際の挙動を定義
function changeTab(tabname) {
    $(function () {
        $('#redmine').css('display', 'none');
        $('#redmine_lnk').css('opacity', '0.6');
        $('#jenkins').css('display', 'none');
        $('#jenkins_lnk').css('opacity', '0.6');
        $('#sonar').css('display', 'none');
        $('#sonar_lnk').css('opacity', '0.6');
        $('#setting').css('display', 'none');
        $('#' + tabname).css('display', 'block');
        $('#' + tabname + '_lnk').css('opacity', '1.0');
        searchView.setWebview($('#' + tabname).find("webview")[0]);
        currentTabName = tabname;
    });
}

$(function () {
    jenkinsCtr.init();
    sonarCtr.init();

    //スプラッシュウィンドウを表示する
    $('#splashscreen').fadeOut(4000);

    //スクロールバーをカスタマイズするためにロードされたタイミングでCSSを変更する
    document.getElementById('redmine_frame').addEventListener("did-finish-load", function (){
        document.getElementById('redmine_frame').insertCSS("html::-webkit-scrollbar { width: 8px; background:#fafafa;}");
        document.getElementById('redmine_frame').insertCSS("html::-webkit-scrollbar-thumb { background: #d2d2d2; border-radius: 20px;}");
        document.getElementById('redmine_frame').insertCSS("html::-webkit-scrollbar-piece { background: #eee;}");
    });

    //RedemineのURLが設定されていない場合は設定画面へ自動遷移させる
    if (!localStorage.getItem('url_redmine')) {
        changeTab('setting');
        $('#welcomeDialog').modal('show');
    } else {
        changeTab('redmine');
        //localStorageからユーザID/パスワードを取得して自動的にログインを行う
        var executedFlag = false;
        document.getElementById('redmine_frame').addEventListener("dom-ready", function () {
            //ログイン処理を行うのは初回アクセス時のみとする
            if (executedFlag == false) {
                document.getElementById('redmine_frame').executeJavaScript("document.getElementById('username').value = '" + localStorage.getItem('userId_redmine') + "'");
                document.getElementById('redmine_frame').executeJavaScript("document.getElementById('password').value = '" + localStorage.getItem('password_redmine') + "'");
                document.getElementById('redmine_frame').executeJavaScript("document.getElementsByName('login')[0].click()");
                executedFlag = true;
            }
        });
    }

    //キーダウンイベントを制御し、webView内の操作をブラウザのように行う
    document.onkeydown = function (e) {
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

    //設定画面での設定変更をトリガーとする処理
    document.getElementById('setting').addEventListener('onChangeSetting', function(event) {
      console.log(event);
      jenkinsCtr.stopJenkinsService();
      jenkinsCtr.init();
    });
})
