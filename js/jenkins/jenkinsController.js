'use strict';

//joblistを保持
//設定とか最小化とか？
var jenkinsCtr = (function() {
  var siteUrl = "http://192.168.33.10:8080",
      jobList,
  init = function() {
    jobList = new jenkinsJobList();
    jobList.updateAll();
    //イベント設定どこでやる？
  },
  getTableHtml = function() {
    return jobList.getTableHtml();
  }
  return {
    siteUrl: siteUrl,
    getTableHtml: getTableHtml,
    init: init
  };
})();
