import React from 'react';
import Hobbies from './components/Hobbies';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './components/Hobbies';
import HobbyRecommendation from './components/HobbyRecommendation';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommendation" element={<HobbyRecommendation />} />
        </Routes>
        <BottomNav />

      </BrowserRouter>
    </div>
  )

}
export default App
