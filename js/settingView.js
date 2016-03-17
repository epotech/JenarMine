$(function () {
    // 初期表示にlocalstorageから利用するサービス情報をロード
    $('.settingProp').each(function () {
        if ($(this).attr('type') == 'checkbox') {
            if(localStorage.getItem($(this).prop('id')) == 'true') {
                $(this).prop('checked', true);
            }
        } else {
            $(this).val(localStorage.getItem($(this).prop('id')));
        }
    });
    
    //useServiceにチェックが入っているサービスだけを対象に設定やタブを表示するようコントロール
    $('input[name=useService]:checked').each(function() {
        //alert($(this).val());
    });
    
    //設定プロパティはすべてonblur時にlocalStorageに格納
    $('.settingProp').each(function () {
        if ($(this).attr('type') == 'checkbox') {
            $(this).click(function () {
                localStorage.setItem($(this).prop('id'), $(this).prop('checked'));
            });
        } else {
            $(this).blur(function () {
                localStorage.setItem($(this).prop('id'), $(this).val());
            });
        }
    });
    
    document.getElementById('tab1_frame').setAttribute('src', localStorage.getItem('url_redmine'));
    document.getElementById('tab2_frame').setAttribute('src', localStorage.getItem('url_jenkins'));
    document.getElementById('tab3_frame').setAttribute('src', localStorage.getItem('url_sonar'));
});