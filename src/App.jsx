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

// Page Transition Wrapper
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const SidebarItem = ({ icon: Icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group overflow-hidden ${isActive
        ? 'bg-white/10 text-white shadow-lg shadow-brand-900/20'
        : 'text-brand-100 hover:bg-white/5 hover:text-white'
        }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeSidebar"
          className="absolute left-0 top-0 bottom-0 w-1 bg-brand-400 rounded-r-full"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110 text-brand-300' : 'group-hover:scale-110'}`} />
      <span className="font-medium tracking-wide">{label}</span>
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
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('/guru')}
              className="flex items-center gap-3 px-5 py-3 bg-white/90 backdrop-blur-md text-slate-900 rounded-full shadow-xl shadow-brand-900/10 border border-white/50 hover:border-brand-300 transition-colors"
            >
              <span className="font-medium text-sm">Ask AI Guru</span>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ delay: 0.05 }}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('/portal')}
              className="flex items-center gap-3 px-5 py-3 bg-white/90 backdrop-blur-md text-slate-900 rounded-full shadow-xl shadow-emerald-900/10 border border-white/50 hover:border-emerald-300 transition-colors"
            >
              <span className="font-medium text-sm">Share File</span>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Upload className="h-5 w-5" />
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction('/portal?tab=encrypt')}
              className="flex items-center gap-3 px-5 py-3 bg-white/90 backdrop-blur-md text-slate-900 rounded-full shadow-xl shadow-amber-900/10 border border-white/50 hover:border-amber-300 transition-colors"
            >
              <span className="font-medium text-sm">Share Text</span>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                <FileText className="h-5 w-5" />
              </div>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl z-50 ${isOpen 
          ? 'bg-slate-800 rotate-45 shadow-slate-900/20' 
          : 'bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-600/30'
        }`}
      >
        {isOpen ? <X className="h-7 w-7 text-white" /> : <Share2 className="h-7 w-7 text-white" />}
      </motion.button>
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><ProjectTracker /></PageTransition>} />
        <Route path="/builder" element={<PageTransition><PrototypeBuilder /></PageTransition>} />
        <Route path="/dax" element={<PageTransition><DAXLibrary /></PageTransition>} />
        <Route path="/style-guide" element={<PageTransition><StyleGuide /></PageTransition>} />
        <Route path="/portal" element={<PageTransition><SecureFilePortal /></PageTransition>} />
        <Route path="/guru" element={<PageTransition><PowerBIGuru /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <div className="flex min-h-screen bg-gradient-subtle text-slate-900 font-sans">
          {/* Glassmorphism Sidebar */}
          <div className="w-72 glass-sidebar flex-shrink-0 fixed h-full z-20 flex flex-col shadow-2xl shadow-brand-900/20">
            <div className="p-8 border-b border-white/10">
              <div className="flex items-center gap-4 text-white">
                <div className="h-12 w-12 bg-gradient-to-br from-white to-brand-100 rounded-xl flex items-center justify-center text-brand-700 font-bold text-2xl shadow-lg">
                  H
                </div>
                <div>
                  <h1 className="font-bold text-xl leading-none tracking-tight">HHS Analytics</h1>
                  <span className="text-xs text-brand-200 font-medium tracking-wider uppercase opacity-80 mt-1 block">Command Center</span>
                </div>
              </div>
            </div>

            <nav className="p-6 space-y-2 flex-1 overflow-y-auto">
              <div className="text-xs font-semibold text-brand-300/80 uppercase tracking-widest mb-4 pl-2">Menu</div>
              <SidebarItem icon={LayoutDashboard} label="Project Tracker" path="/" />
              <SidebarItem icon={Layers} label="Prototype Builder" path="/builder" />
              <SidebarItem icon={Code} label="DAX Library" path="/dax" />
              
              <div className="text-xs font-semibold text-brand-300/80 uppercase tracking-widest mt-8 mb-4 pl-2">Tools</div>
              <SidebarItem icon={Shield} label="Secure Portal" path="/portal" />
              <SidebarItem icon={Sparkles} label="Power BI Guru" path="/guru" />
              <SidebarItem icon={Palette} label="Style Guide" path="/style-guide" />
            </nav>

            <div className="p-6 border-t border-white/10 bg-black/10 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-bold border-2 border-white/20 shadow-lg">
                  WA
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-wide">Will Alston</p>
                  <p className="text-xs text-brand-200 font-medium">WebFirst Analytics Lead</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-72 relative z-0">
            {/* Trust Bar */}
            <div className="bg-white/50 backdrop-blur-md border-b border-slate-200/60 px-8 py-2 sticky top-0 z-10">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 max-w-5xl mx-auto">
                <Flag className="h-3 w-3 text-brand-600" />
                <span>An official website of the United States government</span>
              </div>
            </div>

            <main className="p-10 max-w-6xl mx-auto pb-32">
              <AnimatedRoutes />
              <QuickActions />
            </main>
          </div>
        </div>
      </Router>
    </ToastProvider>
  );
};

export default App;
