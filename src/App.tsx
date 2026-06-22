import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Chamber } from './pages/Chamber'
import { Proposals } from './pages/Proposals'
import { Leaderboard } from './pages/Leaderboard'
import { History } from './pages/History'
import { AppLayout } from './components/layout/AppLayout'

/**
 * Root application component with React Router v6 routing.
 * Landing page at root, app interior pages nested under /app with AppLayout wrapper.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppLayout />}>
          <Route path="chamber" element={<Chamber />} />
          <Route path="proposals" element={<Proposals />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
