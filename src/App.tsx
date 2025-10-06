import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ListView from "./components/ListView/ListView";
import "./App.css";
import DetailView from "./components/DetailView/DetailView";

function App() {
  return (
    <Router basename="/">
      <div className="App">
        
        <main className="app-main">
          <div className="header-container">
            <h2>The Meal DB Food Directory</h2>
          </div>

          <div className="nav-container">
            <div className="nav">
              <div className="nav-links">
                 <Link to="/" className="nav-link">
                  Home
                </Link>
                <Link to="/list" className="nav-link">
                  Search
                </Link>
                <Link to="/gallery" className="nav-link">
                  Gallery
                </Link>
              </div>
            </div>
          </div>
          <Routes>
            <Route path="/list" element={<ListView />} />
           <Route path="/detail/:id" element={<DetailView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
