# 夢想探索號列車 - 後端伺服器

Node.js + Express + Socket.IO 後端伺服器

## 安裝

```bash
npm install
```

## 開發

```bash
npm run dev
```

## 正式環境

```bash
npm start
```

## 環境變數

- `PORT`: 伺服器埠號（預設 3001）
- `CLIENT_URL`: 允許的前端網址（CORS 設定）

## API

### HTTP
- `GET /api/health` - 健康檢查
- `GET /api/game` - 獲取遊戲狀態

### Socket.IO Events
- `game:start` - 開始遊戲
- `game:update` - 更新狀態
- `game:reset` - 重置遊戲
- `game:state` - 狀態廣播（伺服器發送）
