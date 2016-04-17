'use strict';

var sonarCtr = (function() {
    // 初期処理
    function init() {
        setProjectNameFromSetting();
        writeIssueTableHtml();
        visualizeProjectIssue();
        // 最小化ボタン押下時の挙動
        $(".minimizeSonar").on('click', function() {
         $(".sonar-toggle").toggle(200);
         $("#redmine_frame").css('height', '92%');
     });
        // 最大化ボタン押下時
        $(".maximizeSonar").on('click', function() {
            $(".sonar-toggle").toggle(200);
            $("#redmine_frame").css('height', '60%');
        });

    }

    // ローカルストレージに保存されたプロジェクト名を取得して、フォームに設定する。
    // 未設定の場合は何もしない。
    function setProjectNameFromSetting() {
        var projectName = getStoragedSonarProjectName();
        if (projectName == null) {
            return;
        } else {
            $('#selected_projectname_sonar').val(projectName);
        }

    }

    // issue数を重要度ごとに取得し、テーブルを生成する。
    function writeIssueTableHtml() {
        var issueList = new sonarIssueList();
        issueList.getIssueList();
        issueList.visualize();
    }

    // プロジェクトのissue数をグラフ化する。
    function visualizeProjectIssue() {
        var projectList = getStoragedWatchProjectList();
        if (projectList.length == 0) {
            $("<div>Sonar解析プロジェクトが設定されていません。</div>").appendTo(".sonar-body");
        } else {
            // グラフ化処理実装
        }
    }

    // プロジェクトが設定されていない場合の初期表示
    function writeInitViewHtml() {

    }

    function getStoragedSonarUrl() {
        return localStorage.getItem('url_sonar');
    }
    function getStoragedSonarProjectName() {
        return localStorage.getItem('projectname_sonar');
    }
    function getStoragedWatchProjectList() {
        var storagedWatchProjectList = [];
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).startsWith('watch_projectId')) {
              storagedWatchProjectList.push(localStorage.getItem(localStorage.key(i)));
          }
      }
      return storagedWatchProjectList;
  }

    //公開フィールド、メソッドを返す
    return {
        init: init,
        getStoragedSonarUrl: getStoragedSonarUrl,
        getStoragedSonarProjectName: getStoragedSonarProjectName,
        getStoragedWatchProjectList: getStoragedWatchProjectList
    };
})();