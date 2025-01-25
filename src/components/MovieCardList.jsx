import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import "../styles/MovieCardList.css";

function MovieCardList() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data with searchTerm as a query parameter
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/data?title=${encodeURIComponent(searchTerm)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchMovies();
  }, [searchTerm]); // Re-fetch data whenever searchTerm changes

  // Update searchTerm state
  function updateSearchTerm(event) {
    setSearchTerm(event.target.value); // Update searchTerm dynamically
  }

  return (
    <div className="movie-card-list">
      <input
        onChange={updateSearchTerm}
        type="text"
        placeholder="Search for a movie..."
        value={searchTerm}
      />
      {data.map((movie, index) => (
        <MovieCard
          key={index} // Unique key for each MovieCard
          title={movie.title}
          director={movie.director}
          description={movie.description}
        />
      ))}
    </div>
  );
}

export default MovieCardList;
