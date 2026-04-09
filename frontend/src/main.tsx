import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// 导入你已经创建好的所有页面
import HomePage from './pages/HomePage';
import DifficultyPage from './pages/DifficultyPage';
import { GamePageRoute } from './pages/GamePage';
import { RevealPage } from './pages/RevealPage';
import DomesticComingSoonPage from './pages/DomesticComingSoonPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 首页：/ 路径 */}
        <Route path="/" element={<HomePage />} />
        {/* 难度选择页：/difficulty/:region */}
        <Route path="/difficulty/:region" element={<DifficultyPage />} />
        {/* 国内题库占位页 */}
        <Route path="/domestic-coming-soon" element={<DomesticComingSoonPage />} />
        {/* 游戏页：/game/:region/:difficulty/:storyId */}
        <Route path="/game/:region/:difficulty/:storyId" element={<GamePageRoute />} />
        {/* 汤底页：/reveal/:storyId */}
        <Route path="/reveal/:storyId" element={<RevealPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);