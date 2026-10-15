# Squash Trainer

壁球 T 點墊步與 Ghosting 訓練器，使用 Vue 3、Vite 與 Tailwind CSS 建置。

## Development

```sh
npm install
npm run dev
```

建立 production build 並在本機預覽：

```sh
npm run build
npm run preview
```

## Project Structure

- `src/App.vue`: 頁面組成與頂層互動狀態
- `src/components/`: 球場、訓練設定與動作指南元件
- `src/composables/useTraining.js`: 訓練流程、計時器與音效
- `src/data/corners.js`: 球場目標點與訓練模式資料
- `src/style.css`: Tailwind 匯入與球場專屬樣式

新增訓練模式可從 `src/data/corners.js` 加入模式定義，並在 `useTraining.js` 補上對應節奏策略；新增介面區塊則放在獨立元件中。

## GitHub Pages

Vite 的 base path 已設為 `/squash-trainer/`。推送至 `main` 後，`.github/workflows/deploy.yml` 會自動建置並部署 `dist`。首次啟用時，請在 GitHub repository 的 **Settings → Pages → Build and deployment** 將來源設為 **GitHub Actions**。