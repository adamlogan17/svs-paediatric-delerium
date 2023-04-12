import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import reportWebVitals from './reportWebVitals';


import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Home from './pages/Home/Home'; // example component being added
import OtherPage from './pages/OtherPage/OtherPage'; // to demonstrate routing
import NoPage from './pages/NoPage/NoPage'; // to demonstrate routing
import Login from './pages/login/login';
import Form from './pages/Form/form';
import AuditGraphs from './pages/AuditGraphs/AuditGraphs';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const token:string|null = sessionStorage.getItem("TOKEN");
const role:string|null = sessionStorage.getItem("ROLE");

// Below are the access conditions for each role, and which pages they can access
let adminAccess:boolean = false;
let picuAccess:boolean = token !== (undefined || null) && role === 'picu';
let fieldAccess:boolean = false;


root.render(
  
    <Router>
      <Routes>
          <Route index path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/form" element={<Form />}/>
          {picuAccess ? <Route path="/otherPage" element={<OtherPage />}/> : <></>}
          <Route path="/auditGraphs" element={<AuditGraphs />}/>
          <Route path="*" element={<NoPage />}/>
      </Routes>
    </Router>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();