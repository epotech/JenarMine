'use strict';

//localstorageから全job情報を取得する
//一括でjobの状態を更新する
var jenkinsJobList = (function() {
  var url = jenkinsCtr.siteUrl,
      storageJobNames = jenkinsCtr.storagedJobNameList,
      apiTokenParam = jenkinsCtr.apiTokenParam,
      jobs = []; //サーバから取得したjobリスト

  // コンストラクタ
  var jenkinsJobList = function() {};

  // メソッドの挙動は共通なのでprototypeに定義
  var proto = jenkinsJobList.prototype;
  // テーブル表現取得
  proto.getTableHtml = function() {
    var tableHtml = String() + "<table>";
    $.each(jobs, function(i, val) {
      tableHtml += val.getRowHtml();
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
        console.log(jobs);
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

    console.log(url);
    return $.ajax({
      url: url + "/api/json?depth=1&tree=jobs[name,color,displayName]&"+apiTokenParam,
      contentType: "application/json",
      dataType: 'json',
      type: "GET",
    })
  }

  return jenkinsJobList;
})();
