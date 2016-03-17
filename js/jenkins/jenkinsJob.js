'use strict';

//自身、子供のjobの状態を取得
//jobの実行
var jenkinsJob = (function() {
  var url = jenkinsCtr.siteUrl,
      apiTokenParam = jenkinsCtr.apiTokenParam,
      name, status , dispName;

  // コンストラクタ
  var jenkinsJob = function(jobName, jobStatus, dispName) {
    this.name = jobName;
    this.status = jobStatus;
    this.dispName = dispName;
  };

  // メソッドの挙動は共通なのでprototypeに定義
  var proto = jenkinsJob.prototype;
  proto.getRowHtml = function() {
    return String() + '<tr>'
                      + '<td>'+this.dispName+'</td>'
                      + '<td>'+this.status+'</td>'
                      + '<td><button class="'+this.name+'">実行</button></td>'
                    + '</tr>';
  };
  proto.executeJob = function() {
    $.ajax({
        url: url + "/job/"+this.name+"/build?"+apiTokenParam,
        dataType: "text",
        type: "POST",
      }).done(function() {
        console.info("success");
      })
      .fail(function(data) {
        console.error(data);
      });
  };
  proto.updateStatus = function(status) {
    this.jobStatus = status;
  };

  return jenkinsJob;
})();
