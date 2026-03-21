import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import ProjectProfilePage from './pages/ProjectProfilePage/ProjectProfilePage';
import LoginPage from './pages/LoginPage/LoginPage';
import DataEntryPage from './pages/DataEntryPage/DataEntryPage';
import CreateVcPage from './pages/DataEntryPage/CreateVcPage';
import CreateParticipantPage from './pages/DataEntryPage/CreateParticipantPage';
import VCDashboardPage from './pages/VCDashboardPage/VCDashboardPage';
import ParticipantDashboardPage from './pages/ParticipantDashboardPage/ParticipantDashboardPage';
import VCMeetupRequestsPage from './pages/VCMeetupRequestsPage/VCMeetupRequestsPage';
import ReviewProjectsPage from './pages/ReviewProjectsPage/ReviewProjectsPage';
import ParticipantTimelinePage from './pages/ParticipantTimelinePage/ParticipantTimelinePage';
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
        <Route path="/vc/dashboard" element={<VCDashboardPage />} />
        <Route path="/vc/meetups" element={<VCMeetupRequestsPage />} />
        <Route path="/vc/review-projects/:participantId" element={<ReviewProjectsPage />} />
        <Route path="/participant/dashboard" element={<ParticipantDashboardPage />} />
        <Route path="/participant/timeline" element={<ParticipantTimelinePage />} />
      </Routes>
    </Router>
  );
}

export default App;
