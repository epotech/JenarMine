// 定数
var BROCKER = 'blocker_violations',
CRITICAL = 'critical_violations',
MAJOR = 'major_violations';

// 変数
var brockerCnt = '';
var criticalCnt = '';
var majorCnt = '';

// requirejs読込み
var requirejs = require('requirejs');

requirejs.config({
  paths: {
    c3: "js/c3.min",
    d3: "js/d3.min"
  }
});

// コンストラクタ
var sonarIssueList = function() {};

// prototype定義
var proto = sonarIssueList.prototype;

// issue数のリストを取得します。
proto.getIssueList = function(i, projectName) {
  clearCount();
  getResources(i, projectName);
}

// SonarAPI実行・XML読み込み
function getResources(i, projectName){
  var sonarUrl = sonarCtr.getStoragedSonarUrl();
  if(sonarUrl.endsWith('/')) {
    sonarUrl = sonarUrl.substr(0, sonarUrl.length - 1);
  }
  $.ajax({
    url: sonarUrl + '/api/resources?resource=' + projectName + '&metrics=blocker_violations,critical_violations,major_violations',
    type: 'get',
    dataType: "xml",
    error: function() {
      showErrMsg(projectName);
    },
    success: function(xml) {
      var project = $(xml).find("name").text();
      $(xml).find("msr").each(countIssue);
      visualize(i, project, brockerCnt, criticalCnt, majorCnt);
    }
  });
}

// issue数をカウントする。
function countIssue() {
  var key = $(this).find("key").text();
  var frmt_val = $(this).find("frmt_val").text();
  var category = getCategory(key);
  setCount(key, frmt_val);
}

 // 取得したissue数をグラフ化します。
 function visualize(i, project, brockerCnt, criticalCnt, majorCnt) {
  appendTitle(i, project);
  appendChart(i, brockerCnt, criticalCnt, majorCnt);
}

// APIエラー時処理
function showErrMsg(projectName) {
  $('<div class="no-watch-project col-sm-6">' +
    'SonarURLまたはプロジェクト名の指定が誤っている可能性があります。<br>' +
    'プロジェクト名：' + projectName + '</div>').appendTo(".sonar-body");
}

// タイトル行生成
function appendTitle(i, project) {
  i++;
  $('<div id="sonar-project' + i + '" ' + 'class="col-sm-4">' +
    '<h4>project ' + i + ': ' + project + '</h4>' +
    '</div>').appendTo(".sonar-body");
}

// グラフエリア生成
function appendChart(i, brockerCnt, criticalCnt, majorCnt) {
  i++;
  var selector = '#sonar-project' + i;
  $('<div id="sonar-chart' + i + '" class="col-sm-12"></div>').appendTo(selector);
  drawing(i, brockerCnt, criticalCnt, majorCnt);
}

// グラフ描画
function drawing(i, brockerCnt, criticalCnt, majorCnt) {
  var bind = '#sonar-chart' + i;
  requirejs(["d3", "c3"], function(d3, c3) {
   c3.generate({
     bindto: bind,
     size: {
      height: 220,
      width: 350
    },
    data: {
     columns: [
     ['BROCKER', brockerCnt],
     ['CRITICAL', criticalCnt],
     ['MAJOR', majorCnt]
     ],
     type: 'bar',
     labels: true,
     colors: {
       BROCKER: '#b92c28',
       CRITICAL: '#e38d13',
       MAJOR: '#28a4c9'
     }
   },
   axis: {
    x: {
      type: 'category',
      categories: ['']
    },
    y: {
      label: 'issues'
    }
  }
});
 });
}

// キー値からカテゴリを取得します。
function getCategory(key) {
  switch (this) {
    case BROCKER:
    return 'BROCKER';
    case CRITICAL:
    return 'CRITICAL';
    case MAJOR:
    return 'MAJOR';
    default:
    return 'OTHERS';
  }
}

// カテゴリ毎にissue数を設定します。
function setCount($key, $frmt_val) {
  switch ($key) {
    case BROCKER:
    brockerCnt = $frmt_val;
    case CRITICAL:
    criticalCnt = $frmt_val;
    case MAJOR:
    majorCnt = $frmt_val;
    default:
    return;
  }
}

// 変数クリア処理
function clearCount() {
  brockerCnt = '';
  criticalCnt = '';
  majorCnt = '';
}