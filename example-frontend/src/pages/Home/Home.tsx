import logo from '../../assets/images/logo.svg';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
      <div className="App-body">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        <p>
          Go to <Link to="/otherPage" className="App-link">page</Link>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </div>
  );
}

export default Home;
