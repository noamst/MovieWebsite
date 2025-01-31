import logo from '../logo.svg'; // Adjust the path if needed
import MovieCardList from './MovieCardList';
import Navbar from './Navbar';
import  '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <Navbar/>
      <h1>Welcome to my app</h1>
      <MovieCardList/>
    </div>
  );
}

export default Home;