'use strict';

//自身、子供のjobの状態を取得
//jobの実行
var jenkinsJob = (function() {
  var url = jenkinsCtr.getStoragedJenkinsUrl(),
      apiKey = jenkinsCtr.getStoragedApiKey(),
      userName = jenkinsCtr.getStoragedUserName(),
      name, status, dispName;

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
                      + '<td class="job-name">'+this.dispName+'</td>'
                      + '<td class="job-panel"><table>'
                        + '<tr><td class="jenkins-icon jenkins_'+this.status+'"></td></tr>'
                        + '<tr><td class="jenkins-icon jenkins_clock '+this.name+'"></td></tr>'
                      + '</table></td>'
                    + '</tr>';
  };
  proto.getMinRowHtml = function() {
    return String() + '<tr>'
                      + '<td class="job-panel-min jenkins-icon jenkins_'+this.status+'"></td>'
                    + '</tr>';
  };
  // ジョブの実行
  proto.executeJob = function() {
    var authParam = btoa(userName + ":" + apiKey);
    $.ajax({
        url: url + "/job/"+this.name+"/build",
        dataType: "text",
        type: "POST",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic " + authParam);
        },
      }).done(function() {
        console.info("success");
      })
      .fail(function(data) {
        if (data.status === 400) alert("パラメータ付きジョブは実行できません");
      });
  };
  // ジョブステータスのセッター(いまのところつかっていない)
  proto.updateStatus = function(status) {
    this.jobStatus = status;
  };

  return jenkinsJob;
})();
