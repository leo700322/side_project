# Holo Cube

手機或電腦瀏覽器打開方塊：拖曳旋轉，滾輪或雙指縮放。六面顏色不同（白、黃、紅、橙、藍、綠）。黑底，方便對玻璃看反射。

## 怎麼開

請用這個網頁網址（不是 github.com 的原始碼頁）：

https://leo700322.github.io/side_project/

或：

https://leo700322.github.io/side_project/cube/

手勢頁（電腦 Chrome + USB 鏡頭）：

https://leo700322.github.io/side_project/gesture/

本機請用 localhost 開（`file://` 沒有鏡頭權限）。在專案資料夾執行 `python3 -m http.server 8080`，再打開 `http://127.0.0.1:8080/gesture/`。

## 現況（v1）

- 整顆方塊可轉、可縮放
- 還沒做轉單面
- 人繞著玻璃走，畫面不會自動換成背面

`cube/` 仍是給玻璃反射的乾淨畫面。手勢在 `gesture/`，呼叫同一組 `HoloCube.rotateBy` 與 `setScale`。

## 手勢頁怎麼用（電腦驗證）

1. Chrome 允許鏡頭，下拉選 USB Webcam（不要選筆電內建）。
2. 用「旋轉／鏡像」把手轉正（鏡頭若上方朝左，多半要 90° 或 270°）。
3. 在預覽上拖出紫色框，對準手會出現的槽。
4. 手伸進框：揮手轉方塊、捏合縮放。手離開框，方塊停下。
5. 調好後可關掉「除錯」。框會記在這個瀏覽器裡。

規劃：`docs/CUBE_PLAN.md`、`docs/GESTURE_PLAN.md`。這一輪不接平板、兩台不互傳。
