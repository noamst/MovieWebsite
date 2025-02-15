import React from "react";
import "../styles/MovieCard.css";

function MovieCard(props) {
  const { 
    description: content, 
    id, 
    title, 
    setDeleted: SetIsDeleted, 
    isDeletedInd: DeletedInd 
  } = props;

  const handleCardClick = () => {
    // Redirect or navigate to another URL when the card is clicked
    // For example:
    window.location.href = `/movies/${id}`;
    // Or if using React Router:
    // navigate(`/movies/${id}`);
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    console.log("GOT HERE");

    // Trim and validate inputs
    if (!title.trim()) {
      alert("Please fill out all fields!");
      return;
    }

    const request = { 
      title: title.trim()
    };

    console.log("Sending request:", request);

    try {
      const response = await fetch("http://localhost:5001/api/RemoveMovie", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Check if response has JSON data before parsing
      const data = await response.json().catch(() => null);
      SetIsDeleted(1 - DeletedInd);
      console.log("Server Response:", data);
    } catch (error) {
      console.error("Error while removing the movie:", error);
    }
  };

  return (
    <div className="movie-card-wrapper">
      {/* Attach onClick to the card */}
      <div className="movie-card" onClick={handleCardClick}>
        {/* Prevent the click on the button from bubbling up to the card */}
        <button
          className="scroll-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevents card click event
            handleRemove(e);
          }}
        >
          🗑️
        </button>
        <h1>{title}</h1>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default MovieCard;
