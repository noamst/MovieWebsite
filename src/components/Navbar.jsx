import React from "react";
import "../styles/Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <a href="/addMovie" className="navbar-link">Add Movie</a>
            <br/>
            <a href="/RecommendMovie" className="navbar-link">Recommend Movie</a>
        </nav>
    );
}

export default Navbar;
