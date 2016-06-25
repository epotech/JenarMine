// requirejs読込み
var requirejs = require('requirejs');
requirejs.config({
    paths: {
        util: 'js/util'
    }
});

var ipc = require('electron').ipcRenderer;

//現在有効化しているWebViewのタブ名
var currentTabName;

//タブのリロード
function reloadTab(tabName) {
    document.getElementById(tabName + '_frame').reload();
}

//タブのhistoryBack
function goBackTab(tabName) {
    document.getElementById(tabName + '_frame').goBack();
}

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
        contextMenu.setWebview($('#' + tabname).find("webview")[0]);
        currentTabName = tabname;
    });
}

//プロジェクト名を編集する際に各オブジェクトの入力可否を変更する
function changeStateEditProjectName(canEdit) {
    $(function () {
        if (canEdit) {
            $('#editProjectName').css('display', 'none');
            $('#editProjectName').removeClass('glyphicon glyphicon-pencil');
            $('#projectName').prop('disabled', false);
        } else {
            $('#editProjectName').css('display', 'block');
            $('#editProjectName').addClass('glyphicon glyphicon-pencil');
            $('#projectName').prop('disabled', true);
        }
    });
}

//プロジェクト名を変更開始時の挙動
function editProjectName() {
    changeStateEditProjectName(true);
}

//プロジェクト名の変更完了後の挙動
function editedProjectName() {
    $(function () {
        changeStateEditProjectName(false);
        requirejs(['util'], function (util) {
            var projectSetting = util.getCurrentProjectSetting();
            projectSetting.projectName = $('#projectName').val();
            util.setCurrentProjectSetting(projectSetting);
        });
    });
}

//表示するプロジェクトを変更する
function changeProject(projectID, next) {
    var angle;
    if (next) {
        angle = 360;
    } else {
        angle = -360;
    }

    $('#bodyDiv').css('transition-duration', '0.5s');
    $('#bodyDiv').css('transform', 'rotateY(' + angle + 'deg)');
    
    requirejs(['util'], function (util) {
        util.setCurrentProjectID(projectID);
    });

    ipc.send('change-project', {});
}

//表示するプロジェクトを変更する（次へ）
function nextProject() {
    requirejs(['util'], function (util) {
        var projectID = util.getCurrentProjectID();
        if (projectID < 3) {
            projectID = projectID + 1;
            changeProject(projectID, true);
        }
    });
}

//表示するプロジェクトを変更する（前へ）
function prevProject() {
    requirejs(['util'], function (util) {
        var projectID = util.getCurrentProjectID();
        if (projectID != 0) {
            projectID = projectID - 1;
            changeProject(projectID, false);
        }
    });
}

$(function () {
    requirejs(['util'], function (util) {
        //初回アクセス時はcurrentProjectIDがないため0を固定でセット
        if (!util.getCurrentProjectID()) {
            util.setCurrentProjectID(0);
        }
        //プロジェクト名をlocalStorageから取得してセット
        if (util.getCurrentProjectSetting().projectName) {
            changeStateEditProjectName(false);
            $('#projectName').val(util.getCurrentProjectSetting().projectName);
        }

        jenkinsCtr.init();
        sonarCtr.init();

        //スプラッシュウィンドウを表示する
        $('#splashscreen').fadeOut(3500);

        //スクロールバーをカスタマイズするためにロードされたタイミングでCSSを変更する
        document.getElementById('redmine_frame').addEventListener("did-finish-load", function () {
            document.getElementById('redmine_frame').insertCSS("html::-webkit-scrollbar { width: 8px; background:#fafafa;}");
            document.getElementById('redmine_frame').insertCSS("html::-webkit-scrollbar-thumb { background: #d2d2d2; border-radius: 20px;}");
            document.getElementById('redmine_frame').insertCSS("html::-webkit-scrollbar-piece { background: #eee;}");
        });

        //RedemineのURLが設定されていない場合は設定画面へ自動遷移させる
        if (!util.getCurrentProjectSetting().url_redmine) {
            changeTab('setting');
            $('#welcomeDialog').modal('show');
        } else {
            changeTab('redmine');
            //localStorageからユーザID/パスワードを取得して自動的にログインを行う
            var executedFlag = false;
            document.getElementById('redmine_frame').addEventListener("dom-ready", function () {
                //ログイン処理を行うのは初回アクセス時のみとする
                if (executedFlag == false) {
                    document.getElementById('redmine_frame').executeJavaScript("document.getElementById('username').value = '" + util.getCurrentProjectSetting().userId_redmine + "'");
                    document.getElementById('redmine_frame').executeJavaScript("document.getElementById('password').value = '" + util.getCurrentProjectSetting().password_redmine + "'");
                    document.getElementById('redmine_frame').executeJavaScript("document.getElementsByName('login')[0].click()");
                    executedFlag = true;
                }
            });
        }

        //Jenkinsについては拡張子がtxtのリンクであればダウンロードを強制する
        document.getElementById('jenkins_frame').addEventListener("dom-ready", function () {
            document.getElementById('jenkins_frame').executeJavaScript("var aTag = document.getElementsByTagName('a'); for (var i=0; i< aTag.length; i++) { if(aTag[i].href.endsWith('.txt')){ aTag[i].setAttribute('download', aTag[i].innerText);}}");
        });

        document.onkeydown = function (e) {
            if (document.getElementById(currentTabName + '_frame')) {
                if (e.ctrlKey) {
                    //キーダウンイベントを制御し、webView内の操作をブラウザのように行う
                    if (e.keyCode == 116) {
                        reloadTab(currentTabName);
                    } else if (e.keyCode == 8) {
                        goBackTab(currentTabName);
                    } else if (e.altKey) {
                        //ctrl + alt + →が押された場合は別プロジェクトに移るようなアニメーションを入れる
                        if (e.keyCode == 39) {
                            nextProject();
                        } else if (e.keyCode == 37) {
                            prevProject();
                        }
                    }
                }
            }
        };

        //設定画面での設定変更をトリガーとする処理
        document.getElementById('setting').addEventListener('onChangeSetting', function (event) {
            // サービスのON/OFFが変更された場合は、パネルを初期化する必要があるので再起動
            if (event.param.key === "useService_jenkins") {
                jenkinsCtr.stopJenkinsService();
                jenkinsCtr.init();
            }
        });
    });
})
