- **狀態**：已完成 v1 原型（5 階段無痛闖關＋多邊形能力雷達圖＋三層弱點診斷 Dashboard＋全階段教材匯入中心）
- **檔案**：`easy_learn/index.html`、`easy_learn/app.js`、`easy_learn/data.js`、`easy_learn/styles.css`
- **下一件**：實測英文聽說（`reservation` 等）與國中三大版示範題 1–2 週，依實測回饋微調題型或擴充新單元

---

## 工具現況

| 模組 | 檔案 | 用途（對誰／驗或改了哪幾個動作） | 狀態 |
| :--- | :--- | :--- | :--- |
| 闖關主介面 | `index.html`、`styles.css` | 針對 ADHD 與自學者：提供 5 分鐘番茄鐘保護罩、5 階段闖關區、六角形能力雷達圖、三層式 Dashboard 切換 | 可直接開啟使用 |
| 核心流程引擎 | `app.js` | 實作「10 秒破冰 → 1 句重點與比喻 → 3 階梯練習（連錯 2 次啟動發散提示）→ 滿 80% 教 AI 學伴抓錯 → 1/3/7/14 天間隔複習」與 CSV/JSON 匯出入 | 已驗證語法與互動 |
| 課綱與範例庫 | `data.js` | 內建成人英文（`reservation`、`reschedule`）、Python 字典、國中／國小（康軒、翰林、南一）數學與自然範例、108 課綱骨架 | 預載 6 套完整關卡 |

## 怎麼開

1. **直接開（最快）**：用 Chrome 或 Edge 雙擊打開 `easy_learn/index.html`。
2. **區網給手機／平板開**：在 `easy_learn/` 資料夾下執行 `python3 -m http.server 8080`，再用瀏覽器開 `http://127.0.0.1:8080`。

