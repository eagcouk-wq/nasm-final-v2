import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 尋找網頁上的根節點
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// 啟動 React 應用程式
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
