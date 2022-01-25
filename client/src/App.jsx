import { Routes, Route, useNavigate } from 'react-router-dom';
import Social from './container/Social';
import Exchange from './container/Exchange';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Exchange />} />
      <Route path="/*" element={<Social />} /> {/* others path */}
    </Routes>
    
  )
}

export default App
