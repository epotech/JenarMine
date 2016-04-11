'use strict';

var sonarCtr = (function() {
    // 初期処理
    function init() {
        // issue数を重要度ごとに表示
        writeIssueTableHtml();
        //最小化、最大化ボタン押下時の挙動
        $(".minimize").on('click', function() {
            $(".sonar-toggle").toggle(200);
            $(".redmine-webview-wrapper").toggleClass("redmine-webview-wrapper-min", 200);
        });
    }

    // issue数を重要度ごとに取得し、テーブルを生成する。
    function writeIssueTableHtml() {
        var issueList = new sonarIssueList();
        issueList.getIssueList();
        issueList.visualize();
    }

    function getStoragedSonarUrl() {
        return localStorage.getItem('url_sonar');
    }
    function getStoragedSonarProjectName() {
        return localStorage.getItem('projectname_sonar');
    }
    //公開フィールド、メソッドを返す
    return {
        init: init,
        getStoragedSonarUrl: getStoragedSonarUrl,
        getStoragedSonarProjectName: getStoragedSonarProjectName
    };
})();