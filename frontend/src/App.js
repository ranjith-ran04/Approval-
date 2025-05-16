<<<<<<< HEAD
import React from 'react';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';
=======
import Home from './components/Home/Home.js'
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import { CollegeInfo } from './components/College/CollegeInfo.js';
>>>>>>> 2eada10ea0ad86db47fc9b56dd1b43ecf7502bff

const App = () => {
  return (
<<<<<<< HEAD
    <div>
      <LoginForm />
      <Footer />
    </div>
=======
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/collegeDetails' element={<CollegeInfo/>} />
      </Routes>
    </Router>
>>>>>>> 2eada10ea0ad86db47fc9b56dd1b43ecf7502bff
  );
};

export default App;