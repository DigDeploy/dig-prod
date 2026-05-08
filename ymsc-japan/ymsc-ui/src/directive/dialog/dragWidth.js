/**
* v-dialogDragWidth ダイアログの幅をドラッグ調整（右辺）
* Copyright (c) 2019 ymsc
*/

export default {
    bind(el) {
        // ダイアログ要素を取得
        const dragDom = el.querySelector('.el-dialog');
        // ドラッグ調整用の要素（右辺）を作成
        const lineEl = document.createElement('div');
        // ドラッグ要素のスタイル設定：幅5px、背景継承、高さ80%、絶対位置、右辺配置、上下中央揃え、z-index1、カーソル形状（左右リサイズ）
        lineEl.style = 'width: 5px; background: inherit; height: 80%; position: absolute; right: 0; top: 0; bottom: 0; margin: auto; z-index: 1; cursor: w-resize;';
        
        // ドラッグ要素にマウス押下イベントを追加
        lineEl.addEventListener('mousedown',
            function (e) {
                // マウスを押下した時、現在の要素から表示領域までの距離を計算
                const disX = e.clientX - el.offsetLeft;
                // ダイアログの現在の幅を取得
                const curWidth = dragDom.offsetWidth;
                
                // マウスドラッグイベント
                document.onmousemove = function (e) {
                    e.preventDefault(); // 移動中にデフォルトイベントを無効化（不要な画面スクロール等を防ぐ）
                    // イベント委譲を通じて、移動距離を計算
                    const l = e.clientX - disX;
                    // ダイアログの幅を調整（初期値 + 移動距離）
                    dragDom.style.width = `${curWidth + l}px`;
                };
                
                // マウスを離したイベント
                document.onmouseup = function (e) {
                    // ドラッグ・マウス離しイベントを解除（メモリリーク防止）
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }, false);
        
        // ドラッグ調整用要素をダイアログに追加
        dragDom.appendChild(lineEl);
    }
}