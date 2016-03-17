'use strict';

//joblistを保持
//設定とか最小化とか？
//画面表示とかイベント設定とかそこらへん全部
var jenkinsCtr = (function() {
  var pollingIntervalSecond = 10;
  function init(){
    writeTableHtml();
    //定期的にテーブルを更新する処理開始
    setInterval(function(){
        writeTableHtml();
    },pollingIntervalSecond * 1000);
  }
  function writeTableHtml() {
    var jobList = new jenkinsJobList();
    jobList.updateAll()
      .done(function() {
        $("#jenkins-job-list").remove();
        $("#jenkins").append(jobList.getTableHtml());
        //onclickイベント追加
        $.each(jobList.getJobs(), function(i, val) {
          $("#jenkins ." + val.name).on('click', function() {
            val.executeJob();
          });
        });
        //実行中のjobがあれば点滅
        setInterval(function(){
          $('#jenkins-job-list .blue_anime').fadeOut(500,function(){$(this).fadeIn(500)});
        },1000);
      })
      .fail(function() {
        $("#jenkins-job-list").remove();
        $("#jenkins").append("Jobの取得エラー！jenkinsに接続できませんでした！");
      });
  }

  function getStoragedJenkinsUrl() {
    return "http://192.168.33.10:8080";
  }

  function getStoragedJobNameList() {
    return ["huga", "hoge"];
  }

  function getStoragedApiKey() {
    //apiがなければ空文字を返却する
    return "6f01982f39ce2b8cc55253e9d2714fd3";
  }
  function getUserName() {
    return "admin";
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
