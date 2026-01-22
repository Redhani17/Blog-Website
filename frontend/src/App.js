import React from "react";
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import View from "./components/View";
import Saved from "./components/Saved";
import Liked from "./components/Liked";
// import Protect from "./ProtectedRoute(localhost)/Protect";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/view" element={<View/>}/>
        <Route path="/saved" element={<Saved/>}/>
        <Route path="/liked" element={<Liked/>}/>
      </Routes>
    </Router>
  );
}

export default App;
