import Home from './components/Home/Home.js'
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import { CollegeInfo } from './components/College/CollegeInfo.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/collegeDetails' element={<CollegeInfo/>} />
      </Routes>
    </Router>
  );
}

export default App;
