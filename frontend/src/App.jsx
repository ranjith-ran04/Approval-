import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/LoginForm.jsx";
import Dashboard from "./Dashboard.jsx";
import { LoaderProvider} from "./context/LoaderContext.jsx";
import LoaderOverlay from "./widgets/loader/LoaderOverlay.jsx";
import Changepassword from './components/changepassword/Changepassword.jsx';
import AdminDashboard from './admin/dashboard/Dashboard.jsx'
import Resetpassword from "./components/changepassword/Resetpassword.jsx";

function AppContent() {
  return (
    <Router>
       <Routes>
        <Route path='/' element={<Login admin={false}/>} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/resetPassword' element={<Resetpassword/>}/>
        <Route path='/changePassword' element={<Changepassword/>}/>
        <Route path='/admin/login' element={<Login admin={true}/>}/>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      </Routes>
    </Router>
  );
}
function App() {
  return (
    <LoaderProvider>
      <AppContent />
      <LoaderOverlay/>
    </LoaderProvider>
  );
}
export default App;
