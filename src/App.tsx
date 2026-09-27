/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategoryIconBar } from './components/CategoryIconBar';
import { NewsSection } from './components/NewsSection';
import { StatsSection } from './components/StatsSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { ProgramDetailModal } from './components/Modals/ProgramDetailModal';
import { NewsDetailModal } from './components/Modals/NewsDetailModal';
import { FeedbackModal } from './components/Modals/FeedbackModal';
import { ArticleModal } from './components/ArticleModal';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ProgramsPortalView } from './components/ProgramsPortal/ProgramsPortalView';

const MainLayout: React.FC = () => {
  const { isAdminOpen, isProgramsPortalView, isInitialLoading, schoolInfo } = useSchool();

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center p-3 border border-slate-200 shadow-sm">
            {schoolInfo.logoUrl ? (
              <img
                src={schoolInfo.logoUrl}
                alt={schoolInfo.name || 'Эрдмийн далай'}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-xl">
                ЭД
              </div>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {schoolInfo.name || 'Эрдмийн далай'}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Мэдээлэл ачаалж байна...
            </p>
          </div>
          <div className="w-7 h-7 border-2 border-amber-500/20 border-t-amber-600 rounded-full animate-spin mt-1" />
        </div>
      </div>
    );
  }

  if (isAdminOpen) {
    return (
      <>
        <AdminDashboard />
        <AdminLoginModal />
        <ArticleModal />
      </>
    );
  }

  if (isProgramsPortalView) {
    return (
      <>
        <ProgramsPortalView />
        <ProgramDetailModal />
        <NewsDetailModal />
        <FeedbackModal />
        <ArticleModal />
        <AdminLoginModal />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-slate-800 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Slider Banner matching screenshot */}
        <HeroSlider />

        {/* 2. Horizontal Category Feature Icons */}
        <CategoryIconBar />

        {/* 3. Stay Updated with Latest News & Information */}
        <NewsSection />

        {/* 4. Stats Counter Bar */}
        <StatsSection />

        {/* 5. About the School & Core Values */}
        <AboutSection />
      </main>

      {/* 7. Warm 4-Column Branded Footer matching screenshot palette */}
      <Footer />

      {/* Modals */}
      <ProgramDetailModal />
      <NewsDetailModal />
      <FeedbackModal />
      <ArticleModal />
      <AdminLoginModal />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainLayout />
    </SchoolProvider>
  );
}
