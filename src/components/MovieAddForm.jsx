import React, { useState } from 'react';
import '../styles/MovieAddForm.css';

function MovieAddForm () {
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [description, setDescription] = useState('');
  const [result,setResult] = useState('');

  

  const handleSubmit = (e) => {
    
    e.preventDefault();
    console.log("GOT HERE");

    if (title.trim() && description.trim()) {
      const request = { title: title.trim() , director:director.trim(), description: description.trim() };
      console.log(request);
      fetch("http://localhost:5000/api/addMovie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })
        .then((response) => {

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          
          setTitle("");
          setDirector("");
          setDescription("");
          setResult("Success");
          console.log("Server Response:", data);
        })
        .catch((error) => {
          console.error("Error while adding the movie:", error);
          setResult("Something Went Wrong");
        });
    } else {
      alert("Please fill out all fields!");
    }
  };

  return (
    <div className='background-container'>
      <div className="movie-add-form">
        <h1>Add a New Movie</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Movie Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="movie-input"
          />
          <input
            type="text"
            placeholder="Director"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            className="movie-input"
          />
          <textarea
            placeholder="Movie Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="movie-input movie-textarea"
          />
          <button type="submit" className="movie-submit-button">Add Movie</button>
          <h1>{result}</h1>
        </form>
      </div>
    </div>
  );
};

export default MovieAddForm;
