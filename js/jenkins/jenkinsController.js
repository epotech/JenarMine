'use strict';

//joblistを保持
//設定とか最小化とか？
var jenkinsCtr = (function() {
  var siteUrl = "http://192.168.33.10:8080",
    jobList,
    init = function() {
      jobList = new jenkinsJobList();
      //イベント設定どこでやる？
    },
    writeTableHtml = function() {
      jobList.updateAll()
        .done(function() {
          $("#jenkins").append(jobList.getTableHtml());
        });
    }
  return {
    siteUrl: siteUrl,
    writeTableHtml: writeTableHtml,
    init: init
  };
})();
