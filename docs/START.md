# 換電腦怎麼開

不裝 App、不裝 MediaPipe。有 Chrome、有網路就能開。Windows、Mac、Linux 步驟相同。

原始碼頁 https://github.com/leo700322/side_project 只看得到檔案，**看不到 3D、也沒有鏡頭**。一定要用下面的 github.io。

## 30 秒：選一個網址

- 看方塊、拖轉、對玻璃（電腦／手機／平板）：https://leo700322.github.io/side_project/cube/
- USB 鏡頭手勢（插 Webcam 的電腦，用 Chrome）：https://leo700322.github.io/side_project/gesture/

手勢頁一定要用 **https**（上面這個）或 **localhost**。不要下載 HTML 再雙擊開啟。

## A. 只要看方塊（手機／平板／任何電腦）

1. 瀏覽器打開 https://leo700322.github.io/side_project/cube/
2. 全螢幕。拖曳旋轉；滾輪或雙指縮放。
3. 對玻璃時螢幕朝下、畫面朝玻璃。黑底才看得到反射。

不需要鏡頭。

## B. 手勢（Windows 或其他電腦 + USB Webcam）

準備：Chrome（優先；Edge 多半可以）、USB Webcam、網路（要載模型）。Firefox 不建議。

### 1. 接鏡頭

把 Webcam 插上。Windows 若問「要允許這個裝置嗎」，允許。

Windows 若 Chrome 看不到鏡頭：

1. 設定 → 隱私權與安全性 → 相機
2. 「相機存取權」開
3. 「桌面應用程式」開（或允許 Google Chrome）

### 2. 開頁

Chrome 打開：

https://leo700322.github.io/side_project/gesture/

網址列右側允許「相機」。狀態應從「載入手勢模型」變成「沒看到手」或「ROI 外」。左上角出現鏡頭畫面。

### 3. 選對鏡頭、把手轉正

1. 「鏡頭」下拉選 USB 那顆，不要選筆電內建（內建常對到臉）。
2. 「旋轉」試 0 / 90 / 180 / 270，直到預覽裡的手是正的。鏡頭若裝置上方朝左，多半是 90° 或 270°。
3. 畫面左右反了就勾「鏡像」。

### 4. 框出偵測區

在左上預覽裡拖出紫色框，對準手會出現的位置（實體裝置的紫槽）。可拖角落改大小。框會記在這個瀏覽器，換電腦要再畫一次。

### 5. 動手

- 手伸進紫色框：揮手轉方塊，拇指食指捏合縮放。
- 手離開框：方塊停下，不會重設。
- 狀態「手在 ROI」才會轉；「ROI 外」「沒看到手」不該轉。
- 調好可取消「除錯」，預覽會藏起來。

槽太暗會抓不到手，加一盞小燈。

## 本機開（沒有 github.io、或你改了檔要先試）

仍需要網路（頁面會載 Three.js 與 MediaPipe）。在專案資料夾開終端機：

Windows（已安裝 Python）：

```text
py -m http.server 8080
```

若 `py` 無效，改打 `python -m http.server 8080`。

Mac / Linux：

```text
python3 -m http.server 8080
```

瀏覽器開 `http://127.0.0.1:8080/gesture/` 或 `http://127.0.0.1:8080/cube/`。

這台電腦的 `127.0.0.1` 只有這台自己打得開。別的電腦要改用 github.io，或在同一 Wi‑Fi 用這台的區網 IP（例：`http://192.168.x.x:8080/gesture/`）。

沒裝 Python：Windows 可安裝 [Python](https://www.python.org/downloads/)，安裝時勾 Add python.exe to PATH。只是要玩、沒改程式，用上面的 github.io 即可，不必裝。

## 打不開時

- 看到 GitHub 檔案列表、沒有方塊：開錯成 github.com，改 github.io。
- 鏡頭按鈕是叉、或一直「啟動中」：改 Chrome、允許相機、不要用 `file://`。
- 下拉沒有 USB 鏡頭：查 Windows 相機權限；拔插 USB；關掉其他正在用鏡頭的軟體（Teams、Camera 應用程式）。
- 模型載不下來、紅字 MediaPipe：網路擋了 cdn.jsdelivr.net 或 storage.googleapis.com，換網路或手機熱點。
- 有手卻不轉：手要在紫色框內；先開「除錯」看骨架在不在框裡。
- 方塊頁可以、手勢頁不行：手勢比方塊多要鏡頭和模型，對一下上面三條。

這一輪：手勢只在「插著 Webcam 的那台電腦」驗證。平板當全息畫面開 `cube/` 即可，還不用跟電腦互傳。
