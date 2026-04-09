import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DifficultyPage from '../pages/DifficultyPage'
import DomesticComingSoonPage from '../pages/DomesticComingSoonPage'
import { GamePageRoute } from '../pages/GamePage'
import HomePage from '../pages/HomePage'
import { RevealPage } from '../pages/RevealPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/difficulty/:region' element={<DifficultyPage />} />
        <Route path='/domestic-coming-soon' element={<DomesticComingSoonPage />} />
        <Route path='/game/:region/:difficulty/:storyId' element={<GamePageRoute />} />
        <Route path='/reveal/:storyId' element={<RevealPage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}
