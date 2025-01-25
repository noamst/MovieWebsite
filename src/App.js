import './App.css';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieAddForm from './components/MovieAddForm';

function App() {
  return (
    <Router>
    <div>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addMovie" element={<MovieAddForm />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
