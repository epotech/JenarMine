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
            });
        } else {
            $(this).blur(function () {
                localStorage.setItem($(this).prop('id'), $(this).val());
            });
        }
    });

    //webviewのsrcを変更
    document.getElementById('tab1_frame').setAttribute('src', localStorage.getItem('url_redmine'));
    document.getElementById('tab2_frame').setAttribute('src', localStorage.getItem('url_jenkins'));
    document.getElementById('tab3_frame').setAttribute('src', localStorage.getItem('url_sonar'));
});
