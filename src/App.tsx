import React from 'react';
import Hobbies from './components/Hobbies';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './components/Hobbies';
import HobbyRecommendation from './components/HobbyRecommendation';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRoute from './components/AuthRoute';

function App() {

  return (
    <div className="App">
      <div className="App">
        <BrowserRouter>
          <Routes>

            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/recommendation" element={
              <ProtectedRoute>
                <HobbyRecommendation />
              </ProtectedRoute>
            } />
            <Route path="/login" element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
            />
            <Route path="/register" element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            } />
          </Routes>
          <BottomNav />

        </BrowserRouter>
      </div>
    </div>
  )

}
export default App
