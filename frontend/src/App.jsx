import { BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Login from './components/login/LoginForm.jsx'
import {useState,useEffect} from 'react'
import Dashboard from './Dashboard.jsx';

function App() {
  return (
    <Router>
       <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </Router>
  );
};

export default App;