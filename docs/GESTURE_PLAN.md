# 手勢 ROI：電腦先驗證

單一網頁：電腦 Chrome 開頁 → USB Webcam → 只處理紫色槽 ROI 裡的手 → 呼叫 `HoloCube.rotateBy` / `setScale`。

現有 `cube/index.html` 給玻璃反射用，不加鏡頭預覽。手勢在 `gesture/index.html`。

這一輪只在電腦驗證。平板當全息畫面、兩台互傳，先不做。

## 條件

- USB Webcam 在裝置紫色位置，鏡頭裝置上方朝左
- Webcam 插電腦
- 手勢：ROI 內揮手轉、捏合縮放（同一隻手可同時做）

## 需要的環境

- 電腦 Chrome（Firefox 的 MediaPipe WASM 不穩）
- USB 鏡頭在 Chrome 選得到
- localhost 或 github.io（鏡頭要 https 或本機）
- 紫槽要夠亮；太暗會抓不到手

## 資料流

USB Webcam → 旋轉／鏡像後的畫面 → 只認紫色 ROI 內的手 → 掌心移動轉方塊、拇指食指距離縮放。

ROI 外的手、觀眾身體：不轉方塊。

## 頁面行為

- 下拉選 USB 鏡頭（不要選到筆電內建）
- 畫面可轉 0／90／180／270 + 鏡像（對「上方朝左」）
- 可拖的矩形 ROI，存在瀏覽器 localStorage
- MediaPipe Hand Landmarker（21 點）
- 除錯層可關：骨架、ROI 框、狀態文字

手離開 ROI 就停，不把方塊重設。

## 這一輪不做

- 不改 `cube/index.html`
- 不接平板、兩台互傳
- 不寫 Python／OpenCV
- 不自訓手勢、不轉單面

## 怎麼驗（電腦 Chrome）

1. 開 `gesture/`，允許鏡頭，選 USB 那顆。
2. 轉畫面到手是正的；把 ROI 框到紫槽那塊。
3. 手伸進 ROI：揮手方塊轉、捏合縮放。
4. 手離開 ROI、或鏡頭裡只有人臉／另一隻手：方塊不動。
