import React from 'react';
import Hobbies from './components/Hobbies';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './components/Hobbies';
import HobbyRecommendation from './components/HobbyRecommendation';
import Login from './components/Login';
import Register from './components/Register';

function App() {

  return (
    <div className="App">
      <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommendation" element={<HobbyRecommendation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <BottomNav />

      </BrowserRouter>
      </div>
    </div>
  )

}
export default App
