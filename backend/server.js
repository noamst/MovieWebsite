import express from "express";
import db from "./db.js";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

const openai = new OpenAI();
const GROQ_API = process.env.GROQ_API_KEY;

const LAMA3_API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

async function computeEmbedding(text) {
  try {
    if (!text || typeof text !== "string" || text.trim() === "") {
      throw new Error("Invalid input: Text must be a non-empty string.");
    }

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small", // Ensure this is the correct model
      input: text.trim(), // Pass a string, not an object
      encoding_format: "float",
    });

    // Extract embedding vector
    if (response.data && response.data.length > 0) {
      const embedding = response.data[0].embedding; // ✅ Correct way to access the embedding
      const cleanedEmbedding = embedding.map(Number); // Ensure all elements are numbers
      const formattedVector = `[${cleanedEmbedding.join(",")}]`; // Convert to PostgreSQL array format
      return formattedVector;
    } else {
      throw new Error("Invalid API response: No embedding found.");
    }
  } catch (error) {
    console.error("Error computing embedding:", error.response?.data || error.message);
    throw error;
  }
}
// Generate a mock embedding of the specified dimension
async function computeEmbeddingMock(text, dimension = 1536) {
   // Ensure correct format
   const embedding = Array.from({ length: dimension }, () => Math.random() * 2 - 1).map(Number); // Values between -1 and 1
   const cleanedEmbedding = embedding.map(Number); // Ensure all elements are numbers
   const formattedVector = `[${cleanedEmbedding.join(",")}]`; // Convert to PostgreSQL array format
  return formattedVector;
}

// Generate an explanation with Lama3 via Groq. The prompt could include both the query and movie data.
async function generateExplanation(query, movie) {
  try {
    const prompt = `
      A user described a movie as: "${query}"
      The movie "${movie.title}" (directed by ${movie.director}) has the following description:
      "${movie.description}"
      
      Explain in detail why this movie matches the user's description.
    `;
    
    const response = await fetch(LAMA3_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API}` // Replace with your actual API key
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Specify the correct model name
        messages: [{ role: "user", content: prompt }], // Use Chat API format
        max_tokens: 300 // Limit response length
      })
    });
    
    const result = await response.json();
    console.log(result);
     // Extract the first response from `choices`
     if (result.choices && result.choices.length > 0) {
      return result.choices[0].message.content || "No explanation available.";
    } else {
      throw new Error("Invalid response structure: No choices returned.");
    }
  } catch (error) {
    console.error("Error generating explanation:", error);
    return "Error generating explanation.";
  }
}
async function generateExplanationMock(query, movie) {
  return 'This is a mock explanation This is what you asked:' + query + " and what you received - " + movie.description ;
}
// API Endpoint: Get Data
app.get('/api/data', async (req, res) => {
  try {
    const { title } = req.query;
    //console.log("Search title:", title);
    
    // Define the search query using a parameterized query
    const search_query = `
      SELECT * FROM movietable
      WHERE title LIKE $1
      LIMIT 20;
    `;
    
    const result = await db.query(search_query, [`${title}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send('Server Error');
  }
});

// API Endpoint: Add Movie
app.post('/api/addMovie', async (req, res) => {
  try {
    const { title, director, description } = req.body; // Destructure values from req.body
    console.log("New movie data:", { title, director, description });
    const queryEmbedding = await computeEmbedding(description);

    const post_query = `
      INSERT INTO movietable (title, director, description , embedding)
      VALUES ($1, $2, $3 , $4);
    `;
    
    const result = await db.query(post_query, [title, director, description,queryEmbedding]); // No wildcards needed here
    //console.log("Insert result:", result);
    res.json({ message: "Movie added successfully" });
  } catch (error) {
    console.error("Error adding movie:", error.message);
    res.status(500).send('Server Error');
  }
});

// API Endpoint: Remove Movie
app.delete('/api/RemoveMovie', async (req, res) => {
  try {
    const { title, director, description } = req.body; // Destructure values from req.body
    

    console.log("Attempting to remove movie:", { title, director, description });

    const delete_query = `
      DELETE FROM movietable 
      WHERE title = $1
      RETURNING *;  -- Returns deleted row if successful
    `;

    const result = await db.query(delete_query, [title]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie removed successfully" });

  } catch (error) {
    console.error("Error removing movie:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// API Endpoint: RAG Search by Description
app.post('/api/recommend', async (req, res) => {
  try {
    const { userDescription } = req.body;
    console.log(userDescription);
    if (!userDescription) {
      return res.status(400).json({ message: "Description is required" });
    }

    // Compute the embedding for the user’s query.
    const queryEmbedding = await computeEmbedding(userDescription);
    const recommend_query = `
    SELECT * FROM movietable WHERE embedding IS NOT NULL ORDER BY embedding <=> $1 LIMIT 1;
  `;
    // Retrieve movies that have embeddings from the database.
    const moviesResult = await db.query(recommend_query, [queryEmbedding]);
    const movies = moviesResult.rows;

   
    // Take the top 5 movies as the overall top matches.
    const topMovies = movies;
    //console.log(topMovies);

    // For the top 3 movies, generate an explanation using the LLM.
    const results = await Promise.all(topMovies.map(async (movie) => {
      let explanation = "";
      explanation = await generateExplanation(userDescription, movie);
      //console.log(explanation);
      return {
        movie: {
          title: movie.title,
          director: movie.director,
          description: movie.description,
        },
        explanation  // will be an empty string for movies ranked 4th and 5th.
      };
    }));
    const modified = results.map(({ movie, explanation }) => ({
      title: movie.title,
      director: movie.director,
      description: movie.description,
      explanation
    }));    
    console.log(modified);
    res.json(modified);
  } catch (error) {
    console.error("Error during RAG search:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
