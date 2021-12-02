import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Routes,
} from 'react-router-dom';
import Home from './pages/Home';
import Play from './pages/Play';
import DashBoard from './pages/DashBoard';
import { Web3ContextProvider } from './contexts/Web3Context';
import { ClockContextProvider } from './contexts/ClockContext';
import Layout from './shared/Layout';
import 'tailwindcss/tailwind.css';
import { useMoralis } from 'react-moralis';

function App() {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);
  return (
    // <Web3ContextProvider>
    <ClockContextProvider>
      <Router>
        <Layout>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/play" element={<Play vsComputer={true} />} />
            <Route exact path="/dashboard" element={<DashBoard />} />
          </Routes>
        </Layout>
      </Router>
    </ClockContextProvider>
    // </Web3ContextProvider>
  );
}

export default App;
