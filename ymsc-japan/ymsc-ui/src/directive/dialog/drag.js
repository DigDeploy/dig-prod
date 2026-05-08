/**
* v-dialogDrag ダイアログドラッグ機能
* Copyright (c) 2019 ymsc
*/

export default {
  bind(el, binding, vnode, oldVnode) {
    const value = binding.value
    // 値がfalseの場合は処理を終了
    if (value == false) return
    // ドラッグ対象のヘッダー部分を取得
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');
    // ヘッダーのカーソルを「移動可」に設定
    dialogHeaderEl.style.cursor = 'move';
    
    // 元の属性を取得（IEはdom要素.currentStyle、Firefox/Chromeはwindow.getComputedStyle(dom要素, null)）
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
    // ドラッグ対象を絶対位置で配置
    dragDom.style.position = 'absolute';
    // 上マージンを0に設定
    dragDom.style.marginTop = 0;
    
    let width = dragDom.style.width;
    // 幅がパーセンテージで指定されている場合はピクセルに変換
    if (width.includes('%')) {
      width = +document.body.clientWidth * (+width.replace(/\%/g, '') / 100);
    } else {
      // 幅がピクセルで指定されている場合は単位を除去し数値化
      width = +width.replace(/\px/g, '');
    }
    // ドラッグ対象を画面中央に配置（左右方向）
    dragDom.style.left = `${(document.body.clientWidth - width) / 2}px`;
    
    // マウス押下イベント
    dialogHeaderEl.onmousedown = (e) => {
      // マウスを押下した時、現在の要素から表示領域までの距離を計算（マウスクリック位置から表示ウィンドウまでの距離）
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      // 取得した値からpx単位を正規表現で除去
      let styL, styT;

      // IEの場合：初回取得値はコンポーネント既定の50%のため、移動後にpx単位で上書き
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
      } else {
        // px単位を除去し数値化
        styL = +sty.left.replace(/\px/g, '');
        styT = +sty.top.replace(/\px/g, '');
      };

      // マウスドラッグイベント
      document.onmousemove = function (e) {
        // イベント委譲を通じて、移動距離を計算（ドラッグ開始から終了までの距離）
        const l = e.clientX - disX;
        const t = e.clientY - disY;

        let finallyL = l + styL
        let finallyT = t + styT

        // 現在の要素を移動
        dragDom.style.left = `${finallyL}px`;
        dragDom.style.top = `${finallyT}px`;

      };

      // マウスを離したイベント
      document.onmouseup = function (e) {
        // マウスドラッグ/離しイベントを解除
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  }
};