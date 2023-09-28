import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function NavBar() {
    return (
        <nav className="nav-bar">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/continuous_evaluation" className="nav-link">Evaluation</NavLink>
        </nav>
    );
}

export default NavBar;
