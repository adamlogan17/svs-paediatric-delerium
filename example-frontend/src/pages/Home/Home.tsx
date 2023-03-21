import logo from '../../assets/images/logo.svg';
import ConsumeAPI from '../../components/ConsumeAPI/ConsumeAPI';
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


        <h1>Silicon Valley Samurais Hello</h1>

        <p>
          <ConsumeAPI />
        </p>
      </div>
  );
}

export default Home;
