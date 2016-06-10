//現在アクティブなプロジェクトIDを取得
function getCurrentProjectID() {
    return parseInt(localStorage.getItem('currentProjectID'));
}

//現在アクティブなプロジェクトIDをセット
function setCurrentProjectID(projectID) {
    localStorage.setItem('currentProjectID', projectID);
}

//localStorageから対象のプロジェクトIDに紐付く設定情報を取得
function getCurrentProjectSetting() {
    var projectSetting = localStorage.getItem('ptojectID' + getCurrentProjectID());
    alert(projectSetting);
    if (!projectSetting) {
        return new Object();
    } else {
        return JSON.parse(projectSetting);
    }
}

//現在アクティブなプロジェクトIDに紐付くプロジェクト設定をlocalStorageに格納する
function setCurrentProjectSetting(projectSetting) {
    localStorage.setItem('ptojectID' + getCurrentProjectID(), JSON.stringify(projectSetting));
}





//スイッチボタンでONになっているサービスのみを表示するようにするメソッド
function useServiceChange() {
    $('[name="useService"]').each(function () {
        if ($(this).bootstrapSwitch('state')) {
            $('.' + $(this).prop('id').split('useService_')[1] + '-group').css('display', 'block');
        } else {
            $('.' + $(this).prop('id').split('useService_')[1] + '-group').css('display', 'none');
        }
    });
}

//ローカルストレージに値を保存するためのメソッド
function setLocalStorage(key, value) {
    var projectSetting = getCurrentProjectSetting();
    projectSetting[key] = value;
    setCurrentProjectSetting(projectSetting);

    //変更があったことをトリガにeventを発火
    var customEvent = new Event('onChangeSetting');
    customEvent.param = {"key":key,"value":value};
    document.getElementById('setting').dispatchEvent(customEvent);
}

//ジョブを追加するフォームをappendするメソッド
function appendFavoriteJob(id, value) {
    $('#favorite_job_group').append('<div id="' + id + '_group"><div class="form-group"><label for="' + id + '" class="col-md-2 control-label">お気に入りジョブID(Jenkins)</label><div class="col-md-4"><input id="' + id + '" value="' + value + '" class="form-control" onBlur="setLocalStorage(this.id, this.value)" type="text" placeholder="ジョブID" /></div><button type="button" class="btn btn-danger" onclick=removeSettingElement("' + id + '")>Remove</button></div></div>');
}

//Jenkinsのジョブ追加ボタンが押下された際に、ジョブを追加するフォームをappendするメソッド
function addFavoriteJob() {
    setLocalStorage('favorite_job_count', parseInt(getCurrentProjectSetting().favorite_job_count == undefined ? 0 : getCurrentProjectSetting().favorite_job_count) + 1);
    appendFavoriteJob('favorite_jobId' + getCurrentProjectSetting().favorite_job_count, '');
}

//TOPページに表示するプロジェクト設定をappendするメソッド
function appendWatchProject(id, value) {
    $('#watch_project_group').append('<div id="' + id + '_group"><div class="form-group"><label for="' + id + '" class="col-md-2 control-label">TOPページ表示プロジェクト(Sonar)</label><div class="col-md-4"><input id="' + id + '" value="' + value + '" class="form-control" onBlur="setLocalStorage(this.id, this.value)" type="text" placeholder="[packagename]:[projectname]" /></div><button type="button" class="btn btn-danger" onclick=removeSettingElement("' + id + '")>Remove</button></div></div>');
}

//Jenkinsのジョブ追加ボタンが押下された際に、ジョブを追加するフォームをappendするメソッド
function addWatchProject() {
    setLocalStorage('watch_project_count', parseInt(getCurrentProjectSetting().watch_project_count == undefined ? 0 : getCurrentProjectSetting().watch_project_count) + 1);
    appendWatchProject('watch_projectId' + getCurrentProjectSetting().watch_project_count, '');
}

//指定されたIDの要素とlocalStorageに格納されている要素を削除するメソッド（本メソッドは設定画面の追加要素に対してのみ有効）
function removeSettingElement(id) {
    localStorage.removeItem(id);
    var job = document.getElementById(id + '_group');
    job.parentNode.removeChild(job);
}

//webviewのsrcを変更するメソッド
function setWebViewSrc(target) {
    if (target == "redmine") {
        //redmineについてはログイン画面に自動遷移するため、設定されたURLの末尾に「/」があれば削除してアクセスする
        var redmineURL = getCurrentProjectSetting().url_redmine;
        if(redmineURL){
          if (redmineURL.endsWith('/')) {
              redmineURL = redmineURL.substr( 0, redmineURL.length - 1);
          }
        }
        document.getElementById('redmine_frame').setAttribute('src', redmineURL + '/login');
    } else {
        document.getElementById(target + '_frame').setAttribute('src', getCurrentProjectSetting()['url_' + target]);
    }
}

$(function () {
    //Redmineは必ず利用する
    setLocalStorage('useService_redmine', 'true');

    // 初期表示にlocalstorageから利用するサービス情報をロード
    $('.settingProp').each(function () {
        if ($(this).attr('type') == 'checkbox') {
            $(this).bootstrapSwitch('state', getCurrentProjectSetting()[$(this).prop('id')] == true ? true : false);
        } else {
            $(this).val(getCurrentProjectSetting()[$(this).prop('id')]);
        }
    });

    //設定プロパティはすべてonblur時にlocalStorageに格納
    $('.settingProp').each(function () {
        if ($(this).attr('type') == 'checkbox') {
            $(this).on('switchChange.bootstrapSwitch', function (event, state) {
                setLocalStorage($(this).prop('id'), state);
                useServiceChange();
            });
        } else {
            $(this).blur(function () {
                setLocalStorage($(this).prop('id'), $(this).val());
            });
        }
    });

    //ツールチップの挙動をjqueryで上書き
    $('.glyphicon-repeat').tooltip();

    //登録されている要素分だけ設定画面の各種設定要素にDOMを追加する
    var projectSetting = getCurrentProjectSetting();
    for (var i in projectSetting){
        if (i.startsWith('favorite_jobId')) {
            appendFavoriteJob(i, projectSetting[i]);
        } else if (i.startsWith('watch_projectId')) {
            appendWatchProject(i, projectSetting[i]);
        }
    }

    //利用しないサービスは非表示にする
    useServiceChange();

    //webviewのsrcを変更
    setWebViewSrc('redmine');
    setWebViewSrc('jenkins');
    setWebViewSrc('sonar');
});
