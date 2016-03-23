//スイッチボタンでONになっているサービスのみを表示するようにするメソッド
function useServiceChange() {
    $('[name="useService"]').each(function () {
        console.info($(this).bootstrapSwitch('state'));
        if ($(this).bootstrapSwitch('state')) {
            $('.' + $(this).prop('id').split('useService_')[1] + '-group').css('display', 'block');
        } else {
            $('.' + $(this).prop('id').split('useService_')[1] + '-group').css('display', 'none');
        }
    });
}

$(function () {
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
                localStorage.setItem($(this).prop('id'), $(this).val());
            });
        }
    });
    
    //利用しないサービスは非表示にする
    useServiceChange();

    //webviewのsrcを変更
    document.getElementById('redmine_frame').setAttribute('src', localStorage.getItem('url_redmine'));
    document.getElementById('jenkins_frame').setAttribute('src', localStorage.getItem('url_jenkins'));
    document.getElementById('sonar_frame').setAttribute('src', localStorage.getItem('url_sonar'));
});