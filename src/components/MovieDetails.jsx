import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MovieDetails.css';
const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/movie/${id}`);
                setMovie(response.data);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (!movie) {
        return <div>Loading...</div>;
    }

    const { title, director, description, imdb_link } = movie;
    
    return (
        <div>
            <h1>{title}</h1>
            <h2>Directed by: {director}</h2>
            <p>{description}</p>
            <a href={imdb_link} target="_blank" rel="noopener noreferrer">View on IMDb</a>
        </div>
    );
};

export default MovieDetails;