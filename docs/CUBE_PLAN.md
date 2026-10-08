# 魔術方塊 v1：一頁三端

單一網頁：電腦、Android、iOS 瀏覽器都能開。整顆旋轉、縮放。不必做 App。

全息是「手機／平板當畫面、A4 玻璃反射」。手勢呼叫同一組指令（轉、縮），不必重寫畫面。

## 立體感能到哪

- 做得到：真 3D 方塊。有遠近、光照。拖曳或手勢可轉到六面任何角度。
- 做不到（一片 A4 + 一般網頁）：人繞著玻璃走，影像不會自動換成背面。
- 以後才碰：繞走視角（四視角金字塔、光場螢幕、鏡頭追頭）。v1 不做。

v1 用簡單光照（環境光 + 一盞方向光），不加複雜陰影。

## 三端怎麼用

滑鼠或觸控 → 轉與縮指令 → Three.js 一顆方塊 → 手機或平板瀏覽器 → A4 玻璃反射。

- 開 github.io 網址即用
- 灰透玻璃要高對比：黑底、六面亮色
- 不做 Flutter / Unity / 三套原生 App

## 網址

- `github.com/leo700322/side_project`：原始碼頁，看不到 3D
- https://leo700322.github.io/side_project/ ：GitHub Pages，瀏覽器會跑程式
- https://leo700322.github.io/side_project/cube/ ：方塊頁

有網路就能開。沒網路不行（頁面會跟 CDN 載 Three.js）。

## 檔案

- `cube/index.html`：v1（CDN 引 Three.js，無 npm）
- 手勢在 `gesture/`，不改這頁的黑底畫面

## v1 範圍

只做：

- 一顆方塊，六面亮色且互異（白、黃、紅、橙、藍、綠）
- 簡單光照；拖曳整顆轉；滾輪或雙指縮放
- 黑底、方塊置中、少 UI
- `touch-action: none`，避免 iOS 把捏合當成網頁縮放
- 指令：`HoloCube.rotateBy(dx, dy)`、`HoloCube.setScale(s)`

不做：

- 轉單面、27 小塊、打亂／還原
- 四視角金字塔、繞走視角、光場／人頭追蹤
- App Store、套件建置

轉單面是 v2。
