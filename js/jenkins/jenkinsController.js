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
  }
  //localstorageに保存されてるジョブ名を元に、
  //jobの状態を問い合わせて画面に描画する
  function writeTableHtml() {
    var jobList = new jenkinsJobList();
    jobList.updateAll()
      .done(function() {
        $("#jenkins-job-list").remove();
        $("#jenkins-body").append(jobList.getTableHtml());
        //onclickイベント追加
        $.each(jobList.getJobs(), function(i, val) {
          $("#jenkins-job-list ." + val.name).on('click', function() {
            val.executeJob();
          });
        });
        //実行中のjobがあれば点滅
        setInterval(function(){
          $('.blue_anime , .red_anime').fadeOut(500,function(){$(this).fadeIn(500)});
        },1000);
      })
      .fail(function() {
        $("#jenkins-job-list").remove();
        $("#jenkins-body").append("Jobの取得エラー！jenkinsに接続できませんでした！");
      });
  }

  function getStoragedJenkinsUrl() {
    return localStorage.getItem('url_jenkins');
  }

  function getStoragedJobNameList() {
    return ["huga", "hoge"];
  }

  function getStoragedApiKey() {
    //apiがなければ空文字を返却する
    return "6f01982f39ce2b8cc55253e9d2714fd3";
  }
  function getUserName() {
    return localStorage.getItem('userId_jenkins');
  }
  //公開フィールド、メソッドを返す
  return {
    init: init,
    getStoragedApiKey: getStoragedApiKey,
    getStoragedJenkinsUrl: getStoragedJenkinsUrl,
    getStoragedJobNameList: getStoragedJobNameList,
    getUserName: getUserName
  };
})();
