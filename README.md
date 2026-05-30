# 中央大學 生態與保育資訊網

**National Central University — Ecological and Conservation Information Website**

> 一個以「生態紀錄片」美學為設計核心的靜態前端網站，帶領中央大學師生探索校園內的動植物生態世界。

---

## 課程資訊

| 項目 | 內容 |
|------|------|
| 課程名稱 | 網頁程式設計 |
| 授課教授 | 施皇嘉 教授 |
| 學期 | 114 學年度下學期 |
| 學校 | 國立中央大學 |

### 組員

張循、彭靖淵、施竑宇

---

## 目錄

1. [課程資訊](#課程資訊)
2. [專案簡介](#專案簡介)
3. [功能總覽](#功能總覽)
4. [設計理念](#設計理念)
5. [技術棧](#技術棧)
6. [專案結構](#專案結構)
7. [頁面架構詳解](#頁面架構詳解)
8. [資料管理](#資料管理)
9. [CSS 設計系統](#css-設計系統)
10. [JavaScript 模組說明](#javascript-模組說明)
11. [本地預覽](#本地預覽)
12. [維護指南](#維護指南)
13. [物種清單](#物種清單)
14. [開發過程與挑戰](#開發過程與挑戰)
15. [課程技術對應](#課程技術對應)
16. [參考資料](#參考資料)

---

## 專案簡介

本專案為純靜態前端網站（HTML5 + CSS3 + Vanilla JavaScript），無需後端伺服器即可運行。  
網站提供中央大學校園的生物多樣性資訊，涵蓋：

- **17 種校園野生動物**（鳥類、哺乳類、爬蟲類、兩棲類、昆蟲）
- **10 種校園植物**（依季節與特性分類）
- **互動式物種地圖**（全螢幕沉浸式體驗）
- **資源中心**（三張沉浸式入口卡片，分別通往動物圖鑑、植物圖鑑、生態挑戰）
- **意見回饋表單**（串接 Google Apps Script）

整個網站採模組化設計：CSS / JS 完全拆分為獨立檔案，HTML 不含任何 inline 樣式或腳本，易於長期維護。

---

## 功能總覽

| 功能 | 入口頁面 | 說明 |
|------|----------|------|
| 首頁 Hero | `index.html` | 全螢幕電影感 Banner，含 CTA 按鈕 |
| 物種地圖入口 | `index.html` → 地圖區塊 | 說明地圖功能並跳轉 |
| 植物圖鑑入口 | `index.html` → 植物區塊 | 預覽 10 種植物並跳轉 |
| 動物圖鑑入口 | `index.html` → 動物區塊 | 預覽 17 種動物並跳轉 |
| 資源中心 | `index.html`（分頁） | 三張沉浸式卡片，分別連結動物圖鑑、植物圖鑑，及開啟生態挑戰任務 Modal |
| 參與我們 | `index.html`（分頁） | 回饋表單，送至 Google Sheets |
| 物種互動地圖 | `pages/wildlife-map.html` | 全螢幕地圖，點擊標記顯示物種側欄 |
| 植物圖鑑列表 | `pages/plants.html` | 植物卡片列表，含搜尋 / 分類篩選 |
| 植物詳情頁 | `pages/plant-detail.html?plant=樟樹` | 10 段式沉浸式植物介紹 |
| 動物圖鑑列表 | `pages/animals.html` | 動物卡片列表，含群組篩選、已探索紀錄 |
| 動物詳情頁 | `pages/species.html?species=magpie` | 多段式物種介紹（英雄圖、識別線索、生物檔案等） |

---

## 設計理念

### 視覺風格：生態紀錄片 × 玻璃擬態

整個網站以**深色生態基調（Dark Ecological）**為主題，模仿 National Geographic 紀錄片的視覺語言：

- **配色**：深林綠（`#040e06` 底色）+ 生態螢光綠（`#8fdf8f` 強調色）+ 暗金（`#ffd700`）
- **玻璃擬態（Glassmorphism）**：卡片、側欄、Modal 均使用 `backdrop-filter: blur()` 半透明效果
- **電影感 Hero**：每個主要頁面都有全螢幕背景照片，搭配多層漸層 Overlay
- **植物裝飾 SVG**：植物圖鑑頁以手繪風格葉片 SVG 作為裝飾元素
- **焦散光效（Bokeh）**：植物頁 Hero 以純 CSS 動畫模擬光斑效果

### 排版

- **中文字型**：`Noto Sans TC`（Google Fonts）+ `Microsoft JhengHei`（後備）
- **英文標題字型**：`Playfair Display`（植物相關頁面，帶有博物館手冊質感）
- 中英雙語並陳（每個主要標題均附英文對照）

### 使用者體驗

- **Loading Overlay**：每個頁面進入時顯示載入動畫，DOMContentLoaded 後淡出
- **Scroll Reveal**：`IntersectionObserver` 實現元素滾動入場動畫
- **已探索紀錄**：動物頁使用 `localStorage` 記錄使用者已點擊過的物種，顯示「已探索 N/17」
- **側邊章節導覽**：詳情頁右側有圓點式 Scroll Spy 導覽
- **鍵盤 / ARIA 無障礙**：`role`、`aria-label`、`aria-live` 覆蓋主要互動元素

---

## 技術棧

| 類別 | 技術 |
|------|------|
| 結構 | HTML5（語意標籤） |
| 樣式 | CSS3（Custom Properties、Flexbox、Grid、Glassmorphism） |
| 腳本 | Vanilla JavaScript（ES5 相容，無框架、無打包工具） |
| 字型 | Google Fonts（Noto Sans TC、Playfair Display） |
| 動畫 | CSS Transition / Animation + IntersectionObserver |
| 資料儲存 | 靜態 Markdown 檔（植物）/ JS 物件（動物）/ `localStorage`（探索紀錄） |
| 表單後端 | Google Apps Script（Google Sheets 接收） |
| 無依賴函式庫 | 完全無 jQuery、React、Vue 等外部 JS 函式庫 |

---

## 專案結構

```
NCU_WebsiteDesign_/
│
├── index.html                   # 主頁（首頁 / 資源中心 / 參與我們 三分頁）
├── README.md
│
├── pages/                       # 子頁面
│   ├── wildlife-map.html        # 互動式物種地圖（全螢幕，CSS inline）
│   ├── plants.html              # 植物圖鑑列表
│   ├── plant-detail.html        # 植物詳情（URL param: ?plant=樟樹）
│   ├── animals.html             # 動物圖鑑列表
│   └── species.html             # 動物詳情（URL param: ?species=magpie）
│
├── css/                         # 模組化樣式
│   ├── shared.css               # 全站 CSS 變數 / 基礎排版 / RWD 斷點
│   ├── navbar.css               # 頂部導覽列
│   ├── hero.css                 # 首頁 Hero 段落
│   ├── cards.css                # 通用卡片 / 清單 / 按鈕
│   ├── map.css                  # 地圖 Modal、地圖點位、側欄
│   ├── resources.css            # 資源中心與資源 Modal
│   ├── forms.css                # 回饋表單
│   ├── animations.css           # Scroll Reveal / 轉場動畫
│   ├── plants.css               # 植物圖鑑列表頁
│   ├── plant-detail.css         # 植物詳情頁（10 段式佈局）
│   ├── animals.css              # 動物圖鑑列表頁
│   └── species.css              # 動物詳情頁
│
├── js/                          # 模組化腳本
│   ├── main.js                  # 唯一 DOMContentLoaded 入口，依序呼叫各模組 init()
│   ├── navigation.js            # index.html 三分頁切換邏輯
│   ├── modal.js                 # 地圖 Modal / 資源 Modal / 物種側欄 開關與填充
│   ├── map.js                   # 地圖點位互動（讀取 data-species 屬性）
│   ├── resources.js             # 資源卡片 Modal 開關（讀取 data-resource-title / text）
│   ├── form.js                  # 表單驗證 + 送出至 Google Apps Script
│   ├── animations.js            # IntersectionObserver Scroll Reveal
│   ├── species-data.js          # 全站動物資料庫（JS 物件，17 種）
│   ├── plant-detail.js          # 植物詳情頁：讀取 .md 檔 → 解析 → 填入 10 個 section
│   ├── plant-images.js          # 植物圖片路徑解析（含 gallery、hero 圖）
│   ├── plants.js                # 植物列表頁：卡片渲染 + 搜尋 / 篩選
│   ├── species-page.js          # 動物詳情頁：從 species-data.js 讀資料並填入頁面
│   └── animals.js               # 動物列表頁：卡片渲染 + 群組篩選 + localStorage 探索紀錄
│
├── data/                        # 靜態資料檔（Markdown）
│   ├── plants/                  # 10 個植物 .md（每份含 Bloom Snapshot、Discovery Clues、Story 等段落）
│   │   ├── 樟樹.md
│   │   ├── 榕樹.md
│   │   └── ...（共 10 種）
│   └── species/                 # 17 個動物 .md（快速資訊、識別特徵、故事、棲地、生物檔案）
│       ├── 大冠鷲.md
│       ├── 臺灣藍鵲.md
│       └── ...（共 17 種）
│
├── assets/
│   ├── icons/                   # 網站 favicon 等圖示
│   └── images/
│       ├── background/          # 頁面背景大圖
│       ├── plants/              # 植物圖片（每種植物有獨立子資料夾）
│       │   ├── 樟樹/
│       │   ├── 榕樹/
│       │   └── ...
│       └── species/             # 動物照片（每種動物有獨立子資料夾）
│           ├── 臺灣藍鵲/
│           ├── 大冠鷲/
│           └── ...
│
└── _archive/                    # 舊版備份（不納入正式版本）
    ├── app.js
    ├── index.html.bak
    ├── map.html
    └── style.css
```

---

## 頁面架構詳解

### `index.html` — 主頁（三分頁 SPA）

採用**分頁切換模式**（非路由，純 CSS `display` 切換），共三個頁面：

#### 首頁（Home）
1. **全螢幕 Cinematic Hero**：背景大圖 + 多層漸層 Overlay + 標題 + CTA 按鈕
2. **地圖功能入口**：說明互動地圖，連結至 `wildlife-map.html`
3. **植物圖鑑入口**：季節標籤、植物預覽卡，連結至 `plants.html`
4. **動物圖鑑入口**：統計數字（17 種 / 6 群組），連結至 `animals.html`
5. **物種特寫卡片**：精選物種的大型視覺卡片

#### 資源中心（Resources）
- 三張全版沉浸式入口卡片（`.res-card`），各具背景照片與光暈效果
- **Card 01 — 校園野生動物探索圖鑑**：點擊跳轉至 `animals.html`
- **Card 02 — 校園植物探索圖鑑**：點擊跳轉至 `plants.html`
- **Card 03 — 生態挑戰任務基地**：點擊開啟 Modal，顯示互動生態遊戲說明
- 第三張卡片以 `data-resource-title` + `data-resource-text` 屬性驅動 Modal 內容

#### 參與我們（Join Us）
- 意見回饋表單：姓名、回饋類型（下拉）、詳細說明（至少 10 字）
- 送出至 Google Apps Script → 寫入 Google Sheets
- 含送出按鈕狀態回饋（loading / success / error）

---

### `pages/wildlife-map.html` — 互動式物種地圖

- **真全螢幕設計**：`html, body { width: 100vw; height: 100vh; overflow: hidden; }`
- 地圖以靜態圖片呈現，上面疊加 CSS 定位的圓點標記（`.spot` 元素）
- 標記點擊後，右側滑出物種資訊側欄（`transform: translateX`）
- 側欄內容從 `species-data.js` 讀取
- 標記位置由 `css/map.css` 中的 `.spot--*` class 控制（不用 inline style）
- 可按 `Esc` 或點「×」關閉側欄

---

### `pages/plants.html` — 植物圖鑑列表

- 全頁植物探索風格，頂部 Hero + 漂浮葉片 Canvas 動畫
- 卡片網格顯示 10 種植物，每張卡片含：植物名、英文名、系列標籤
- 支援**搜尋**（即時過濾）與**分類篩選**（Spring Bloom / Seasonal Signature / Campus Landmark / Evergreen）
- 點擊卡片跳轉至 `plant-detail.html?plant=植物名`

---

### `pages/plant-detail.html` — 植物詳情（10 段式）

URL 參數：`?plant=樟樹`

`plant-detail.js` 透過 `fetch()` 讀取對應的 `data/plants/樟樹.md`，解析 Markdown 後填入 10 個 section：

| 段落 | 內容 |
|------|------|
| S1 Hero | 全螢幕背景圖 + 植物名稱 / 英文名 / 系列標籤 |
| S2 Bloom Snapshot | 快速資訊表格（常見度、花期、觀察難度、熱點） |
| S3 Discovery Clues | 辨識特徵清單 |
| S4 Story | 植物生態故事文章 |
| S5 Viewing Calendar | 月份觀賞推薦度表 |
| S6 Where to Find | 校園觀察熱點地圖文字說明 |
| S7 Botanical Passport | 生物分類資訊（學名、科屬、原生地等） |
| S8 Ecological Challenges | 威脅因素與保育挑戰 |
| S9 How You Can Help | 可參與的保育行動 |
| S10 Explore More | 推薦其他植物 |

右側有圓點式**章節導覽（Scroll Spy）**，隨滾動自動高亮當前段落。

---

### `pages/animals.html` — 動物圖鑑列表

- 統計數字 Hero：17 種記錄物種 / 6 生態群組 / 已探索 N 種
- **群組篩選 Chips**：全部 / 森林鳥類 / 猛禽 / 地棲動物 / 爬蟲兩棲 / 水域相關 / 校園代表
- 卡片含角色稱號（`characterTitle`）、常見度星星、活動時間、觀察難度
- 已點擊過的物種在 `localStorage` 記錄，卡片右上角顯示「已探索」徽章
- 點擊卡片跳轉至 `species.html?species=物種key`

---

### `pages/species.html` — 動物詳情

URL 參數：`?species=magpie`

`species-page.js` 從 `species-data.js` 讀取物種資料，填入：
- Hero：背景圖 + 標籤徽章 + 角色稱號 + 中英文名 + 學名 + 故事預覽
- 辨識線索（idClues）
- 生態故事（story）
- 觀察熱點（hotspot）
- 生物檔案（分類、學名、食性等）
- 照片 Gallery

右側有**章節導覽圓點**，並在頂部導覽列顯示「已探索 N/17」進度。

---

## 資料管理

### 動物資料：`js/species-data.js`

以 JavaScript 物件集中管理，key 為 camelCase 英文識別碼：

```js
const animals = {
    magpie: {
        name: '臺灣藍鵲',
        englishName: 'Taiwan Blue Magpie',
        category: 'animal',
        group: 'forest',           // 主群組
        groups: ['forest', 'icon'], // 可多群組
        characterTitle: '校園的藍色傳奇',
        avatar: 'assets/images/台灣藍鵲.jpg',
        photos: [ '...1.jpg', '...2.jpg', '...3.jpg' ],
        commonness: 4,             // 常見度 1–5
        activityTime: '白天',
        difficulty: 2,             // 觀察難度 1–5
        hotspot: '校園大樹群、溪邊綠廊',
        story: '...',
        idClues: ['...', '...'],
        scientific: 'Urocissa caerulea',
        classification: '鳥綱 Aves／...',
        dist: '<ul>...</ul>',      // HTML 字串
        threats: '<ul>...</ul>',
        conservation: '<ul>...</ul>'
    },
    // ...16 種其他動物
};
```

### 植物資料：`data/plants/*.md`

每種植物一個 Markdown 檔，以固定段落結構撰寫：

```
# 🌳 植物名稱
### Character Title（英文副標）

🏷️ 標籤1 ｜ 標籤2 ｜ 標籤3

---
## 🌿 Bloom Snapshot
| 項目 | 內容 |
...

## 👀 Discovery Clues
- 特徵1
...

## 📖 The Story Behind the Tree
文章內容...

## 📅 Viewing Calendar
月份評分表...

## 📍 Where to Spot It
熱點說明...

## 🔬 Botanical Passport
分類資訊表格...

## ⚠️ Ecological Challenges
威脅清單...

## 🤝 How You Can Help
行動清單...
```

`plant-detail.js` 內建 Markdown 解析器（pure JS，無外部套件），能解析：表格、清單、標題、星星評分（`★★★★☆` → HTML render）。

### 圖片命名規範

```
assets/images/plants/植物名/  → 由 plant-images.js 自動掃描
assets/images/species/動物名/ → 路徑直接寫在 species-data.js 的 photos 陣列
```

---

## CSS 設計系統

### 全站 CSS 變數（定義於 `css/shared.css`）

```css
:root {
    /* 主色 */
    --color-primary-dark:  #1f3f2b;
    --color-primary:       #2e5b2e;
    --color-eco-green:     #8fdf8f;  /* 主強調色 */

    /* 透明度疊加層 */
    --overlay-dark:        rgba(31, 63, 43, 0.35);
    --overlay-darker:      rgba(31, 63, 43, 0.5);

    /* 邊框 */
    --border-eco:          rgba(143, 223, 143, 0.2);
    --border-eco-active:   rgba(143, 223, 143, 0.35);

    /* 文字 */
    --text-primary:        #e8f5e9;
    --text-accent:         #b8dbb8;

    /* 玻璃效果 */
    --glass-blur:          blur(12px);
    --glass-blur-lg:       blur(16px);
}
```

### RWD 斷點

| 名稱 | 寬度 |
|------|------|
| Desktop | ≥ 1024px |
| Tablet | 768px – 1023px |
| Mobile | < 768px |
| Small Mobile | < 480px |

### CSS 命名慣例

各頁面使用**專屬前綴**避免樣式污染：

| 前綴 | 頁面 |
|------|------|
| `hp-` | index.html 首頁段落 |
| `pe-` | plants.html 植物列表 |
| `pd-` | plant-detail.html 植物詳情 |
| `aw-` | animals.html 動物列表 |
| `sp-` | species.html 動物詳情 |

---

## JavaScript 模組說明

### 初始化模式

`index.html` 唯一進入點：`js/main.js`

```js
// 所有模組只在 DOMContentLoaded 後初始化一次
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initModals();
    initMap();
    initResources();
    initForm();
    initAnimations();
    hideLoadingOverlay();
});
```

- 每個模組以 `window.init*` 函式導出（不自動執行，避免重複綁定）
- `data-*` 屬性驅動互動：HTML 不含 inline `onclick` / `onsubmit`

### 地圖互動模式（`map.js`）

```html
<!-- HTML 宣告點位 -->
<div class="spot spot--magpie" data-species="magpie"></div>
```

```css
/* CSS 控制位置 */
.spot--magpie { top: 42%; left: 58%; }
```

```js
// JS 事件委派，讀取 data-species 後查 species-data.js
spot.addEventListener('click', () => openSidePanel(species));
```

### 植物詳情資料流（`plant-detail.js`）

```
URL ?plant=樟樹
  → fetch('data/plants/樟樹.md')
  → parseMarkdown(text)         // 解析表格 / 清單 / 標題
  → populateSections(data)      // 填入 10 個 section
  → initScrollSpy()             // 啟動右側導覽點高亮
```

---

## 本地預覽

直接以瀏覽器開啟 `index.html` 即可（無需伺服器）。

> ⚠️ **注意**：`plant-detail.js` 透過 `fetch()` 讀取 `.md` 檔。部分瀏覽器在 `file://` 協定下會封鎖 `fetch`。  
> 建議使用 VS Code 的 **Live Server** 擴充套件或任何本地 HTTP 伺服器：
> ```
> # Python 3
> python -m http.server 8080
> ```
> 然後開啟 `http://localhost:8080`

---

## 維護指南

### 新增動物物種

1. 在 `js/species-data.js` 的 `animals` 物件中新增一個 key（camelCase 英文）
2. 依 schema 填寫所有欄位（name、englishName、group、groups、characterTitle、photos、story、idClues、scientific、classification、dist、threats、conservation…）
3. 將對應照片放入 `assets/images/species/物種中文名/`
4. 若要在地圖上顯示：在 `pages/wildlife-map.html` 加入 `.spot` 元素，在 `css/map.css` 加入 `.spot--key` 設定位置

### 新增植物

1. 在 `data/plants/` 新增 `植物名.md`，依照現有 Markdown 結構填寫
2. 將圖片放入 `assets/images/plants/植物名/`
3. 在 `js/plant-detail.js` 的 `PLANT_COLLECTION` 物件中登錄（指定所屬系列）
4. 在 `pages/plants.html` 或 `js/plants.js` 的植物清單中加入該植物

### 修改地圖標記位置

只需修改 `css/map.css` 中對應的 `.spot--*` 定位：

```css
.spot--magpie {
    top: 42%;
    left: 58%;
}
```

### 新增資源中心卡片

在 `index.html` 的 `.res-gateway` 區塊新增一個 `<article class="res-card">` 元素，並設定：
- `data-resource-title`
- `data-resource-text`

若要直接跳轉頁面（如前兩張卡片），改用 `onclick="location.href='...'"` 即可。

### 修改表單送出目標

在 `js/form.js` 修改 Google Apps Script URL：

```js
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
```

---

## 物種清單

### 動物（17 種）

| 中文名 | 英文名 | 類群 | JS Key |
|--------|--------|------|--------|
| 赤腹松鼠 | Pallas's Squirrel | 哺乳類 | `squirrel` |
| 臺灣藍鵲 | Taiwan Blue Magpie | 鳥類 | `magpie` |
| 大冠鷲 | Crested Serpent Eagle | 猛禽 | `serpentEagle` |
| 黑冠麻鷺 | Malayan Night Heron | 鳥類 | `heron` |
| 五色鳥 | Taiwan Barbet | 鳥類 | `barbet` |
| 大卷尾 | Black Drongo | 鳥類 | `drongo` |
| 小彎嘴 | Taiwan Scimitar Babbler | 鳥類 | `babbler` |
| 紅尾伯勞 | Brown Shrike | 鳥類 | `shrike` |
| 鳳頭蒼鷹 | Crested Goshawk | 猛禽 | `goshawk` |
| 松雀鷹 | Besra | 猛禽 | `sparrowhawk` |
| 野鴿 | Rock Dove | 鳥類 | `dove` |
| 紅隼 | Common Kestrel | 猛禽 | `kestrel` |
| 草花蛇 | Checkered Keelback | 爬蟲類 | `snake` |
| 斯文豪氏攀蜥 | Swinhoe's Japalura | 爬蟲類 | `lizard` |
| 澤蛙 | Zhoushan Rice Frog | 兩棲類 | `frog` |
| 霜白蜻蜓 | Marsh Glider | 昆蟲 | `dragonfly` |
| 領角鴞 | Collared Scops Owl | 鳥類（夜行） | `owl` |

### 植物（10 種）

| 中文名 | 系列 | 特色 |
|--------|------|------|
| 櫻花 | Spring Bloom | 春季花景地標 |
| 白千層 | Spring Bloom | 剝皮紋路、精油香氣 |
| 木棉 | Seasonal Signature | 火紅花朵、棉絮飄飛 |
| 小葉欖仁 | Seasonal Signature | 層層分枝、秋季落葉 |
| 榕樹 | Campus Landmark | 鬚根下垂、遮蔭巨木 |
| 樟樹 | Campus Landmark | 樟腦香氣、百年老樹 |
| 黑板樹 | Campus Landmark | 高聳筆直、乳汁有毒 |
| 台灣肖楠 | Evergreen Year-round | 台灣珍貴原生針葉樹 |
| 龍柏 | Evergreen Year-round | 扭旋枝條、四季翠綠 |
| 相思樹 | Evergreen Year-round | 黃色球狀花、固氮植物 |

---

## 開發過程與挑戰

### 開發時程

| 階段 | 工作項目 |
|------|----------|
| 第一週 | 確認主題（校園生態）、蒐集物種資料、規劃網站地圖與頁面結構 |
| 第二週 | 建立 `index.html` 基本架構、導覽列、Hero 區塊，並完成 CSS 設計系統 |
| 第三週 | 完成首頁三分頁（資源中心、參與我們）、表單驗證與 Google Apps Script 串接 |
| 第四週 | 開發互動式地圖頁（wildlife-map.html）、植物 / 動物列表頁 |
| 第五週 | 開發植物詳情頁（Markdown 解析器）與動物詳情頁（多段式佈局） |
| 第六週 | 整合測試、RWD 調整、無障礙（ARIA）補強、README 撰寫 |

### 主要挑戰與解決方式

**1. 純前端讀取 Markdown 資料**  
植物詳情頁需在不依賴任何套件的情況下讀取 `.md` 檔並轉為頁面內容。  
→ 在 `plant-detail.js` 中手寫 Markdown 解析器，支援表格、清單、標題、星星評分語法，以 `fetch()` 讀取後直接 DOM 操作填入。

**2. 模組初始化衝突**  
多個 JS 檔各自監聽 `DOMContentLoaded` 導致事件重複綁定。  
→ 統一由 `main.js` 作為唯一入口，所有模組改為匯出 `window.init*()` 函式，在 `DOMContentLoaded` 後依序呼叫。

**3. 地圖標記定位維護困難**  
最初以 inline style 設定地圖圓點位置，難以批次修改。  
→ 改為每個標記加上 `.spot--物種key` class，所有座標集中在 `css/map.css` 管理。

**4. 跨頁面樣式命名衝突**  
多個獨立頁面（植物列表、植物詳情、動物列表、動物詳情）的 CSS class 名稱容易撞名。  
→ 採用頁面前綴命名慣例（`pe-`、`pd-`、`aw-`、`sp-`），各頁 CSS 完全獨立。

**5. `file://` 協定的 fetch 跨域問題**  
直接點開 HTML 檔時，瀏覽器封鎖 `fetch()` 讀取本地 `.md` 檔。  
→ 說明需使用本地 HTTP 伺服器（VS Code Live Server 或 Python http.server）預覽。

---

## 課程技術對應

本專案實作並展示課程中涵蓋的核心網頁技術：

| 課程主題 | 本專案對應實作 |
|----------|----------------|
| **HTML5 語意標籤** | `<nav>`、`<section>`、`<header>`、`<article>`、`<figure>` 貫穿所有頁面 |
| **CSS3 佈局** | Flexbox（導覽列、卡片行）/ Grid（卡片網格、雙欄佈局） |
| **CSS 自訂屬性** | `css/shared.css` 定義 30+ CSS 變數，全站統一色彩、間距、玻璃效果 |
| **RWD 響應式設計** | 三個斷點（1024px / 768px / 480px），所有頁面支援手機瀏覽 |
| **CSS 動畫與轉場** | `@keyframes` 載入動畫、`transition` 側欄滑入、`animation` 浮葉效果 |
| **DOM 操作** | 動態產生物種卡片、填充詳情頁面各段落、即時篩選與搜尋 |
| **事件處理** | 點擊（卡片、地圖標記）、表單送出、滾動監聽（Scroll Spy）|
| **非同步 JavaScript** | `fetch()` + `async/await` 讀取 Markdown 資料檔 |
| **Web Storage API** | `localStorage` 記錄使用者已探索的動物物種 |
| **Intersection Observer API** | Scroll Reveal 入場動畫、詳情頁章節導覽高亮 |
| **表單驗證** | 前端輸入驗證（必填、最低字數）+ 狀態回饋（loading / success / error）|
| **第三方服務串接** | Google Apps Script（表單送出 → 寫入 Google Sheets）|
| **無障礙設計** | `role`、`aria-label`、`aria-live`、`aria-hidden` 遵循 WAI-ARIA 標準 |

---

## 參考資料

- [MDN Web Docs — HTML / CSS / JavaScript 參考文件](https://developer.mozilla.org/)
- [Google Fonts — Noto Sans TC / Playfair Display](https://fonts.google.com/)
- [MDN — Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [MDN — Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Google Apps Script 官方文件](https://developers.google.com/apps-script)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- 物種資料來源：臺灣生物多樣性資訊入口網（TaiBIF）、臺灣野鳥手繪圖鑑、臺灣植物誌
- 校園地圖底圖：國立中央大學校園平面圖

---

**課程**：網頁程式設計｜**教授**：施皇嘉｜**學期**：114 學年度下學期  
**最後更新**：2026-05-30
