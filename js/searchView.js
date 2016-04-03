'use strict';

var searchView = (function() {
  var previousText = '';
  var activeIndex = '';
  var targetFrame;

  function setEvent() {
    //検索件数表示
    targetFrame.addEventListener("found-in-page", function(e) {
      var result = e.result;

      activeIndex = result.matches ? activeIndex : 0;
      if (result.activeMatchOrdinal) {
        // マッチした箇所を覚えておく
        activeIndex = result.activeMatchOrdinal;
      }
      if (result.finalUpdate) {
        // M個のマッチ中 N 番目がアクティブな時，N/M という文字列をつくる
        $(".search-count").text(`${activeIndex}/${result.matches}`)
      }
    });

    $(".search").on("click.searchFunc" ,function(){
      $(".search-panel").toggle(100);
    });

    $(".search-word").on("keyup.searchFunc", function(e) {
      if ($(this).val().length == 0) {
        $(".search-count").text("0/0");
        targetFrame.stopFindInPage('clearSelection');
        return;
      }
      search($(this).val(), true);
    });
    $(".search-next").on("click.searchFunc", function() {
      search(previousText, true);
    });
    $(".search-prev").on("click.searchFunc", function() {
      search(previousText, false);
    });
  }


  function search(text, isForward) {
    var option = {
      findNext: true,
      forward: isForward
    };
    if (previousText === text) {
      // 前回の検索時とテキストが変わっていないので次のマッチを検索
      targetFrame.findInPage(text, option);
    } else {
      // 検索開始
      previousText = text;
      targetFrame.findInPage(text);
    }
  }

  function setWebview(viewObj) {
    targetFrame = viewObj;
    clearSearch();
    // イベントを初期化する
    unbindAll();
    setEvent();
  }
  function unbindAll(){
    targetFrame.removeEventListener("found-in-page",function(){});
    $(".search,.search-word,.search-next,.search-prev").off(".searchFunc");
  }
  function clearSearch(){
    //画面表示を初期化する
    $(".search-word").val("");
    $(".search-count").text("0/0");
    // targetFrame.stopFindInPage('clearSelection');
  }

  //公開フィールド、メソッドを返す
  return {
    setWebview: setWebview
  };
})();
