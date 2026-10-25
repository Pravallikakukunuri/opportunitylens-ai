import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import type { UserProfile, Opportunity } from '../../types';
import { ShieldAlert } from 'lucide-react';

interface LayoutProps {
  profile: UserProfile;
  opportunities: Opportunity[];
}

export const Layout: React.FC<LayoutProps> = ({ profile, opportunities }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const highRiskCount = opportunities.filter((o) => o.riskAssessment.riskLevel === 'high').length;

  return (
    <div className="h-screen flex bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Desktop Sidebar: Always pinned, never scrolls away */}
      <div className="hidden lg:flex shrink-0 h-full">
        <Sidebar savedCount={opportunities.length} highRiskCount={highRiskCount} />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar
              savedCount={opportunities.length}
              highRiskCount={highRiskCount}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area: Scrolls independently */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Top Safety Announcement Bar */}
        <div className="bg-[#0b1528] text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center justify-center max-w-7xl mx-auto w-full text-center">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-amber-300 bg-amber-950/40 border border-amber-800/40 px-3 py-0.5 rounded-full">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Never pay money for internship/job offers.</span>
            </div>
          </div>
        </div>

        {/* Unified Top Navbar */}
        <Navbar
          profile={profile}
          opportunities={opportunities}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Page Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[300px] py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                  <span className="text-xs font-semibold text-slate-500">Loading OpportunityLens view...</span>
                </div>
              </div>
            }
          >
            <Outlet />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
};
