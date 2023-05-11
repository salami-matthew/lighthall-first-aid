import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Handbook from './components/Handbook';
import Menu from './components/Menu';
import Layout from './components/Layout';
import PersonalizedEmergencyPlan from './components/PersonalizedPlans';
import Customize from './components/Customize';
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './components/AuthContext';
import PrivateRoutes from './components/PrivateRoutes';

// code splitting, dynamic routes
// const Handbook = lazy(() => import('./components/Handbook'));
// const Dashboard = lazy(() => import('./components/Dashboard'));
// const PersonalizedEmergencyPlan = lazy(() => import('./components/PersonalizedPlans'));


function App() {

  return (
    <>
      <AuthProvider>
        <ToastContainer />
        <Router>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<SignUp />} />
            <Route element={<PrivateRoutes />}>
              <Route path='/:userid' element={<Layout />}>
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='handbook' element={<Handbook />} />
                <Route path='plan' element={<PersonalizedEmergencyPlan />} />
                <Route path='customize' element={<Customize />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
