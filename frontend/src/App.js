import Login from './components/login/LoginForm.js'

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