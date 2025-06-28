import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-link"><div className="navbar-logo">IT Labs Darts League</div></Link>
        <div className="navbar-links">
          <Link to="/add-game" className="navbar-link">Add Game</Link>
          <Link to="/leaderboard" className="navbar-link">Leaderboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
