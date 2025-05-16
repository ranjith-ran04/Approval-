import { BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './components/home/Home.js'
import {CollegeInfo} from './components/college/CollegeInfo'
import Branch from './components/branch/Branch';
import EditBranch from './components/branch/EditBranch';
import AddBranch from './components/branch/AddBranch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/collegeDetails' element={<CollegeInfo/>} />
        <Route path="/branch" element={<Branch />} />
        <Route path="/branch/edit/:id" element={<EditBranch />} />
        <Route path="/branch/add" element={<AddBranch />} />
      </Routes>
    </Router>
  );
}

export default App;
