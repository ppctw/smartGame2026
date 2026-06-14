# 🚂 夢想探索號列車

一個適合多人實體派對的互動遊戲，主持人操作投影大螢幕，帶領 2～6 隊玩家一起前往夢夢車站的冒險旅程！

## 🎮 遊戲特色

- **雙螢幕設計**：主控台 + 投影畫面分離，專業派對體驗
- **多人派對遊戲**：支援 2～6 隊同時遊玩
- **16 格冒險地圖**：包含各種有趣的格子效果
- **互動式體驗**：站長指令需要玩家實際參與
- **精美動畫**：流暢的動畫效果與視覺回饋
- **即時同步**：主控台操作即時反映在投影畫面
- **科技感設計**：深藍色調配霓虹光效

## 📺 雙頁面架構

### 主控台（`/`）
- **用途**：主持人操作介面
- **功能**：
  - 設定隊伍名稱與數量
  - 擲骰子控制
  - 查看當前回合隊伍
  - 查看所有隊伍狀態
  - 開啟投影畫面按鈕
  - 重新開始遊戲
- **建議**：在主持人的筆電或平板上開啟

### 投影畫面（`/game`）
- **用途**：投影給所有玩家觀看
- **功能**：
  - 顯示 16 格環繞式地圖
  - 顯示各隊棋子位置
  - 顯示格子名稱與圖示
  - 自動同步主控台的操作
- **建議**：投影到大螢幕或電視上

### 狀態同步
- 使用 React Context API 實現跨頁面狀態共享
- 主控台的任何操作會即時反映在投影畫面
- 兩個頁面可以在不同瀏覽器視窗或裝置上開啟

## 🚀 快速開始

### 安裝依賴

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 開發模式

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

### 使用方式

1. **開啟主控台**：在瀏覽器訪問 [http://localhost:3000](http://localhost:3000)
2. **設定遊戲**：輸入隊伍名稱並選擇隊伍數量
3. **開啟投影畫面**：
   - 點擊主控台的「🖥️ 開啟投影畫面」按鈕
   - 或直接訪問 [http://localhost:3000/game](http://localhost:3000/game)
   - 將此視窗拖曳到投影螢幕並全螢幕顯示
4. **開始遊戲**：在主控台點擊「擲骰子」，投影畫面會自動更新

### 建置專案

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

### 啟動正式環境

```bash
npm run start
# 或
yarn start
# 或
pnpm start
```

## 📦 部署到 Vercel

### 方法一：使用 Vercel CLI

1. 安裝 Vercel CLI：
```bash
npm install -g vercel
```

2. 登入 Vercel：
```bash
vercel login
```

3. 部署專案：
```bash
vercel
```

4. 部署到正式環境：
```bash
vercel --prod
```

### 方法二：使用 Vercel Dashboard

1. 前往 [Vercel](https://vercel.com)
2. 點擊「Import Project」
3. 選擇你的 Git repository
4. Vercel 會自動偵測 Next.js 專案並進行部署

## 🎯 遊戲規則

### 目標
最先抵達第 16 格「夢夢車站」的隊伍獲勝！

### 格子類型

- 🏁 **起點**：思麥特車站
- ⚡ **加速格**：可以再擲一次骰子
- 🎁 **夢想補給包**：隨機前進 1、2 或 3 格
- 🚉 **車站**：補給站或站長指令
- ❓ **探險驚喜包**：50% 回起點 / 50% 前往第 9 格
- 🪨 **障礙格**：後退 2 格
- 🔧 **維修格**：跳過下一輪
- 🔄 **傳送格**：傳送到指定格子
- 🎉 **終點**：夢夢車站

### 特殊互動

- **第 9 格**：做出頭上大愛心動作！📸
- **第 12 格**：全隊一起腳踏地板！

## 🛠️ 技術架構

- **框架**：Next.js 14 (App Router)
- **語言**：TypeScript
- **樣式**：Tailwind CSS
- **字型**：Noto Sans TC (Google Fonts)
- **狀態管理**：React Hooks

## 📁 專案結構

```
smartkids_game/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根佈局（包含 GameProvider）
│   ├── page.tsx           # 主控台頁面（/）
│   ├── game/              # 投影畫面路由
│   │   └── page.tsx       # 投影畫面頁面（/game）
│   └── globals.css        # 全域樣式
├── components/            # React 元件
│   ├── GameBoard.tsx      # 遊戲地圖（環繞式佈局）
│   ├── ControlPanel.tsx   # 主控台面板
│   ├── DiceRoller.tsx     # 骰子元件
│   ├── TeamStatusPanel.tsx # 隊伍狀態面板
│   ├── EventModal.tsx     # 事件彈窗
│   ├── WinScreen.tsx      # 勝利畫面
│   └── SetupScreen.tsx    # 設定畫面
├── contexts/              # React Context
│   └── GameContext.tsx    # 遊戲狀態管理（跨頁面共享）
├── hooks/                 # 自訂 Hooks
│   └── useGame.ts         # 遊戲邏輯（已整合到 Context）
├── types/                 # TypeScript 類型定義
│   └── game.ts
├── data/                  # 遊戲資料
│   └── cells.ts           # 格子資料
└── public/                # 靜態資源
```

## 🎨 自訂設定

### 修改隊伍數量上限

編輯 `components/SetupScreen.tsx`：

```typescript
// 修改這一行來調整隊伍數量範圍
{[2, 3, 4, 5, 6].map((count) => (
```

### 修改格子內容

編輯 `data/cells.ts` 來自訂格子的名稱、描述、圖示和效果。

### 調整顏色主題

編輯 `tailwind.config.ts` 來修改主題顏色：

```typescript
colors: {
  'train-blue': '#1e3a8a',
  'train-orange': '#fb923c',
  'train-yellow': '#fbbf24',
}
```

## 📝 授權

此專案僅供教育和娛樂用途。

## 🤝 貢獻

歡迎提出問題和改進建議！

---

**祝你玩得開心！🎉**
