'use strict';

//画面表示とかイベント設定とかそこらへんをやるモジュール
var jenkinsCtr = (function() {
  var pollingIntervalSecond = 10;
  function init(){
    writeTableHtml();
    //定期的にテーブルを更新する処理開始
    setInterval(function(){
        writeTableHtml();
    },pollingIntervalSecond * 1000);
    //最小化、最大化ボタン押下時の挙動
    $(".minimize").on('click', function() {
      $(".jenkins-toggle").toggle(200);
      $(".redmine-webview-wrapper")
        .toggleClass("redmine-webview-wrapper-min", 200);
    });
  }
  //localstorageに保存されてるジョブ名を元に、
  //jobの状態を問い合わせて画面に描画する
  function writeTableHtml() {
    var jobList = new jenkinsJobList();
    jobList.updateAll()
      .done(function() {
        $(".jenkins-job-list, .jenkins-job-list-min").remove();
        $(".jenkins-body").append(jobList.getTableHtml());
        $(".jenkins-body-min").append(jobList.getMinTableHtml());
        //onclickイベント追加
        $.each(jobList.getJobs(), function(i, val) {
          $(".jenkins-job-list ." + val.name).on('click', function() {
            val.executeJob();
            $(this).fadeOut(500,function(){$(this).fadeIn(500)});
          });
        });
        //実行中のjobがあれば点滅
        setInterval(function(){
          $('.blue_anime , .red_anime').fadeOut(500,function(){$(this).fadeIn(500)});
        },1000);
      })
      .fail(function() {
        $(".jenkins-job-list, .jenkins-job-list-min").remove();
        $(".jenkins-body").append("<div class='jenkins-job-list'>jenkinsに接続できませんでした！</div>");
      });
  }

  function getStoragedJenkinsUrl() {
    return localStorage.getItem('url_jenkins');
  }

  function getStoragedJobNameList() {
    return ["hoge","huga"];
  }

  function getStoragedApiKey() {
    //apiがなければ空文字を返却する
    return "e94798d69c81d02a45ec09cf138e5723";
  }
  function getStoragedUserName() {
    return localStorage.getItem('userId_jenkins');
  }
  //公開フィールド、メソッドを返す
  return {
    init: init,
    getStoragedApiKey: getStoragedApiKey,
    getStoragedJenkinsUrl: getStoragedJenkinsUrl,
    getStoragedJobNameList: getStoragedJobNameList,
    getStoragedUserName: getStoragedUserName
  };
})();
