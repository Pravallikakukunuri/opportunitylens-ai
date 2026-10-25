import { useState, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';

const AnalyzePage = lazy(() => import('./pages/AnalyzePage').then((m) => ({ default: m.AnalyzePage })));
const SavedOpportunitiesPage = lazy(() => import('./pages/SavedOpportunitiesPage').then((m) => ({ default: m.SavedOpportunitiesPage })));
const SkillProfilePage = lazy(() => import('./pages/SkillProfilePage').then((m) => ({ default: m.SkillProfilePage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
import {
  loadOpportunities,
  addOpportunity,
  updateOpportunity,
  deleteOpportunity,
  loadUserProfile,
  saveUserProfile,
  loadSettings,
  saveSettings,
  resetAllDataToDefault,
  reseedDemoOpportunities,
} from './services/storage';
import type { Opportunity, UserProfile, AppSettings } from './types';

export function App() {
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(loadOpportunities);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  const handleSaveOpportunity = (newOpp: Opportunity) => {
    addOpportunity(newOpp);
    setOpportunities(loadOpportunities());
  };

  const handleUpdateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    updateOpportunity(id, updates);
    setOpportunities(loadOpportunities());
  };

  const handleDeleteOpportunity = (id: string) => {
    deleteOpportunity(id);
    setOpportunities(loadOpportunities());
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    saveUserProfile(newProfile);
    setProfile(newProfile);
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all saved opportunities and profile back to the default demo state?')) {
      resetAllDataToDefault();
      setProfile(loadUserProfile());
      setOpportunities(loadOpportunities());
      setSettings(loadSettings());
    }
  };

  const handleReseedDemo = () => {
    const seeded = reseedDemoOpportunities();
    setOpportunities(seeded);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout profile={profile} opportunities={opportunities} />}>
          <Route
            index
            element={
              <DashboardPage
                opportunities={opportunities}
                profile={profile}
                onUpdateOpportunity={handleUpdateOpportunity}
                onDeleteOpportunity={handleDeleteOpportunity}
                onReseedDemoData={handleReseedDemo}
              />
            }
          />
          <Route
            path="analyze"
            element={
              <AnalyzePage
                profile={profile}
                onSaveOpportunity={handleSaveOpportunity}
                onUpdateProfile={handleSaveProfile}
                settings={settings}
              />
            }
          />
          <Route
            path="saved"
            element={
              <SavedOpportunitiesPage
                opportunities={opportunities}
                onUpdateOpportunity={handleUpdateOpportunity}
                onDeleteOpportunity={handleDeleteOpportunity}
              />
            }
          />
          <Route
            path="profile"
            element={
              <SkillProfilePage
                profile={profile}
                onSaveProfile={handleSaveProfile}
              />
            }
          />
          <Route
            path="settings"
            element={
              <SettingsPage
                settings={settings}
                onSaveSettings={handleSaveSettings}
                onResetData={handleResetData}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
