import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Home from './pages/Home/Home'; // example component being added
import OtherPage from './pages/OtherPage/OtherPage'; // to demonstrate routing
import NoPage from './pages/NoPage/NoPage'; // to demonstrate routing
import Login from './pages/Login/Login';
import Form from './pages/Form/form';
import Admin from './pages/Admin/Admin';
import AuditGraphs from './pages/AuditGraphs/AuditGraphs';
import FieldEngineer from './pages/FieldEngineer/FieldEngineer';
import SignIn from "./pages/Login/SignIn";
import Sandbox from "./pages/Sandbox/Sandbox";

const token:string|null = sessionStorage.getItem("TOKEN");
const role:string|null = sessionStorage.getItem("ROLE");

// Below are the access conditions for each role, and which pages they can access
let adminAccess:boolean = token !== (undefined || null) && role === 'admin';
let picuAccess:boolean = token !== (undefined || null) && role === 'picu';
let fieldAccess:boolean = token !== (undefined || null) && role === 'field_engineer';

function AppRouter() {
  return (
    <Router>
      <Routes>
          <Route index path="/" element={<Home />}/>
          <Route path="/login2" element={<Login />}/>
          <Route path="/login" element={<SignIn /> }/>

          <Route path="/sandbox" element={<Sandbox /> }/>

          {picuAccess ? <Route path="/form" element={<Form />}/> : <></>}
          {picuAccess ? <Route path="/otherPage" element={<OtherPage />}/> : <></>}
          {picuAccess ? <Route path="/auditGraphs" element={<AuditGraphs />}/> : <></>}
          <Route path="*" element={<NoPage />}/>
          {adminAccess ? <Route path="/admin" element={<Admin />}/>: <></>}
          {fieldAccess ? <Route path="/fieldengineer" element={<FieldEngineer />}/>: <></>}
      </Routes>
    </Router>
  )
}

export default AppRouter;