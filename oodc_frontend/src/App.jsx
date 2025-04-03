// react imports
import { useEffect, useState, useRef } from 'react';

// external imports
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
}                                           from 'react-router-dom';

// internal imports
import { AppProvider }                      from './utils/AppContext';
import Products from './components/core/Products';
import ProductView from './components/core/ProductView';
import Logout from './components/core/Logout';
import './App.css';


function App() {

  const [user, setUser] = useState({
    username: null,
    isAdmin: false
  });

  const localStorageUsername = localStorage.getItem('username');
  const localStorageIsAdmin = localStorage.getItem('isAdmin');

  function getUserData(username, isAdmin) {
    if (username !== null && isAdmin !== null) {
      setUser({
        username: username,
        isAdmin: isAdmin
      })
    }
  };

  useEffect(() => {
    getUserData(localStorageUsername, localStorageIsAdmin);
  }, [localStorageUsername, localStorageIsAdmin]);

  return (
    <AppProvider value={{user, setUser}}>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to='/products'/>}/>
          <Route path='/products' element={<Products/>}/>
          <Route path='/products/:productId' element={<ProductView/>}/>
          <Route path='/logout' element={<Logout/>}/>
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
