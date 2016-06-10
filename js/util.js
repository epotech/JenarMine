//現在アクティブなプロジェクトIDを取得
function getCurrentProjectID() {
    return parseInt(localStorage.getItem('currentProjectID'));
}

//現在アクティブなプロジェクトIDをセット
function setCurrentProjectID(projectID) {
    localStorage.setItem('currentProjectID', projectID);
}

//表示するプロジェクトを変更する
function changeProject(projectID) {
    $('#bodyDiv').css('transition-duration', '1s');
    $('#bodyDiv').css('transform', 'rotateY(' + projectID * 360 + 'deg)');
    setCurrentProjectID(projectID);
}

//表示するプロジェクトを変更する（次へ）
function nextProject() {
    var projectID = getCurrentProjectID();
    if (projectID < 4) {
        projectID = projectID + 1;
        changeProject(projectID);
    }
}

//表示するプロジェクトを変更する（前へ）
function prevProject() {
    var projectID = getCurrentProjectID();
    if (projectID != 0) {
        projectID = projectID - 1;
        changeProject(projectID);
    }
}

//localStorageから対象のプロジェクトIDに紐付く設定情報を取得
function getProjectSetting(projectID) {
    var projectSetting = localStorage.getItem('ptojectID' + projectID);
    if (!projectSetting) {
        return new Object();
    } else {
        return projectSetting;
    }
}