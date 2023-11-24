import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from './pages/Home/Home'; // example component being added
import NoPage from './pages/NoPage/NoPage'; // to demonstrate routing
import ComplianceForm from './pages/ComplianceForm/ComplianceForm';
import Admin from './pages/Admin/Admin';
import AuditGraphs from './pages/AuditGraphs/AuditGraphs';
import FieldEngineer from './pages/FieldEngineer/FieldEngineer';
import SignIn from "./pages/SignIn/SignIn";
import Sandbox from "./pages/Sandbox/Sandbox";
import AddPicu from "./pages/Admin/AddPicu";
import ForgottenPassword from "./pages/ForgottenPassword/ForgottenPassword";
import Auditlog from "./pages/Admin/AuditLog";
import EditPicus from "./pages/EditPicus/EditPicus";
import EditCompliance from "./pages/EditCompliance/EditCompliance";
import Redirect from "./components/Redirect/Redirect";

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
        <Route index path="/" element={
          <Redirect to="/login" condition={token === (undefined || null)} >
            <Home />
          </Redirect>
        }/>

        <Route path="*" element={<NoPage />} />

        <Route path="/login" element={<SignIn /> }/>

        <Route path="/sandbox" element={<Sandbox /> }/> 

        {adminAccess && (
          <>
            <Route path="/admin" element={<Admin />} />
            <Route path="/edit-picus" element={<EditPicus />} />
            <Route path="/add-picu" element={<AddPicu />} />
            <Route path="/audit-log" element={<Auditlog />} />
            <Route path="/edit-compliance" element={<EditCompliance />} />
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

        {(adminAccess || picuAccess) && (
          <>
            <Route path="/auditGraphs" element={<AuditGraphs />} />
            <Route path="/form" element={<ComplianceForm />} />
          </>
        )}
      </Routes>
    </Router>
  )
}

export default AppRouter;