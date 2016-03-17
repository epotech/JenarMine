'use strict';

//joblistを保持
//設定とか最小化とか？
//画面表示とかイベント設定とかそこらへん全部
var jenkinsCtr = (function() {
  var siteUrl= "http://172.28.21.37:58080"
  ,storagedJobNameList= ["test"]
  ,apiTokenParam="&token=e94798d69c81d02a45ec09cf138e5723",
    init = function() {
      // siteUrl = "http://172.28.21.37:58080";
      // storagedJobNameList = ["test"];
      // apiTokenParam = "&token=e94798d69c81d02a45ec09cf138e5723";
    },
    writeTableHtml = function() {
      var jobList = new jenkinsJobList();
      jobList.updateAll()
        .done(function() {
          $("#jenkins").append(jobList.getTableHtml());
          //onclickイベント追加
          $.each(jobList.getJobs(), function(i, val) {
            $("#jenkins ."+val.name).on('click', function(){
              console.log("aaa");
              val.executeJob();
            });
          });
        })
        .fail(function(data) {
          $("#jenkins").append("Jobの取得エラー！jenkinsに接続できませんでした！");
        });
    },
    getStoragedJenkinsUrl = function() {
      return "http://172.28.21.37:58080";
    },
    getStoragedJobNameList = function() {
      return ["test"];
    },
    getStoragedApiTokenParam = function() {
      //apiがなければ空文字を返却する
      return "token=e94798d69c81d02a45ec09cf138e5723";
    }
  //公開フィールド、メソッドを返す
  return {
    writeTableHtml: writeTableHtml,
    init: init,
    siteUrl: siteUrl,
    storagedJobNameList: storagedJobNameList,
    apiTokenParam: apiTokenParam
  };
})();
