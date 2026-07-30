import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Listing } from './types';
import { DEMO_OWNER, DEMO_ADMIN, INITIAL_LISTINGS, ALL_AMENITIES, ALL_LOCATIONS } from './mockData';
import PropertyCard from './components/PropertyCard';
import PropertyForm from './components/PropertyForm';
import PropertyDetailDrawer from './components/PropertyDetailDrawer';
import DashboardView from './components/DashboardView';
import { formatCurrency, convertValue } from './utils';
import { t, translateListing, translateLocation, translateAmenity } from './translations';
import { 
  fetchProperties, 
  createPropertyApi, 
  updatePropertyStatusApi, 
  deletePropertyApi, 
  syncUserApi, 
  checkApiHealth 
} from './api';
import { 
  subscribeToAuthState, 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  logoutUser, 
  isFirebaseConfigured 
} from './firebase';
import { 
  Building, 
  Search, 
  SlidersHorizontal, 
  Menu, 
  X, 
  CheckCircle, 
  User as UserIcon, 
  ClipboardList, 
  Plus, 
  ShieldAlert, 
  Check, 
  ChevronRight, 
  ArrowUpRight,
  LogOut,
  UserCheck,
  Database,
  Key,
  Info
} from 'lucide-react';

const HERO_CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1548263591-19059f0f7761?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80"
];

export default function App() {
  // --- Persistent & DB State hooks ---
  const [users, setUsers] = useState<User[]>(() => {
    const cached = localStorage.getItem('prime_users');
    return cached ? JSON.parse(cached) : [DEMO_OWNER, DEMO_ADMIN];
  });

  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const cached = localStorage.getItem('prime_current_user');
    return cached ? JSON.parse(cached) : DEMO_OWNER;
  });

  // Database & Firebase connection status flags
  const [isLiveDb, setIsLiveDb] = useState<boolean>(false);
  const [isFirebaseReady, setIsFirebaseReady] = useState<boolean>(isFirebaseConfigured());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load properties from API backend / Neon Postgres
  const loadPropertiesFromApi = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProperties();
      if (data.listings && data.listings.length > 0) {
        setListings(data.listings);
      } else {
        setListings(INITIAL_LISTINGS);
      }
      setIsLiveDb(data.isLiveDb);
    } catch (err) {
      console.warn('Falling back to local listings:', err);
      setListings(INITIAL_LISTINGS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPropertiesFromApi();

    // Check backend DB status
    checkApiHealth().then(health => {
      setIsLiveDb(health.dbConnected);
    });
  }, []);

  // Firebase auth state subscription
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (fbUser) => {
      if (fbUser) {
        const syncedUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '+212 600-000000',
          avatar: fbUser.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80`,
          role: 'owner'
        };

        setCurrentUser(syncedUser);
        try {
          await syncUserApi(syncedUser);
        } catch (e) {
          console.warn('Local user sync active');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('prime_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('prime_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // --- Translation State ---
  const [lang, setLang] = useState<'en' | 'fr'>(() => {
    const cached = localStorage.getItem('prime_lang');
    return (cached === 'en' || cached === 'fr') ? cached : 'en';
  });

  useEffect(() => {
    localStorage.setItem('prime_lang', lang);
  }, [lang]);

  // --- Currency States ---
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
  const [eurRate, setEurRate] = useState<number>(0.895);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/exchange-rate');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.EUR === 'number') {
            setEurRate(data.EUR);
          }
        }
      } catch (err) {
        console.warn("Failed fetching live market exchange rates, caching presets:", err);
      }
    };
    fetchRates();
  }, []);

  // --- Filtering State hooks ---
  const [activeTab, setActiveTab] = useState<'catalog' | 'dashboard'>('catalog');
  const [activeSegment, setActiveSegment] = useState<'buy' | 'rent'>('buy');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [bedroomsFilter, setBedroomsFilter] = useState<number | 'All'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    return activeSegment === 'buy' ? 2000000 : 8000;
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Responsive view states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewListingForm, setShowNewListingForm] = useState(false);
  const [expandedListing, setExpandedListing] = useState<Listing | null>(null);

  // Auth / Registration Dialog State
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'owner' | 'admin'>('owner');
  const [authError, setAuthError] = useState<string>('');

  useEffect(() => {
    const baseValue = activeSegment === 'buy' ? 2000000 : 8000;
    setMaxPrice(currency === 'EUR' ? Math.round(baseValue * eurRate) : baseValue);
  }, [activeSegment, currency, eurRate]);

  // Carousel timer
  const [heroImgIndex, setHeroImgIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroImgIndex((prev) => (prev + 1) % HERO_CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auth Submit Handler (Firebase + Fallback)
  const handleRegisterAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (isFirebaseConfigured() && regEmail && regPassword) {
      try {
        if (authMode === 'register') {
          const fbUser = await registerWithEmail(regEmail, regPassword);
          const newUser: User = {
            id: fbUser.uid,
            name: regName || regEmail.split('@')[0],
            email: regEmail,
            phone: regPhone || '+212 600-000000',
            avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&w=120&h=120&q=80`,
            role: regRole
          };
          await syncUserApi(newUser);
          setCurrentUser(newUser);
        } else {
          await loginWithEmail(regEmail, regPassword);
        }
        setShowRegisterDialog(false);
        return;
      } catch (err: any) {
        console.error('Firebase Auth error:', err);
        setAuthError(err?.message || 'Authentication failed');
      }
    }

    // Fallback Account creation if Firebase env vars are unpopulated
    if (!regName || !regEmail) return;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: regName,
      email: regEmail,
      phone: regPhone || '+212 600-000000',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&w=120&h=120&q=80`,
      role: regRole
    };

    try {
      await syncUserApi(newUser);
    } catch (e) {
      console.warn('Synced locally');
    }

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setShowRegisterDialog(false);
  };

  const handleGoogleAuth = async () => {
    if (isFirebaseConfigured()) {
      try {
        await loginWithGoogle();
        setShowRegisterDialog(false);
      } catch (err: any) {
        setAuthError(err?.message || 'Google authentication failed');
      }
    } else {
      alert("Firebase configuration variables (VITE_FIREBASE_API_KEY) are empty in .env. Please populate them to enable live Google Auth.");
    }
  };

  // Add Property (API / DB integration)
  const handleAddProperty = async (propertyData: Omit<Listing, 'id' | 'status' | 'ownerId' | 'createdAt' | 'approvedByAdminId'>) => {
    const newProperty: Listing = {
      ...propertyData,
      id: `prop-${Date.now()}`,
      status: currentUser.role === 'admin' ? 'approved' : 'pending',
      ownerId: currentUser.id,
      createdAt: new Date().toISOString(),
      approvedByAdminId: currentUser.role === 'admin' ? currentUser.id : undefined
    };

    try {
      const res = await createPropertyApi(newProperty);
      setListings(prev => [res.listing, ...prev]);
      if (res.isLiveDb) setIsLiveDb(true);
    } catch (err) {
      console.warn('Saving property locally:', err);
      setListings(prev => [newProperty, ...prev]);
    }
  };

  // Approve / Reject Property (API / DB integration)
  const handleApproveListing = async (listingId: string, adminId: string) => {
    setListings(prev => prev.map(listing => {
      if (listing.id === listingId) {
        return { ...listing, status: 'approved', approvedByAdminId: adminId };
      }
      return listing;
    }));

    try {
      await updatePropertyStatusApi(listingId, 'approved', adminId);
    } catch (err) {
      console.warn('Updated listing approval locally');
    }
  };

  const handleRejectListing = async (listingId: string) => {
    setListings(prev => prev.map(listing => {
      if (listing.id === listingId) {
        return { ...listing, status: 'rejected' };
      }
      return listing;
    }));

    try {
      await updatePropertyStatusApi(listingId, 'rejected');
    } catch (err) {
      console.warn('Updated listing rejection locally');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedLocation('All');
    setBedroomsFilter('All');
    setSelectedAmenities([]);
    setMaxPrice(activeSegment === 'buy' ? 2000000 : 8000);
  };

  const switchDemoAccount = (user: User) => {
    setCurrentUser(user);
    setMobileMenuOpen(false);
  };

  const handleUpdateProfile = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    try {
      await syncUserApi(updatedUser);
    } catch (e) {
      console.warn('Updated profile locally');
    }
  };

  // Filter listings
  const filteredListings = listings.filter(item => {
    if (item.status !== 'approved') return false;
    if (item.type !== activeSegment) return false;

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesDesc = item.description.toLowerCase().includes(query);
      const matchesLoc = item.location.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
    }

    if (selectedLocation !== 'All' && item.location !== selectedLocation) return false;

    if (bedroomsFilter !== 'All') {
      if (bedroomsFilter === 4) {
        if (item.bedrooms < 4) return false;
      } else {
        if (item.bedrooms !== bedroomsFilter) return false;
      }
    }

    const valuationInActiveCurrency = currency === 'EUR' ? item.price * eurRate : item.price;
    if (valuationInActiveCurrency > maxPrice) return false;

    if (selectedAmenities.length > 0) {
      const hasAll = selectedAmenities.every(amenity => item.amenities.includes(amenity));
      if (!hasAll) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#030303] text-slate-100 font-sans flex flex-col antialiased">
      
      {/* VERCEL, NEON DB & FIREBASE LIVE CONFIGURATION STATUS DISCLAIMER BANNER */}
      <div className="bg-gradient-to-r from-[#0c0c0c] via-[#11160a] to-[#0c0c0c] border-b border-neutral-850 px-4 py-2 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-slate-300">
          <div className="flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-brand shrink-0" />
            <span>
              <strong>VERCEL & NEON DB INTEGRATION STATUS:</strong>{' '}
              {isLiveDb ? (
                <span className="text-[#a6fe00] font-semibold">🟢 Connected to Live Neon PostgreSQL</span>
              ) : (
                <span className="text-amber-400 font-semibold">🟡 DATABASE_URL is empty — running in fallback mode with demo data</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>
              Firebase Auth:{' '}
              {isFirebaseReady ? (
                <span className="text-[#a6fe00]">🟢 Active</span>
              ) : (
                <span className="text-slate-400">⚪ Unconfigured in .env</span>
              )}
            </span>
            <span className="opacity-50">|</span>
            <span className="text-slate-300">Deploy ready on Vercel 🚀</span>
          </div>
        </div>
      </div>

      {/* Sticky Demo Controller Strip */}
      <div className="bg-[#0c0c0c] border-b border-neutral-900 py-2 px-4 sticky top-0 z-40 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse" />
            <span className="font-mono text-[11px] text-slate-400">AUTHENTICATED PERSONA:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400">Quick Switcher:</span>
            <button
              onClick={() => switchDemoAccount(DEMO_OWNER)}
              className={`px-2.5 py-1 rounded-md border font-mono tracking-tight transition-all ${currentUser.id === DEMO_OWNER.id ? 'bg-brand/10 border-brand text-brand font-medium' : 'bg-transparent border-neutral-800 text-slate-400 hover:text-white'}`}
            >
              👤 Owner (Lucas)
            </button>
            <button
              onClick={() => switchDemoAccount(DEMO_ADMIN)}
              className={`px-2.5 py-1 rounded-md border font-mono tracking-tight transition-all ${currentUser.id === DEMO_ADMIN.id ? 'bg-brand/10 border-brand text-brand font-medium' : 'bg-transparent border-neutral-800 text-slate-400 hover:text-white'}`}
            >
              🛡️ Team Admin (Marcus)
            </button>
            <button
              onClick={() => setShowRegisterDialog(true)}
              className="px-2.5 py-1 rounded-md border border-dashed border-slate-600/50 font-mono text-slate-300 hover:border-brand/40 hover:text-brand transition-all"
            >
              + Login / Register (Firebase)
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b border-neutral-900 bg-[#030303]/90 backdrop-blur-md py-4 px-4 sticky top-10 z-35">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="text-[#a6fe00] font-sans text-xl font-black tracking-tighter flex items-center gap-1 leading-none uppercase select-none">
              PRIME ESTATES
              <span className="h-2 w-2 bg-brand rounded-full inline-block" />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <div className="flex bg-neutral-900/60 p-1 rounded-xl border border-neutral-850 text-xs font-mono">
              <button
                id="header-nav-buy"
                onClick={() => {
                  setActiveTab('catalog');
                  setActiveSegment('buy');
                }}
                className={`px-4 py-1.5 rounded-lg transition-all ${activeTab === 'catalog' && activeSegment === 'buy' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-450 hover:text-slate-200'}`}
              >
                {lang === 'fr' ? 'Acheter' : 'Buy (Catalog)'}
              </button>
              <button
                id="header-nav-rent"
                onClick={() => {
                  setActiveTab('catalog');
                  setActiveSegment('rent');
                }}
                className={`px-4 py-1.5 rounded-lg transition-all ${activeTab === 'catalog' && activeSegment === 'rent' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-450 hover:text-slate-200'}`}
              >
                {lang === 'fr' ? 'Louer' : 'Rent (Catalog)'}
              </button>
            </div>
          </nav>

          {/* Currency & Language Switchers */}
          <div className="hidden md:flex items-center gap-3">
            <div className="bg-neutral-900/65 p-1 rounded-xl border border-neutral-850 text-xs font-mono select-none">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${currency === 'USD' ? 'bg-brand text-[#030303]' : 'text-slate-400 hover:text-slate-100'}`}
              >
                USD $
              </button>
              <button
                onClick={() => setCurrency('EUR')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${currency === 'EUR' ? 'bg-brand text-[#030303]' : 'text-slate-400 hover:text-slate-100'}`}
              >
                EUR €
              </button>
            </div>

            <div className="bg-neutral-900/65 p-1 rounded-xl border border-neutral-850 text-xs font-mono select-none">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${lang === 'en' ? 'bg-brand text-[#030303]' : 'text-slate-400 hover:text-slate-100'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${lang === 'fr' ? 'bg-brand text-[#030303]' : 'text-slate-400 hover:text-slate-100'}`}
              >
                FR
              </button>
            </div>
          </div>

          {/* User Status Profile Button */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              id="user-profile-header-btn"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 bg-[#0c0c0c] hover:bg-neutral-900 border border-neutral-800 p-1.5 pr-3 rounded-full text-left transition-all group"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="h-7 w-7 rounded-full border border-brand/20 object-cover group-hover:border-brand transition-all" 
              />
              <div className="text-left">
                <p className="text-[11.5px] font-semibold text-slate-100 group-hover:text-brand leading-tight transition-colors line-clamp-1">{currentUser.name}</p>
                <p className="text-[9px] font-mono leading-none tracking-wider uppercase text-slate-400">
                  {currentUser.role === 'admin' ? '🛡️ Admin' : '👤 Owner'}
                </p>
              </div>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-neutral-900 text-slate-300 hover:text-brand border border-neutral-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'dashboard' ? (
        <motion.div 
          key="dashboard-tab"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8"
        >
          <DashboardView
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            listings={listings}
            onApprove={handleApproveListing}
            onReject={handleRejectListing}
            onSelectListing={setExpandedListing}
            onAddListing={() => setShowNewListingForm(true)}
            currency={currency}
            eurRate={eurRate}
            lang={lang}
          />
        </motion.div>
      ) : (
        <motion.div
          key="catalog-tab"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Hero Banner */}
          <section className="relative overflow-hidden pt-12 pb-12 px-4 text-center border-b border-neutral-900/40 min-h-[360px] flex items-center justify-center">
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={heroImgIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${HERO_CAROUSEL_IMAGES[heroImgIndex]})` }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/15 z-1" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#0a0a0a]/65 z-1" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto bg-black/65 border border-white/20 backdrop-blur-lg p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl space-y-4 animate-fade-in">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a6fe00]/15 border border-[#a6fe00]/30 text-[11px] font-mono uppercase tracking-widest text-brand font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                {lang === 'fr' ? 'Plateforme Immobilière Vercel & Neon Database' : 'Vercel & Neon Database Real-Estate Platform'}
              </span>
              <h1 className="text-2xl md:text-3xl font-sans tracking-tight font-extrabold text-white leading-tight">
                {lang === 'fr' ? 'Demeures Minimalistes' : 'Minimalist Shelters'} <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#fafdfb] to-brand">
                  {lang === 'fr' ? 'Pour un Mode de Vie Pur et Organique' : 'For Pure Organic Living'}
                </span>
              </h1>
              <p className="text-xs md:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
                {lang === 'fr' 
                  ? "Soumettez votre propriété d'élite avec un stockage Neon DB réel et une authentification Firebase." 
                  : "Submit your elite real estate listing backed by real Neon DB storage and Firebase authentication."}
              </p>
            </div>
          </section>

          {/* Main Workplace Frame */}
          <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full flex-grow">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-450" />
                  <input
                    type="text"
                    id="property-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={lang === 'fr' ? 'Rechercher par quartier, style architectural...' : 'Search by neighborhood, architectural style...'}
                    className="w-full bg-[#0c0c0c] border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center gap-2 rounded-xl text-xs font-mono px-4 py-2.5 border bg-[#0c0c0c] border-neutral-800 text-slate-350 hover:text-white"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    {lang === 'fr' ? 'Filtres' : 'Filters'}
                  </button>

                  <button
                    onClick={() => setShowNewListingForm(true)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-brand font-mono text-[#030303] font-bold text-xs px-4 py-2.5 hover:shadow-[0_0_15px_rgba(166,254,0,0.3)] transition-all w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 shrink-0" />
                    {lang === 'fr' ? 'Publier un bien' : 'Submit Property'}
                  </button>
                </div>
              </div>

              {/* Property Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <PropertyCard
                    key={listing.id}
                    listing={translateListing(listing, lang)}
                    currentUser={currentUser}
                    onSelect={() => setExpandedListing(listing)}
                    currency={currency}
                    eurRate={eurRate}
                    lang={lang}
                  />
                ))}
              </div>
            </div>
          </main>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-[#030303] py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>PRIME RESIDENTIA & BROKERAGE SYSTEM © 2026 — VERCEL & NEON DB COMPATIBLE</p>
        </div>
      </footer>

      {/* Property Form Modal */}
      {showNewListingForm && (
        <PropertyForm
          currentUser={currentUser}
          onAddListing={handleAddProperty}
          onClose={() => setShowNewListingForm(false)}
          currency={currency}
          eurRate={eurRate}
          lang={lang}
        />
      )}

      {/* Auth Modal */}
      <AnimatePresence>
        {showRegisterDialog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030303]/85 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.93, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.93, y: 15, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl bg-[#0c0c0c] border border-neutral-850 p-6 text-slate-200 shadow-2xl"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  {authMode === 'register' ? 'Firebase / Neon Auth Signup' : 'Firebase Login'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {isFirebaseReady 
                    ? 'Connected to Firebase Authentication' 
                    : 'Firebase keys empty in .env — create local demo identity below'}
                </p>
              </div>

              {authError && (
                <div className="mb-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {authError}
                </div>
              )}

              <div className="space-y-3 mb-4 pb-4 border-b border-neutral-850">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-2 bg-[#141414] hover:bg-[#1a1a1a] hover:text-white border border-neutral-850 rounded-xl py-2 px-3 text-xs font-mono transition-all text-slate-300"
                >
                  <span className="text-amber-500 font-bold">G</span> Sign in with Google (Firebase)
                </button>
              </div>

              <form onSubmit={handleRegisterAccount} className="space-y-3.5">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Eleanor Vance"
                      className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-brand focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-brand focus:outline-none"
                  />
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Account Role</label>
                    <div className="grid grid-cols-2 gap-2 bg-[#030303] p-1 rounded-xl border border-neutral-850">
                      <button
                        type="button"
                        onClick={() => setRegRole('owner')}
                        className={`py-1.5 rounded-lg text-[10px] font-mono ${regRole === 'owner' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-450'}`}
                      >
                        👤 Owner
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegRole('admin')}
                        className={`py-1.5 rounded-lg text-[10px] font-mono ${regRole === 'admin' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-450'}`}
                      >
                        🛡️ Admin
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
                    className="text-[10px] font-mono text-brand hover:underline"
                  >
                    {authMode === 'register' ? 'Already have an account? Login' : 'Need an account? Register'}
                  </button>
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-neutral-850 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setShowRegisterDialog(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-brand text-[#030303] font-bold"
                  >
                    {authMode === 'register' ? 'Submit' : 'Login'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Property Drawer */}
      <AnimatePresence>
        {expandedListing && (
          <PropertyDetailDrawer
            listing={translateListing(expandedListing, lang)}
            currentUser={currentUser}
            adminUser={users.find(u => u.id === expandedListing.approvedByAdminId) || DEMO_ADMIN}
            onClose={() => setExpandedListing(null)}
            currency={currency}
            eurRate={eurRate}
            lang={lang}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
