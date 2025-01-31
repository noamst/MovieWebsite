import React, { useState, useEffect ,useRef} from "react";
import MovieCard from "./MovieCard";
import "../styles/MovieCardList.css";

function MovieCardList() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleted,SetIsDeleted] = useState(0);
  const containerRef = useRef();

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

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
  }, [searchTerm,isDeleted]); // Re-fetch data whenever searchTerm changes

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
        className="search-input"
      />
      {data && data.length > 0 ? (
      <div className="carousel-container">
        <button className="scroll-button left" onClick={scrollLeft}>
          ◀️
        </button>
        <div className="movie-cards-container" ref={containerRef}>
          {data.map((movie, index) => (
            <MovieCard
              key={index}
              title={movie.title}
              director={movie.director}
              description={movie.description}
              setDeleted ={SetIsDeleted}
              isDeletedInd ={isDeleted}
            />
          ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>
          ▶️
        </button>
      </div>
      ) : (
        <h1>Nothing To Show</h1>)}
    </div>
    
  );
}

export default MovieCardList;
