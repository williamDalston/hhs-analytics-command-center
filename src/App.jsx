import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Code, Palette, Flag, Layers, Shield, Sparkles, FileText, Upload, X, MessageSquare, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DAXLibrary from './components/DAXLibrary';
import StyleGuide from './components/StyleGuide';
import ProjectTracker from './components/ProjectTracker';
import PrototypeBuilder from './components/PrototypeBuilder';
import SecureFilePortal from './components/SecureFilePortal';
import PowerBIGuru from './components/PowerBIGuru';
import { ToastProvider } from './context/ToastContext';

const SidebarItem = ({ icon: Icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
        ? 'bg-brand-800 text-white shadow-md'
        : 'text-brand-100 hover:bg-brand-800/50 hover:text-white'
        }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction('/guru')}
              className="flex items-center gap-3 px-4 py-2 bg-white text-slate-900 rounded-full shadow-refined-md border border-slate-200 hover:shadow-refined-lg hover:border-brand-300 transition-all duration-300"
            >
              <span className="font-medium text-sm">Ask AI Guru</span>
              <div className="h-10 w-10 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-brand">
                <Sparkles className="h-5 w-5" />
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ delay: 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction('/portal')}
              className="flex items-center gap-3 px-4 py-2 bg-white text-slate-900 rounded-full shadow-refined-md border border-slate-200 hover:shadow-refined-lg hover:border-emerald-300 transition-all duration-300"
            >
              <span className="font-medium text-sm">Share File</span>
              <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Upload className="h-5 w-5" />
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction('/portal?tab=encrypt')}
              className="flex items-center gap-3 px-4 py-2 bg-white text-slate-900 rounded-full shadow-refined-md border border-slate-200 hover:shadow-refined-lg hover:border-amber-300 transition-all duration-300"
            >
              <span className="font-medium text-sm">Share Text</span>
              <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-slate-800 rotate-45 shadow-refined-lg' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-lg hover:shadow-refined-xl hover:scale-105'
          }`}
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Share2 className="h-6 w-6 text-white" />}
      </button>
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
          {/* Sidebar */}
          <div className="w-64 bg-brand-900 border-r border-brand-800 flex-shrink-0 fixed h-full z-10">
            <div className="p-6 border-b border-brand-800">
              <div className="flex items-center gap-3 text-white">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-brand-900 font-bold text-xl">
                  H
                </div>
                <div>
                  <h1 className="font-bold text-lg leading-none">HHS Analytics</h1>
                  <span className="text-xs text-brand-200 font-medium">Command Center</span>
                </div>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              <SidebarItem icon={LayoutDashboard} label="Project Tracker" path="/" />
              <SidebarItem icon={Layers} label="Prototype Builder" path="/builder" />
              <SidebarItem icon={Code} label="DAX Library" path="/dax" />
              <SidebarItem icon={Palette} label="Style Guide" path="/style-guide" />
              <SidebarItem icon={Shield} label="Secure Portal" path="/portal" />
              <SidebarItem icon={Sparkles} label="Power BI Guru" path="/guru" />
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-brand-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold border-2 border-brand-600">
                  WA
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Will Alston</p>
                  <p className="text-xs text-brand-300">WebFirst Analytics Lead</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-64">
            {/* Trust Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-8 py-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 max-w-5xl mx-auto">
                <Flag className="h-3 w-3" />
                <span>An official website of the United States government</span>
              </div>
            </div>

            <main className="p-8 max-w-5xl mx-auto relative">
              <Routes>
                <Route path="/" element={<ProjectTracker />} />
                <Route path="/builder" element={<PrototypeBuilder />} />
                <Route path="/dax" element={<DAXLibrary />} />
                <Route path="/style-guide" element={<StyleGuide />} />
                <Route path="/portal" element={<SecureFilePortal />} />
                <Route path="/guru" element={<PowerBIGuru />} />
              </Routes>
              <QuickActions />
            </main>
          </div>
        </div>
      </Router>
    </ToastProvider>
  );
};

export default App;
