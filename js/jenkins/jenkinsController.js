'use strict';

//画面表示とかイベント設定とかそこらへんをやるモジュール
var jenkinsCtr = (function() {
  var pollingIntervalSecond = 10;
  var pollingTimer;

  function init() {
    // 設定画面でjenkinsが無効化されている場合はAPI問い合わせを行わない
    if (!isJenkinsServiceEnabled()) {
      // $(".maximize-panel").css("opacity", "0.0").css("cursor", "default");
      return;
    }
    writeTableHtml();
    //定期的にテーブルを更新する処理開始
    pollingTimer = setInterval(function() {
      writeTableHtml();
    }, pollingIntervalSecond * 1000);
    //最小化、最大化ボタン押下時の挙動
    $(".minimize").on('click.jenkinsFunc', function() {
      $(".jenkins-toggle").toggle(200);
      $(".redmine-webview-wrapper")
        .toggleClass("redmine-webview-wrapper-min", 200);
    });
  }
  //localstorageに保存されてるジョブ名を元に、
  //jobの状態を問い合わせて画面に描画する
  function writeTableHtml() {
    var jobList = new jenkinsJobList(
      getStoragedJenkinsUrl(),
      getStoragedJobNameList(),
      getStoragedUserName(),
      getStoragedApiKey()
    );
    jobList.updateAll()
      .done(function() {
        $(".jenkins-job-list, .jenkins-job-list-min").remove();
        $(".jenkins-body").append(jobList.getTableHtml());
        $(".jenkins-body-min").append(jobList.getMinTableHtml());
        //onclickイベント追加
        $.each(jobList.getJobs(), function(i, val) {
          $(".jenkins-job-list ." + val.name).on('click.jenkinsFunc', function() {
            if (!confirm('ジョブを実行しますか？\n' + val.dispName)) return;
            val.executeJob();
            // クリック時に一回点滅させる
            $(this).fadeOut(500, function() {
              $(this).fadeIn(500)
            });
          });
        });
        //実行中のjobがあれば点滅
        // setInterval(function() {
        //   $('.jenkins_red_anime , .jenkins_yellow_anime, .jenkins_blue_anime').fadeOut(500, function() {
        //     $(this).fadeIn(500)
        //   });
        // }, 1000);
      })
      .fail(function() {
        $(".jenkins-job-list, .jenkins-job-list-min").remove();
        $(".jenkins-body").append("<div class='jenkins-job-list'>jenkinsに接続できませんでした。<br>設定情報を確認してください。</div>");
      });
  }

  function isJenkinsServiceEnabled() {
    return localStorage.getItem('useService_jenkins') === 'true';
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

  function stopJenkinsService() {
    clearInterval(pollingTimer);
    $(".minimize,.jenkins-job-list").off(".jenkinsFunc");
    $("#jenkins-inline").hide();
    $("#jenkins-min").show();
    $(".redmine-webview-wrapper")
      .addClass("redmine-webview-wrapper-min");
  }
  //公開フィールド、メソッドを返す
  return {
    init: init,
    stopJenkinsService: stopJenkinsService
  };
})();
