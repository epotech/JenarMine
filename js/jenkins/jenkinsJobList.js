'use strict';

//localstorageから全job情報を取得する
//一括でjobの状態を更新する
var jenkinsJobList = (function() {
  var url = jenkinsCtr.siteUrl,
    jobs = []; //localstorage保存済みのjobリスト

  // コンストラクタ
  var jenkinsJobList = function() {};

  // メソッドの挙動は共通なのでprototypeに定義
  var proto = jenkinsJobList.prototype;
  // テーブル表現取得
  proto.getTableHtml = function() {
    var tableHtml = String() + "<table>";
    $.each(jobs, function(i, val) {
      tableHtml += val.getRowHtml();
      //onclickイベント追加
      $("#jenkins ."+val.name).on('click', function(){
        console.log("aaa");
        val.executeJob();
      });
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
    getJobInfoHash()
      .done(function(result) {
        // 使いやすいようにjson結果をmapに変換
        $.each(result.jobs, function(i, val) {
          jobMap[val.name] = val;
        });

        // localstorageに保存されているjob一覧読み込み
        $.each(getStoragedJobList(), function(i, val) {
          jobs.push(new jenkinsJob(jobMap[val].name,
            jobMap[val].color,
            jobMap[val].displayName));
        });
        console.log(jobs);
        dfd.resolve();
      })
      .fail(function(data) {
        console.error(data);
        dfd.reject();
      })
    return dfd.promise();
  };

  // ジョブステータスを同期
  proto.updateStatus = function() {
    //jobsのステータスとapiから取得したステータスを比較して、変更があれば書き換える
  };
  // privateメソッド定義
  var getStoragedJobList = function() {
    return ["huga", "hoge"];
  }
  var getJobInfoHash = function() {
    return $.ajax({
      url: url + "/api/json?depth=1&tree=jobs[name,color,displayName]",
      contentType: "application/json",
      dataType: 'json',
      type: "GET",
    })
  }

  return jenkinsJobList;
})();
