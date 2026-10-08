# Holo Cube

瀏覽器打開方塊：拖曳旋轉，滾輪或雙指縮放。六面顏色不同（白、黃、紅、橙、藍、綠）。黑底，方便對玻璃看反射。

**換電腦請看 [docs/START.md](docs/START.md)**（Windows / Mac / Linux / 手機步驟都在那份）。

## 怎麼開

請用網頁網址（不是 github.com 的原始碼頁）：

- 方塊：https://leo700322.github.io/side_project/cube/
- 手勢（電腦 Chrome + USB 鏡頭）：https://leo700322.github.io/side_project/gesture/

不要雙擊 HTML。鏡頭一定要 https 或 localhost。

## 現況（v1）

- 整顆方塊可轉、可縮放
- 還沒做轉單面
- 人繞著玻璃走，畫面不會自動換成背面

`cube/` 是給玻璃反射的乾淨畫面。手勢在 `gesture/`，呼叫同一組 `HoloCube.rotateBy` 與 `setScale`。

規劃：`docs/CUBE_PLAN.md`、`docs/GESTURE_PLAN.md`。這一輪不接平板、兩台不互傳。
