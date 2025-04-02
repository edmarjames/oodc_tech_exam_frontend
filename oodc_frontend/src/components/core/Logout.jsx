// react imports
import React, {
  useContext,
  useEffect,
}                                           from 'react';

// external imports
import { Navigate } 					              from 'react-router-dom';

// internal imports
import AppContext 						              from '../../utils/AppContext';


export default function Logout() {

  const { setUser } = useContext(AppContext);

  useEffect(() => {
    setUser({
        username: null,
        isAdmin: false
    });
    localStorage.clear();
  });

  return (
    <Navigate to='/' />
  )
}
