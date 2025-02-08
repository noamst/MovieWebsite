import React, { useState } from 'react';
import '../styles/MovieAddForm.css'; // Make sure the path matches where your CSS file is located

function MovieRecommendationForm() {
  const [description, setDescription] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setRecommendation('');
      console.log("got here");
      //Replace this fetch  call with your own LLM API endpoint or OpenAI's API call
      // For example, if you have an endpoint /api/recommend that calls your LLM:
      fetch('http://localhost:5000/api/recommend', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ userDescription: description }),
       })
       .then((response) => {

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
       .then((data) => {
        console.log(data[0]);
        console.log(data[0].explanation)
        setRecommendation(data[0].explanation);
      }
    ).error((error)=>{
      setRecommendation(error.Error);
    })
    } catch (error) {
      console.error('Error fetching recommendation:', error);
      setLoading(false);
    }
  };

  return (
    <div className="background-container">
      <form className="movie-add-form" onSubmit={handleSubmit}>
        <h1>Movie Recommendation</h1>
        
        <textarea
          className="movie-input movie-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the type of movie you want to see..."
        />
        
        <button
          type="submit"
          className="movie-submit-button"
          disabled={loading}
        >
          {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
        </button>
      </form>
      
      {recommendation && (
        <div style={{
          maxWidth: '500px',
          margin: '30px auto',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          transition: 'all 0.3s ease-in-out',
        }}>
          <h2
      style={{
        color: '#ff4081',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
      }}
    >
      🎬 Your Movie Recommendation
    </h2>
          <p
          style={{
            fontSize: '18px',
            color: '#333',
            lineHeight: '1.5',
            padding: '10px',
          }}
          >{recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default MovieRecommendationForm;
