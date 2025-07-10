import { BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Login from './components/login/LoginForm.jsx'
import Dashboard from './Dashboard.jsx';
import Changepassword from './components/changepassword/Changepassword.jsx';

function App() {
  return (
    <Router>
       <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/changePassword' element={<Changepassword/>}/>
      </Routes>
    </Router>
  );
};

export default App;