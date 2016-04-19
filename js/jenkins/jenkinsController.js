'use strict';

//画面表示とかイベント設定とかそこらへんをやるモジュール
var jenkinsCtr = (function() {
  var pollingIntervalSecond = 10;
  var pollingTimer;

  function init() {
    writeTableHtml();
    //定期的にテーブルを更新する処理開始
    pollingTimer = setInterval(function() {
      writeTableHtml();
    }, pollingIntervalSecond * 1000);
    //最小化、最大化ボタン押下時の挙動
    $(".minimize").on('click', function() {
      $(".jenkins-toggle").toggle(200);
      $(".redmine-webview-wrapper")
        .toggleClass("redmine-webview-wrapper-min", 200);
    });
    document.addEventListener('onChangeSetting', function(event) {
       console.log('aaa');
     });
  }
  //localstorageに保存されてるジョブ名を元に、
  //jobの状態を問い合わせて画面に描画する
  function writeTableHtml() {
    var jobList = new jenkinsJobList();
    jobList.updateAll()
      .done(function() {
        $(".jenkins-job-list, .jenkins-job-list-min").remove();
        $(".jenkins-body").append(jobList.getTableHtml());
        $(".jenkins-body-min").append(jobList.getMinTableHtml());
        //onclickイベント追加
        $.each(jobList.getJobs(), function(i, val) {
          $(".jenkins-job-list ." + val.name).on('click', function() {
            if (!confirm('ジョブを実行しますか？\n' + val.dispName)) return false;
            val.executeJob();
            // クリック時に一回点滅させる
            $(this).fadeOut(500, function() {
              $(this).fadeIn(500)
            });
          });
        });
        //実行中のjobがあれば点滅
        setInterval(function() {
          $('.jenkins_red_anime , .jenkins_yellow_anime, .jenkins_blue_anime').fadeOut(500, function() {
            $(this).fadeIn(500)
          });
        }, 1000);
      })
      .fail(function() {
        $(".jenkins-job-list, .jenkins-job-list-min").remove();
        $(".jenkins-body").append("<div class='jenkins-job-list'>jenkinsに接続できませんでした。<br>設定情報を確認してください。</div>");
      });
  }

  function getStoragedJenkinsUrl() {
    return localStorage.getItem('url_jenkins');
  }

  function getStoragedJobNameList() {
    var storagedJobNameList = [];
    for (var i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).startsWith('favorite_jobId')) {
        storagedJobNameList.push(localStorage.getItem(localStorage.key(i)));
      }
    }
    return storagedJobNameList;
  }

  function getStoragedApiKey() {
    return localStorage.getItem('API_key_jenkins');
  }

  function getStoragedUserName() {
    return localStorage.getItem('userId_jenkins');
  }

  function stopPollingTimer() {
    clearInterval(pollingTimer);
  }
  //公開フィールド、メソッドを返す
  return {
    init: init,
    getStoragedApiKey: getStoragedApiKey,
    getStoragedJenkinsUrl: getStoragedJenkinsUrl,
    getStoragedJobNameList: getStoragedJobNameList,
    getStoragedUserName: getStoragedUserName,
    stopPollingTimer: stopPollingTimer
  };
})();
