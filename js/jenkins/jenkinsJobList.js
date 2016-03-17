'use strict';

//サーバから一括でから全job情報を取得する
var jenkinsJobList = (function() {
  var url = jenkinsCtr.getStoragedJenkinsUrl(),
      storageJobNames = jenkinsCtr.getStoragedJobNameList(),
      apiKey = jenkinsCtr.getStoragedApiKey(),
      jobs = []; //サーバから取得したjobリスト

  // コンストラクタ
  var jenkinsJobList = function() {};

  // メソッドの挙動は共通なのでprototypeに定義
  var proto = jenkinsJobList.prototype;
  // テーブル表現取得
  proto.getTableHtml = function() {
    var tableHtml = String() + "<table class='jenkins-job-list'>";
    $.each(jobs, function(i, val) {
      tableHtml += val.getRowHtml();
    });
    return tableHtml + "</table>";
  };
  // テーブル表現取得(最小化時)
  proto.getMinTableHtml = function() {
    var tableHtml = String() + "<table class='jenkins-job-list-min'>";
    $.each(jobs, function(i, val) {
      tableHtml += val.getMinRowHtml();
    });
    return tableHtml + "</table>";
  };
  // データ完全同期
  proto.updateAll = function() {
    var dfd = $.Deferred();
    // 配列を初期化　newしたjobはGCに回収される？
    jobs = [];
    var jobMap = {};
    // web-apiで問い合わせ
    getAllJobFunc()
      .done(function(result) {
        // 使いやすいようにjson結果をmapに変換
        $.each(result.jobs, function(i, val) {
          jobMap[val.name] = val;
        });
        // localstorageに保存されているjob一覧読み込み
        $.each(storageJobNames, function(i, val) {
          if(jobMap[val]){
            jobs.push(new jenkinsJob(jobMap[val].name,
              jobMap[val].color,
              jobMap[val].displayName));
          }
        });
        dfd.resolve();
      })
      .fail(function(data) {
        console.error(data);
        dfd.reject();
      });
    return dfd.promise();
  };

  proto.getJobs = function() {
    return jobs;
  };

  // privateメソッド定義
  var getAllJobFunc = function() {
    return $.ajax({
      url: url + "/api/json?depth=1&tree=jobs[name,color,displayName]&token="+apiKey,
      contentType: "application/json",
      dataType: 'json',
      type: "GET",
    })
  }

  return jenkinsJobList;
})();
