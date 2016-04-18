'use strict';

var sonarCtr = (function() {
    // 初期処理
    function init() {
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
    // プロジェクトのissue数をグラフ化する。
    function visualizeProjectIssue() {
        var projectList = getStoragedWatchProjectList();
        if (projectList.length == 0) {
            $("<div class='no-watch-project'>Sonar解析プロジェクトが設定されていません。</div>").appendTo(".sonar-body");
        } else {
            $(".no-watch-project").remove();
            var issueList = new sonarIssueList();
            $.each(projectList, function(i, val) {
                issueList.getIssueList(i, val);
            })
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
        getStoragedWatchProjectList: getStoragedWatchProjectList
    };
})();