import { CollegeDetails } from './components/College/CollegeDetails.js';
// import Home from './components/Home.js'
function App() {
  return (
    <div>
      {/* <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/CollegeDetails' element={<CollegeDetails/>}/>
        </Routes>
      </Router> */}
      <CollegeDetails/>
    </div>
  );
}

export default App;
