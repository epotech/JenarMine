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
proto.getIssueList = function() {
    getResources();
}

// issueリストからグラフを生成します。
proto.visualize = function() {
    requirejs(["d3", "c3"], function(d3, c3) {
        c3.generate({
            bindto: '#sonar-chart',
            size: {
                height: 210,
                width: 500
            },
            data: {
                columns: [
                ['BROCKER', brockerCnt],
                ['CRITICAL', criticalCnt],
                ['MAJOR', majorCnt]
                ],
                type: 'pie',
                colors: {
                    BROCKER: '#b92c28',
                    CRITICAL: '#e38d13',
                    MAJOR: '#28a4c9'
                }
            }
        });
    });
}

// SonarAPI実行・XML読み込み
function getResources(){
    var sonarUrl = sonarCtr.getStoragedSonarUrl();
    var projectName = sonarCtr.getStoragedSonarProjectName();
    $.ajax({
        url: sonarUrl + 'api/resources?resource=' + projectName + '&metrics=blocker_violations,critical_violations,major_violations',
        type: 'get',
        dataType: "xml",
        success: function(xml) {
            $(".sonar-issue-list, .sonar-issue-list-min").remove();
            $(".sonar-body").append("<table class='sonar-issue-list table table-striped table-bordered'>");
            $(".sonar-body").append(createTableHeader);
            $("table.sonar-issue-list").append("<tbody>");
            $(xml).find("msr").each(createTableBody);
            $("table.sonar-issue-list").append("</tbody>");
            $(".sonar-body").append("</table>");
        }
    });
}

// HTMLテーブルヘッダ部を生成します。
function createTableHeader() {
    $("<thead class='sonar-issue-list-header'>" +
        "<tr>" + 
        "<th>Severity</th>" +
        "<th>issues</th>" +
        "</tr>" +
        "</thead>").appendTo("table.sonar-issue-list");
}

// HTMLテーブルボディ部を生成します。
function createTableBody(){
    var $key = $(this).find("key").text();
    var $frmt_val = $(this).find("frmt_val").text();
    var category = getCategory($key);
    var style = getStyle($key);
    setCount($key, $frmt_val);

    $('<tr class="' + style + '">' +
        '<td class="severity-' + category + '">' + category + '</td>' +
        '<td>' + $frmt_val + '</td>' +
        '</tr>').appendTo("table.sonar-issue-list tbody");
}

// キー値からカテゴリを取得します。
function getCategory($key) {
    switch ($key) {
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

// キー値からカテゴリを取得します。
function getStyle($key) {
    switch ($key) {
        case BROCKER:
        return 'danger';
        case CRITICAL:
        return 'warning';
        case MAJOR:
        return 'info';
        default:
        return '';
    }
}

// キー値からカテゴリを取得します。
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