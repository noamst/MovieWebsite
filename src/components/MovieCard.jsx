import React from "react";
import "../styles/MovieCard.css";



function MovieCard(props) {
  const content = props.description;
  const title = props.title;
  const SetIsDeleted = props.setDeleted;
  const DeletedInd = props.isDeletedInd;
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
        const response = await fetch("http://localhost:5000/api/RemoveMovie", {
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
        SetIsDeleted(1- DeletedInd);
        console.log("Server Response:", data);


       
    } catch (error) {
        console.error("Error while removing the movie:", error);
    }
};

  
  return (
  <div className="movie-card-wrapper">
    <div className="movie-card">
      <button className="scroll-button" onClick={handleRemove}>
        🗑️
      </button>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  </div>

  );
}

export default MovieCard;
