// 関数はdefineで定義（複数定義も可能）
define(function() {
    return {
        getCurrentProjectID: function () {
            //現在アクティブなプロジェクトIDを取得
            return parseInt(localStorage.getItem('currentProjectID'));
        },
        setCurrentProjectID: function (projectID) {
            //現在アクティブなプロジェクトIDをセット
            localStorage.setItem('currentProjectID', projectID);
        },
        getCurrentProjectSetting: function () {
            //localStorageから対象のプロジェクトIDに紐付く設定情報を取得
            var projectSetting = localStorage.getItem('projectSetting' + this.getCurrentProjectID());
            if (!projectSetting) {
                return new Object();
            } else {
                return JSON.parse(projectSetting);
            }
        },
        setCurrentProjectSetting: function(projectSetting) {
            //現在アクティブなプロジェクトIDに紐付くプロジェクト設定をlocalStorageに格納する
            localStorage.setItem('projectSetting' + this.getCurrentProjectID(), JSON.stringify(projectSetting));
        }
    };
});