// 定数
var BROCKER = 'blocker_violations',
CRITICAL = 'critical_violations',
MAJOR = 'major_violations';

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
                height: 200,
                width: 350
            },
            data: {
                columns: [
                ['BROCKER', 0],
                ['CRITICAL', 8],
                ['MAJOR', 559]
                ],
                type: 'pie'
            }
        });
    });
}

// SonarAPI実行・XML読み込み
function getResources(){
    var sonarUrl = sonarCtr.getStoragedSonarUrl();
    $.ajax({
        url: sonarUrl + 'api/resources?resource=dcs.miraicompass.srm:srm-parent&metrics=blocker_violations,critical_violations,major_violations',
        type: 'get',
        dataType: "xml",
        success: function(xml) {
            $(".sonar-issue-list, .sonar-issue-list-min").remove();
            $(".sonar-body").append("<table class='sonar-issue-list table table-bordered'>");
            $(".sonar-body").append(createTableHeader);
            $("table.sonar-issue-list").append("<tbody>");
            $(xml).find("msr").each(createTableBody);
            $("table.sonar-issue-list").append("</tbody>");
            $(".sonar-body").append("</table>");
        }
    });
}

// HTMLテーブルヘッダ生成
function createTableHeader() {
    $("<thead class='sonar-issue-list-header'>" +
        "<tr>" + 
        "<th>重要度</th>" +
        "<th>issue数</th>" +
        "</tr>" +
        "</thead>").appendTo("table.sonar-issue-list");
}

// HTMLテーブルボディ生成
function createTableBody(){
    var $key = $(this).find("key").text();
    var $frmt_val = $(this).find("frmt_val").text();
    var category = getCategory($key);
    var style = getStyle($key);

    $('<tr class="' + style + '">' +
        '<td>' + category + '</td>' +
        '<td>' + $frmt_val + '</td>' +
        '</tr>').appendTo("table.sonar-issue-list tbody");
}

// キー値からカテゴリを取得
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

// キー値からカテゴリを取得
function getStyle($key) {
    switch ($key) {
        case BROCKER:
        return 'danger';
        case CRITICAL:
        return 'danger';
        case MAJOR:
        return 'warning';
        default:
        return 'info';
    }
}