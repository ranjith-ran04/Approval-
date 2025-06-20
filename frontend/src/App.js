import { BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import CollegeInfo from './components/College/CollegeInfo.js'
import Branch from './components/branch/Branch';
import EditBranch from './components/branch/EditBranch';
import AddBranch from './components/branch/AddBranch';
import Login from './components/login/LoginForm.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/collegeDetails' element={<CollegeInfo/>} />
        <Route path="/branch" element={<Branch />} />
        <Route path="/branch/edit/:id" element={<EditBranch />} />
        <Route path="/branch/add" element={<AddBranch />} />
      </Routes>
    </Router>
  );
};

export default App;