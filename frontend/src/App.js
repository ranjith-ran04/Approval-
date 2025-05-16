import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Branch from './components/branch/Branch';
import EditBranch from './components/branch/EditBranch';
import AddBranch from './components/branch/AddBranch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/branch" element={<Branch />} />
        <Route path="/branch/edit/:id" element={<EditBranch />} />
        <Route path="/branch/add" element={<AddBranch />} />
      </Routes>
    </Router>
  );
}

export default App;
