import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import ProjectProfilePage from './pages/ProjectProfilePage/ProjectProfilePage';
import LoginPage from './pages/LoginPage/LoginPage';
import DataEntryPage from './pages/DataEntryPage/DataEntryPage';
import CreateVcPage from './pages/DataEntryPage/CreateVcPage';
import CreateParticipantPage from './pages/DataEntryPage/CreateParticipantPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<ProjectsPage />} />
        <Route path="/project/:projectSlug" element={<ProjectProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/data-entry" element={<DataEntryPage />} />
        <Route path="/data-entry/vc" element={<CreateVcPage />} />
        <Route path="/data-entry/participant" element={<CreateParticipantPage />} />
      </Routes>
    </Router>
  );
}

export default App;
