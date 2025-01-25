import React from "react";
import "../styles/MovieCard.css";

function MovieCard(props) {
  const content = props.description;
  const title = props.title;
  return (
    <div className="movie-card">
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
}

export default MovieCard;
