import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Code, Ruler, Flag, Layers, Shield, Sparkles, FileText, Upload, X, MessageSquare, Share2, Moon, Sun, Menu, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastProvider, useToast } from './context/ToastContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import ProjectTracker from './components/ProjectTracker';
const DAXLibrary = lazy(() => import('./components/DAXLibrary'));
const StyleGuide = lazy(() => import('./components/StyleGuide'));
const PrototypeBuilder = lazy(() => import('./components/PrototypeBuilder'));
const SecureFilePortal = lazy(() => import('./components/SecureFilePortal'));
const PowerBIGuru = lazy(() => import('./components/PowerBIGuru'));

// Global Search/Command Palette
const CommandPalette = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands = [
    { label: 'Project Tracker', path: '/', icon: LayoutDashboard, shortcut: '⌘1' },
    { label: 'Prototype Builder', path: '/builder', icon: Layers, shortcut: '⌘2' },
    { label: 'DAX Library', path: '/dax', icon: Code, shortcut: '⌘3' },
    { label: 'Style Guide', path: '/style-guide', icon: Ruler, shortcut: '⌘4' },
    { label: 'Secure Portal', path: '/portal', icon: Shield, shortcut: '⌘5' },
    { label: 'Power BI Guru', path: '/guru', icon: Sparkles, shortcut: '⌘6' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        navigate(filteredCommands[selectedIndex].path);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full max-h-96 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <input
            type="text"
            placeholder="Search commands and navigate..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-0 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500"
            autoFocus
          />
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filteredCommands.map((cmd, index) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.path}
                onClick={() => {
                  navigate(cmd.path);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                  index === selectedIndex ? 'bg-slate-100 dark:bg-slate-700' : ''
                }`}
              >
                <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span className="flex-1 text-slate-900 dark:text-slate-100">{cmd.label}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{cmd.shortcut}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Data export/import utility
const DataManager = ({ isOpen, onClose }) => {
  const { addToast } = useToast();

  const exportData = () => {
    try {
      const data = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {}
      };

      // Export all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('guru_') || key.startsWith('pbi-') || key.includes('builder') || key.includes('notes')) {
          data.data[key] = localStorage.getItem(key);
        }
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hhs-analytics-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast('Data exported successfully', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      addToast('Failed to export data', 'error');
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (data.version && data.data) {
          // Clear existing data first
          Object.keys(data.data).forEach(key => {
            if (localStorage.getItem(key) !== null) {
              localStorage.removeItem(key);
            }
          });

          // Import new data
          Object.entries(data.data).forEach(([key, value]) => {
            localStorage.setItem(key, value);
          });

          addToast('Data imported successfully. Refresh the page to see changes.', 'success');
        } else {
          addToast('Invalid backup file format', 'error');
        }
      } catch (error) {
        console.error('Import failed:', error);
        addToast('Failed to import data', 'error');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Data Management</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Export Data</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Download all your projects, notes, and chat history as a backup file.
            </p>
            <button onClick={exportData} className="btn-primary w-full">
              📥 Export Backup
            </button>
          </div>
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Import Data</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Restore from a previously exported backup file.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="w-full text-sm file:btn-primary file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:cursor-pointer"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
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

const SidebarItem = ({ icon: Icon, label, path, shortcut }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group overflow-hidden ${isActive
        ? 'bg-white/10 dark:bg-white/5 text-white shadow-lg shadow-brand-900/20'
        : 'text-brand-100 hover:bg-white/5 dark:hover:bg-white/5 hover:text-white'
        }`}
      aria-label={`${label}${shortcut ? ` (${shortcut})` : ''}`}
      aria-current={isActive ? 'page' : undefined}
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

const Sidebar = ({ onDataManagerOpen }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  const location = useLocation();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-sidebar')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 h-10 w-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-lg flex items-center justify-center shadow-lg border border-white/20 dark:border-slate-700/20"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
      )}

      {/* Sidebar */}
      <div className={`mobile-sidebar w-72 glass-sidebar flex-shrink-0 fixed h-full z-50 flex flex-col shadow-2xl shadow-brand-900/20 transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isSidebarCollapsed ? 'lg:-translate-x-full' : 'lg:translate-x-0'}`}>
      <div className="p-8 border-b border-white/10 dark:border-slate-700/10">
        <div className="flex items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gradient-to-br from-white to-brand-100 rounded-xl flex items-center justify-center text-brand-700 font-bold text-2xl shadow-lg">
              H
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none tracking-tight">HHS Analytics</h1>
              <span className="text-xs text-brand-200 font-medium tracking-wider uppercase opacity-80 mt-1 block">Command Center</span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden h-8 w-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            aria-label="Close navigation menu"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="p-6 space-y-2 flex-1 overflow-y-auto" role="navigation" aria-label="Main navigation">
        <div className="text-xs font-semibold text-brand-300/80 uppercase tracking-widest mb-4 pl-2">Menu</div>
        <SidebarItem icon={LayoutDashboard} label="Project Tracker" path="/" shortcut="⌘1" />
        <SidebarItem icon={Layers} label="Prototype Builder" path="/builder" shortcut="⌘2" />
        <SidebarItem icon={Code} label="DAX Library" path="/dax" shortcut="⌘3" />

        <div className="text-xs font-semibold text-brand-300/80 uppercase tracking-widest mt-8 mb-4 pl-2">Tools</div>
        <SidebarItem icon={Shield} label="Secure Portal" path="/portal" shortcut="⌘4" />
        <SidebarItem icon={Sparkles} label="Power BI Guru" path="/guru" shortcut="⌘5" />
        <SidebarItem icon={Ruler} label="Style Guide" path="/style-guide" shortcut="⌘6" />
      </nav>


      <div className="p-6 border-t border-white/10 dark:border-slate-700/10 bg-black/10 dark:bg-white/5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onDataManagerOpen}
              className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold border-2 border-white/20 shadow-lg hover:scale-105 transition-transform"
              title="Data Management"
              aria-label="Open data management"
            >
              💾
            </button>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">Power BI Developer</p>
              <p className="text-xs text-brand-200 font-medium">WebFirst Analytics Lead</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Keyboard Shortcuts:
• Cmd/Ctrl+1-6: Navigate to sections
• Cmd/Ctrl+K: Search/Command palette (coming soon)
• ?: Show this help`)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-xs"
              title="Keyboard shortcuts"
              aria-label="Show keyboard shortcuts"
            >
              ⌨️
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on Guru page to avoid clutter and z-index conflicts
  if (location.pathname === '/guru') return null;

  const handleAction = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-50 flex flex-col items-end gap-3">
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
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-900 dark:text-slate-100 rounded-full shadow-xl shadow-brand-900/10 border border-white/50 dark:border-slate-600/50 hover:border-brand-300 dark:hover:border-brand-500 transition-colors whitespace-nowrap"
            >
              <span className="font-medium text-xs sm:text-sm">Ask AI Guru</span>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 flex-shrink-0">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
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
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-900 dark:text-slate-100 rounded-full shadow-xl shadow-emerald-900/10 border border-white/50 dark:border-slate-600/50 hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors whitespace-nowrap"
            >
              <span className="font-medium text-xs sm:text-sm">Share File</span>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
                <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
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
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-900 dark:text-slate-100 rounded-full shadow-xl shadow-amber-900/10 border border-white/50 dark:border-slate-600/50 hover:border-amber-300 dark:hover:border-amber-500 transition-colors whitespace-nowrap"
            >
              <span className="font-medium text-xs sm:text-sm">Share Text</span>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl z-50 touch-target ${isOpen 
          ? 'bg-slate-800 rotate-45 shadow-slate-900/20' 
          : 'bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-600/30'
        }`}
        aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
      >
        {isOpen ? <X className="h-6 w-6 sm:h-7 sm:w-7 text-white" /> : <Share2 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />}
      </motion.button>
    </div>
  );
};

const AnimatedRoutes = ({ onCommandPaletteOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle shortcuts when not typing in inputs
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      // Cmd/Ctrl + number shortcuts for navigation
      if ((event.metaKey || event.ctrlKey) && !event.shiftKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            navigate('/');
            break;
          case '2':
            event.preventDefault();
            navigate('/builder');
            break;
          case '3':
            event.preventDefault();
            navigate('/dax');
            break;
          case '4':
            event.preventDefault();
            navigate('/style-guide');
            break;
          case '5':
            event.preventDefault();
            navigate('/portal');
            break;
          case '6':
            event.preventDefault();
            navigate('/guru');
            break;
          case 'k':
            event.preventDefault();
            onCommandPaletteOpen();
            break;
        }
      }

      // Other shortcuts
      if (event.key === '?' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        // Could show keyboard shortcuts help
        alert(`Keyboard Shortcuts:
• Cmd/Ctrl+1-6: Navigate to sections
• Cmd/Ctrl+K: Search/Command palette (coming soon)
• ?: Show this help`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      }>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><ProjectTracker /></PageTransition>} />
          <Route path="/builder" element={<PageTransition><PrototypeBuilder /></PageTransition>} />
          <Route path="/dax" element={<PageTransition><DAXLibrary /></PageTransition>} />
          <Route path="/style-guide" element={<PageTransition><StyleGuide /></PageTransition>} />
          <Route path="/portal" element={<PageTransition><SecureFilePortal /></PageTransition>} />
          <Route path="/guru" element={<PageTransition><PowerBIGuru /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gradient-subtle dark:bg-gradient-subtle-dark text-slate-900 dark:text-slate-100 font-sans">
      <Sidebar onDataManagerOpen={() => setIsDataManagerOpen(true)} />
      <DataManager isOpen={isDataManagerOpen} onClose={() => setIsDataManagerOpen(false)} />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      
      {/* Show Sidebar Button (when collapsed on desktop) */}
      {isSidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex fixed top-4 left-4 z-40 h-10 w-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-lg items-center justify-center shadow-lg border border-white/20 dark:border-slate-700/20 hover:bg-white dark:hover:bg-slate-700 transition-all hover:scale-110"
          aria-label="Show sidebar"
          title="Show sidebar"
        >
          <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        </button>
      )}

      {/* Main Content */}
      <div className={`flex-1 relative z-0 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-72'}`}>
              {/* Trust Bar */}
              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60 pl-16 pr-4 lg:px-8 py-2 sticky top-0 z-10 transition-all">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 max-w-5xl mx-auto">
                  <Flag className="h-3 w-3 text-brand-600" />
                  <span className="hidden sm:inline">An official website of the United States government</span>
                  <span className="sm:hidden">Official U.S. Government Site</span>
                </div>
              </div>

              <main className="p-4 lg:p-10 max-w-6xl mx-auto pb-32">
                <AnimatedRoutes onCommandPaletteOpen={() => setIsCommandPaletteOpen(true)} />
                <QuickActions />
              </main>
            </div>
          </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SidebarProvider>
          <Router>
            <AppContent />
          </Router>
        </SidebarProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
