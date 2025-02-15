**Movie Recommendation App (RAG + pgvector + Groq LLM)**

  This project provides movie recommendations using RAG (Retrieval-Augmented Generation) techniques, combined with a Groq API call to a Llama3 8B language model to explain why a     particular movie was recommended.
  
  It uses:
  
  Node.js (Express) for the backend
  React for the frontend
  PostgreSQL (with pgvector extension) for storing and querying vector embeddings
  OpenAI Embeddings API for generating embeddings (using text-embedding-3-small, though text-embedding-ada-002 is also common)
  Groq API to run the Llama3 8B LLM, providing a short explanation on why the recommended movie aligns with the user’s query.
  

**Overview**

  The application allows users to get movie recommendations by querying a PostgreSQL database (with pgvector) to find the closest movie descriptions by vector similarity. Once the   top match is found, the App calls the Groq API to run a Llama3 8B language model. This LLM provides a short text explaining why the selected movie fits the user’s query.

**Flow**
  User Input: The user describes what kind of movie they want (e.g., “I’d like a thrilling action movie.”).
  Embedding Generation: The backend calls the OpenAI API to convert the user’s query into a vector (dimension 1536).
  Vector Similarity Query: We use pgvector in PostgreSQL to find the movie(s) whose descriptions have the highest cosine similarity to the user’s query vector.
  LLM Explanation: The backend then calls the Groq API with Llama3 8B to generate a short explanation of why this recommended movie is the closest match to the user’s request.
  Recommendation & Explanation: The system returns the recommended movie data (title, director, description, IMDb link) along with a short explanation from the LLM.
  Ports:
  
    PostgreSQL runs on port 5432 (default).
    Node.js (Express) backend runs on port 5001.
    React frontend runs on port 3000.
    
    
**Prompt** 
  ![image](https://github.com/user-attachments/assets/5294ce55-b97b-496d-acd9-397b7d18e260)


**Prerequisites**

  To run this project locally, you need:
  
  Node.js (v14+ recommended)
  npm or yarn (for installing dependencies)
  PostgreSQL (v13+ recommended) with the pgvector extension
  OpenAI API Key (for embedding generation)
  OpenAI to create an API key
  Groq API Key (for the Llama3 8B model calls)
  Groq API or the relevant hosting platform for Llama3 8B
  



**Database Setup**

  1. Install and Run PostgreSQL
    Install PostgreSQL if you don’t have it already.
    Ensure the PostgreSQL server is running on port 5432.
  2. Install pgvector Extension
  3.Enable the extension in your database.
  4. Create the movies Table
  In your PostgreSQL database (e.g., using psql, pgAdmin, etc.), run:


'''sql
    CREATE TABLE IF NOT EXISTS movies (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      director VARCHAR(255),
      description TEXT,
      embeddings VECTOR(1536) , -- match the dimension for your embedding model
      imdb_link TEXT
    );
'''



Navigate to the backend folder:
  cd backend
Create or update a .env file with the following variables (example layout):


'''
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=your_user 
  DB_PASSWORD=your_pass
  DB_NAME=your_DB
  GROQ_API_KEY = your_key
  OPENAI_API_KEY = your_key
'''


**Usage**

  Open your browser to http://localhost:3000.
  Enter your movie preference in the search box (e.g., “I want a heartwarming romantic comedy.”).
  The app will:
  Generate an embedding of your query via OpenAI.
  Query the Postgres database to find the closest match(es) by cosine similarity.
  Call the Groq API with Llama3 8B to generate a short explanation of why this movie is a good match.
  Present the recommendation: Title, Director, Description, IMDb link, and the explanation from Llama3 8B.

**Use Examples -** 

Homepage -
    ![image](https://github.com/user-attachments/assets/1cb10b63-76f8-4bc3-90fd-c52b241f1d57)
Recommendation Screen - 
    ![image](https://github.com/user-attachments/assets/9d397d41-2236-425b-9c08-bdfed02f436a)

    
**License**

  This project is for educational/demo use. You can adapt it freely for your own purposes. Enjoy building and learning from it!

