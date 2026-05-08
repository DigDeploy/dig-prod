/**
* v-dialogDragWidth ダイアログの幅・高さをドラッグ調整（右下隅）
* Copyright (c) 2019 ymsc
*/

export default {
    bind(el) {
        // ダイアログ要素を取得
        const dragDom = el.querySelector('.el-dialog');
        // ドラッグ調整用の要素（右下隅）を作成
        const lineEl = document.createElement('div');
        // ドラッグ要素のスタイル設定：幅6px、背景継承、高さ10px、絶対位置、右下配置、z-index1、カーソル形状（斜めリサイズ）
        lineEl.style = 'width: 6px; background: inherit; height: 10px; position: absolute; right: 0; bottom: 0; margin: auto; z-index: 1; cursor: nwse-resize;';
        
        // ドラッグ要素にマウス押下イベントを追加
        lineEl.addEventListener('mousedown',
            function(e) {
                // マウスを押下した時、現在の要素から表示領域までの距離を計算
                const disX = e.clientX - el.offsetLeft;
                const disY = e.clientY - el.offsetTop;
                // ダイアログの現在の幅と高さを取得
                const curWidth = dragDom.offsetWidth;
                const curHeight = dragDom.offsetHeight;
                
                // マウスドラッグイベント
                document.onmousemove = function(e) {
                    e.preventDefault(); // 移動中にデフォルトイベントを無効化（不要な画面スクロール等を防ぐ）
                    // イベント委譲を通じて、移動距離を計算
                    const xl = e.clientX - disX;
                    const yl = e.clientY - disY;
                    // ダイアログの幅・高さを調整（初期値 + 移動距離）
                    dragDom.style.width = `${curWidth + xl}px`;
                    dragDom.style.height = `${curHeight + yl}px`;
                };
                
                // マウスを離したイベント
                document.onmouseup = function(e) {
                    // ドラッグ・マウス離しイベントを解除（メモリリーク防止）
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }, false);
        
        // ドラッグ調整用要素をダイアログに追加
        dragDom.appendChild(lineEl);
    }
}