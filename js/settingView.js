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
    localStorage.setItem(key, value);
}

//ジョブを追加するフォームをappendするメソッド
function appendFavoriteJob(id) {
    $('#favorite_job_group').append('<div id="' + id + '"><div class="form-group"><label for="' + id + '" class="col-md-2 control-label">お気に入りジョブID(Jenkins)</label><div class="col-md-6"><input id="' + id + '" class="form-control" onBlur="setLocalStorage(this.id, this.value)" type="text" placeholder="ジョブID" /></div></div></div>');
}

//Jenkinsのジョブ追加ボタンが押下された際に、ジョブを追加するフォームをappendするメソッド
function addFavoriteJob() {
    localStorage.setItem('favorite_job_count', parseInt(localStorage.getItem('favorite_job_count') == undefined ? 0 : localStorage.getItem('favorite_job_count')) + 1);
    appendFavoriteJob('favorite_job' + localStorage.getItem('favorite_job_count'));
}

$(function () {
    //Redmineは必ず利用する
    localStorage.setItem('useService_redmine', 'true');
    
    // 初期表示にlocalstorageから利用するサービス情報をロード
    $('.settingProp').each(function () {
        if ($(this).attr('type') == 'checkbox') {
            $(this).bootstrapSwitch('state', localStorage.getItem($(this).prop('id')) == 'true' ? true : false);
        } else {
            $(this).val(localStorage.getItem($(this).prop('id')));
        }
    });

    //設定プロパティはすべてonblur時にlocalStorageに格納
    $('.settingProp').each(function () {
        if ($(this).attr('type') == 'checkbox') {
            $(this).on('switchChange.bootstrapSwitch', function (event, state) {
                localStorage.setItem($(this).prop('id'), state);
                useServiceChange();
            });
        } else {
            $(this).blur(function () {
                setLocalStorage($(this).prop('id'), $(this).val());
            });
        }
    });
    
    //登録されているfavorite job分だけ設定画面のJenkinsジョブにDOMを追加する
    for (var i=0 ; i<localStorage.length ; i++){
        if (localStorage.key(i).startsWith('favorite_jobId')) {
            appendFavoriteJob(localStorage.key(i));
        }
    }
    
    //利用しないサービスは非表示にする
    useServiceChange();

    //webviewのsrcを変更
    document.getElementById('redmine_frame').setAttribute('src', localStorage.getItem('url_redmine'));
    document.getElementById('jenkins_frame').setAttribute('src', localStorage.getItem('url_jenkins'));
    document.getElementById('sonar_frame').setAttribute('src', localStorage.getItem('url_sonar'));
});