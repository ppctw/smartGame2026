# 🚂 夢想探索號列車 - Node.js 後端版本

使用 Node.js + Express + Socket.IO 實現即時多裝置同步的派對遊戲。

## 🏗️ 架構說明

### 前端（Next.js）
- **主控台**（`/`）：主持人操作介面
- **投影畫面**（`/game`）：投影給玩家觀看的地圖
- 使用 Socket.IO Client 連接後端

### 後端（Node.js）
- **Express**：HTTP 伺服器
- **Socket.IO**：WebSocket 即時通訊
- 儲存遊戲狀態並廣播給所有連接的客戶端

## 🚀 快速開始

### 1. 安裝依賴

```bash
# 安裝前端依賴
npm install

# 安裝後端依賴
cd server
npm install
cd ..
```

### 2. 設定環境變數

複製環境變數範例檔案：

```bash
cp .env.local.example .env.local
```

編輯 `.env.local`（開發環境通常不需要修改）：

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

### 3. 啟動開發環境

**方法一：同時啟動前後端**

```bash
npm run dev:all
```

**方法二：分別啟動**

終端機 1 - 啟動後端：
```bash
npm run dev:server
```

終端機 2 - 啟動前端：
```bash
npm run dev
```

### 4. 開啟遊戲

1. **主控台**：http://localhost:3000
2. **投影畫面**：http://localhost:3000/game

## 📡 API 說明

### HTTP Endpoints

- `GET /api/health` - 健康檢查
- `GET /api/game` - 獲取當前遊戲狀態

### Socket.IO Events

**客戶端發送：**
- `game:start` - 開始遊戲
- `game:update` - 更新遊戲狀態
- `game:reset` - 重置遊戲

**伺服器發送：**
- `game:state` - 廣播遊戲狀態更新

## 🌐 部署

### 部署到 Vercel（前端）

```bash
vercel
```

### 部署後端

後端可以部署到：
- **Render**
- **Railway**
- **Heroku**
- **自己的 VPS**

#### 部署到 Render

1. 在 Render 建立新的 Web Service
2. 連接你的 GitHub repository
3. 設定：
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: 
     - `PORT`: 3001（或 Render 自動分配）
     - `CLIENT_URL`: 你的前端網址

4. 更新前端的 `.env.local`：
```env
NEXT_PUBLIC_SERVER_URL=https://your-backend.onrender.com
```

## 🔧 開發腳本

```bash
# 前端開發
npm run dev

# 後端開發
npm run dev:server

# 同時啟動前後端
npm run dev:all

# 建置前端
npm run build

# 安裝後端依賴
npm run build:server

# 啟動正式環境（前端）
npm start

# 啟動正式環境（後端）
npm run start:server
```

## 📁 專案結構

```
smartkids_game/
├── app/                    # Next.js 前端
│   ├── page.tsx           # 主控台
│   ├── game/page.tsx      # 投影畫面
│   └── providers.tsx      # Context Provider
├── components/            # React 元件
├── contexts/              
│   └── GameContextSocket.tsx  # Socket.IO 狀態管理
├── server/                # Node.js 後端
│   ├── index.js          # Express + Socket.IO 伺服器
│   └── package.json      # 後端依賴
├── types/                # TypeScript 類型
├── data/                 # 遊戲資料
└── README_BACKEND.md     # 本文件
```

## 🔐 安全性建議

生產環境建議：

1. **CORS 設定**：限制允許的來源
2. **Rate Limiting**：防止 API 濫用
3. **驗證機制**：加入簡單的房間密碼
4. **HTTPS**：使用 SSL 加密連線

## 🐛 常見問題

### 無法連接到後端

1. 確認後端伺服器已啟動
2. 檢查 `.env.local` 中的 `NEXT_PUBLIC_SERVER_URL`
3. 查看瀏覽器 Console 的錯誤訊息

### 狀態不同步

1. 重新整理兩個頁面
2. 檢查後端 Console 是否有錯誤
3. 確認 Socket.IO 連接狀態

### 部署後無法連接

1. 確認後端 CORS 設定包含前端網址
2. 檢查環境變數是否正確設定
3. 確認防火牆允許 WebSocket 連接

## 📞 技術支援

如有問題，請檢查：
1. 後端 Console 日誌
2. 瀏覽器 DevTools Console
3. Network 標籤中的 WebSocket 連接狀態
