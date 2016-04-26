'use strict';

//サーバから一括でから全job情報を取得する
var jenkinsJobList = (function() {
  var url,storageJobNames,userName,apiKey,
      jobs; //サーバから取得したjobリスト

  // コンストラクタ
  var jenkinsJobList = function(url,storageJobNames,userName,apiKey) {
    this.url = url;
    this.storageJobNames = storageJobNames;
    this.userName = userName;
    this.apiKey = apiKey;
  };

  // メソッドの挙動は共通なのでprototypeに定義
  var proto = jenkinsJobList.prototype;
  // テーブル表現取得
  proto.getTableHtml = function() {
    var tableHtml = String() + "<table class='jenkins-job-list table table-striped'>";
    $.each(this.jobs, function(i, val) {
      tableHtml += val.getRowHtml();
    });
    return tableHtml + "</table>";
  };
  // テーブル表現取得(最小化時)
  proto.getMinTableHtml = function() {
    var tableHtml = String() + "<table class='jenkins-job-list-min'>";
    $.each(this.jobs, function(i, val) {
      tableHtml += val.getMinRowHtml();
    });
    return tableHtml + "</table>";
  };
  // データ完全同期
  proto.updateAll = function() {
    var dfd = $.Deferred();
    var self = this;
    // 配列を初期化
    self.jobs = [];
    var jobMap = {};

    // web-apiで問い合わせ
    getAllJobFunc(self)
      .done(function(result) {
        // 使いやすいようにjson結果をmapに変換
        $.each(result.jobs, function(i, val) {
          jobMap[val.name] = val;
        });
        // localstorageに保存されているjob一覧読み込み
        $.each(self.storageJobNames, function(i, val) {
          if(jobMap[val]){
            self.jobs.push(new jenkinsJob(
              self.url,
              self.apiKey,
              self.userName,
              jobMap[val].name,
              jobMap[val].color,
              jobMap[val].displayName));
          }
        });
        dfd.resolve();
      })
      .fail(function(data) {
        // console.error(data);
        dfd.reject();
      });
    return dfd.promise();
  };

  proto.getJobs = function() {
    return this.jobs;
  };

  // privateメソッド定義
  var getAllJobFunc = function(self) {
    var authParam = btoa(self.userName + ":" + self.apiKey);
    return $.ajax({
      url: self.url + "/api/json?depth=1&tree=jobs[name,color,displayName]",
      contentType: "application/json",
      dataType: 'json',
      type: "GET",
      beforeSend: function (xhr){
        xhr.setRequestHeader('Authorization', "Basic " + authParam);
      }
    })
  }

  return jenkinsJobList;
})();
