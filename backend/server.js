import express from "express";
import db from "./db.js";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoint: Get Data
app.get('/api/data', async (req, res) => {
  try {
    const { title } = req.query;
    console.log("Search title:", title);
    
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
    
    const post_query = `
      INSERT INTO movietable (title, director, description)
      VALUES ($1, $2, $3);
    `;
    
    const result = await db.query(post_query, [title, director, description]); // No wildcards needed here
    console.log("Insert result:", result);
    res.json({ message: "Movie added successfully" });
  } catch (error) {
    console.error("Error adding movie:", error.message);
    res.status(500).send('Server Error');
  }
});

// API Endpoint: Remove Movie
app.delete('/api/RemoveMovie', async (req, res) => {
  try {
    const { title} = req.body; // Destructure values from req.body
    
    if (!title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("Attempting to remove movie:", { title});

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



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
