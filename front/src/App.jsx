import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Overview from "./pages/Overview";
import Admin from "./pages/Admin";
import Programmes from "./pages/Programmes";
import Candidature from "./pages/Candidature";
import Evaluation from "./pages/Evaluation";
import Qcm from "./pages/Qcm";
import Users from "./pages/Users";
import UserCreate from "./pages/UserCreate";
import UserDetails from "./pages/UserDetails";
import UserEdit from "./pages/UserEdit";
import CandidatDetails from "./pages/CandidatDetails";
import It from "./pages/It";
import ItCandidat from "./pages/ItCandidat";
import ItCandidatDetails from "./pages/ItCandidatDetails";
import TestNiveau from "./pages/TestNiveau";
import Rh from "./pages/Rh";
import CriteresAppreciation from "./pages/CriteresAppreciation";
import Formateur from "./pages/Formateur";
import FormateurCandidat from "./pages/FormateurCandidat";
import FormateurCandidatDetails from "./pages/FormateurCandidatDetails";
import CrudPrequalification from "./pages/CrudPrequalification";
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Auth />} />

            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/admin/overview" element={<Admin />} />
            <Route path="/admin/programmes" element={<Programmes />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/users/create" element={<UserCreate />} />
            <Route path="/admin/users/:id" element={<UserDetails />} />
            <Route path="/admin/users/:id/edit" element={<UserEdit />} />
            <Route path="/admin/candidat/:id" element={<CandidatDetails />} />
            
            <Route path="/recrue/overview" element={<Overview />} />
            <Route path="/recrue/candidature" element={<Candidature />} />
            <Route path="/recrue/qcm/:id" element={<Qcm />} />
            <Route path="/recrue/evaluation" element={<Evaluation />} />

            <Route path="/adminit/overview" element={<It />} />
            <Route path="/adminit/candidat" element={<ItCandidat />} />
            <Route path="/adminit/candidat/:id" element={<ItCandidatDetails />} />
            <Route path="/adminit/qcm/:testId" element={<TestNiveau />} />

            <Route path="/rh/overview" element={<Rh />} />
            <Route path="/rh/criteres" element={<CriteresAppreciation />} />

            <Route path="/formateur/overview" element={<Formateur />} />
            <Route path="/formateur/candidat" element={<FormateurCandidat />} />
            <Route path="/formateur/candidat/:id" element={<FormateurCandidatDetails />} />
            <Route path="/formateur/prequalification/:prequalificationId" element={<CrudPrequalification />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;