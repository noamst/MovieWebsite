import logo from '../logo.svg'; // Adjust the path if needed
import MovieCardList from './MovieCardList';
import Navbar from './Navbar';


function Home() {
  return (
    <div>
      <Navbar/>
      <h1>Welcome to my app</h1>
      <MovieCardList/>
    </div>
  );
}

export default Home;