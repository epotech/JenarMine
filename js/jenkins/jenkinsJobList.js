'use strict';

//localstorageから全job情報を取得する
//一括でjobの状態を更新する
var jenkinsJobList = (function() {
  var url = jenkinsCtr.siteUrl,
      jobs = [];//localstorage保存済みのjobリスト

  // コンストラクタ
  var jenkinsJobList = function() {
    this.updateAll();
  };

  // メソッドの挙動は共通なのでprototypeに定義
  var proto = jenkinsJobList.prototype;
  // テーブル表現取得
  proto.getTableHtml = function() {
    var tableHtml = String()+"<table>";
    $.each(jobs, function(i, val) {
      tableHtml += val.getRowHtml();
    });
    return tableHtml +"</table>";
  };
  // データ完全同期
  proto.updateAll = function() {
    // 配列を初期化　newしたjobはGCに回収される？
    jobs = [];
    // web-apiで問い合わせ


    //問い合わせ結果をもとにインスタンスを生成してjobsに格納
    var job1 = new jenkinsJob("huga","blue","ジョブ名称１");
    var job2 = new jenkinsJob("hoge","red","ジョブ名称２");
    jobs.push(job1);
    jobs.push(job2);
  };
  // ジョブステータスを同期
  proto.updateStatus = function() {
    //jobsのステータスとapiから取得したステータスを比較して、変更があれば書き換える
  };

  return jenkinsJobList;
})();
