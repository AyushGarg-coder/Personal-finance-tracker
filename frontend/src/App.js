import './App.css';
import {BrowserRouter, Route, Routes,Navigate, Outlet} from 'react-router-dom'
import Login from './Components/Login';
import { useState } from 'react';
import HomePage from './Components/HomePage';

const PrivateRoute=({isAuthenticated,...props})=>{
      return isAuthenticated ?(
        <Outlet {...props}/>
      ):(
        <Navigate replace to={"/login"}/>
      )
}

function App() {
  const [isAuthenticated,setUserAuthenticated]=useState(false)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login setUserAuthenticated={setUserAuthenticated}/>}/>
        <Route path='/' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
        {/* now add routes here */}
        <Route path='/' element={<HomePage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
