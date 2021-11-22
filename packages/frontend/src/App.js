import React from 'react';
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
import Layout from './shared/Layout';
import 'tailwindcss/tailwind.css';

function App() {
  return (
    <Web3ContextProvider>
      <Router>
        <Layout>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route
              exact
              path="/play"
              element={<Play vsComputer={true} startColor="white" />}
            />
            <Route exact path="/dashboard" element={<DashBoard />} />
          </Routes>
        </Layout>
      </Router>
    </Web3ContextProvider>
  );
}

export default App;
