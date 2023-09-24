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
import AddPicu from "./pages/Admin/AddPicu";
import ForgottenPassword from "./pages/ForgottenPassword/ForgottenPassword";
import EditPicus from "./pages/EditPicus/EditPicus";

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
        <Route path="*" element={<NoPage />} />

        <Route path="/login2" element={<Login />}/>
        <Route path="/login" element={<SignIn /> }/>

        <Route path="/sandbox" element={<Sandbox /> }/>          

        {picuAccess && (
          <>
            <Route path="/form" element={<Form />} />
            <Route path="/otherPage" element={<OtherPage />} />
            <Route path="/auditGraphs" element={<AuditGraphs />} />
          </>
        )}

        {adminAccess && (
          <>
            <Route path="/admin" element={<Admin />} />
            <Route path="/add-picu" element={<AddPicu />} />
            <Route path="/edit-picus" element={<EditPicus />} />
          </>
        )}

        {fieldAccess && (
          <>
            <Route path="/fieldengineer" element={<FieldEngineer />} />
          </>
        )}

        {(adminAccess || fieldAccess) && (
          <>
            <Route path="/forgot-password" element={<ForgottenPassword />} />
          </>
        )}
      </Routes>
    </Router>
  )
}

export default AppRouter;