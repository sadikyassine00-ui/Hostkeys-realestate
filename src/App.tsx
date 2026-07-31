import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Listing } from './types';
import { ALL_AMENITIES, ALL_LOCATIONS, SUPER_ADMIN_EMAIL, DEFAULT_SUPER_ADMIN } from './mockData';
import PropertyCard from './components/PropertyCard';
import PropertyForm from './components/PropertyForm';
import PropertyDetailDrawer from './components/PropertyDetailDrawer';
import DashboardView from './components/DashboardView';
import Toast, { ToastMessage } from './components/Toast';
import { formatCurrency, convertValue, Currency } from './utils';
import { t, translateListing, translateLocation, translateAmenity } from './translations';
import { 
  fetchProperties, 
  createPropertyApi, 
  updatePropertyStatusApi, 
  deletePropertyApi, 
  syncUserApi, 
  checkApiHealth,
  fetchPublicAgentsApi 
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
  Info,
  Sparkles
} from 'lucide-react';

const HERO_CAROUSEL_IMAGES = [
  "/assets/gallery-images/agadir.jpg",
  "/assets/gallery-images/ait-ben-haddou.jpg",
  "/assets/gallery-images/chefchaouen.jpg",
  "/assets/gallery-images/tangier.webp"
];

export default function App() {
  // --- Auth & Persistent State hooks ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('hostkeys_logged_in') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('hostkeys_current_user');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return localStorage.getItem('hostkeys_logged_in') === 'true' ? DEFAULT_SUPER_ADMIN : null;
  });

  const [listings, setListings] = useState<Listing[]>([]);

  const [users, setUsers] = useState<User[]>([DEFAULT_SUPER_ADMIN]);

  // Database & Firebase connection status flags
  const [isLiveDb, setIsLiveDb] = useState<boolean>(false);
  const [isFirebaseReady, setIsFirebaseReady] = useState<boolean>(isFirebaseConfigured());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Toast Notification State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load properties from API backend / Neon Postgres
  const loadPropertiesFromApi = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProperties();
      const fetchedListings = Array.isArray(data?.listings) ? data.listings : [];
      setListings(fetchedListings);
      localStorage.setItem('hostkeys_cached_listings', JSON.stringify(fetchedListings));
      if (typeof data?.isLiveDb === 'boolean') {
        setIsLiveDb(data.isLiveDb);
      }
    } catch (err) {
      console.warn('Failed to load properties from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPropertiesFromApi();

    // Fetch live assigned agents from DB backend for multi-browser consistency
    fetchPublicAgentsApi().then(publicAgents => {
      if (publicAgents && publicAgents.length > 0) {
        setUsers(prev => {
          const mergedMap = new Map<string, User>();
          prev.forEach(u => mergedMap.set(u.email, u));
          publicAgents.forEach(u => mergedMap.set(u.email, u));
          const updated = Array.from(mergedMap.values());
          localStorage.setItem('hostkeys_all_users', JSON.stringify(updated));
          return updated;
        });
      }
    });

    checkApiHealth().then(health => {
      setIsLiveDb(health.dbConnected);
    });
  }, []);

  // Firebase auth state subscription
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (fbUser) => {
      if (fbUser) {
        const userEmail = fbUser.email || '';
        const defaultRole = userEmail === SUPER_ADMIN_EMAIL ? 'superadmin' : 'owner';
        const rawUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || userEmail.split('@')[0] || 'User',
          email: userEmail,
          phone: fbUser.phoneNumber || '+212 600-000000',
          avatar: fbUser.photoURL || '',
          role: defaultRole,
          isAgent: userEmail === SUPER_ADMIN_EMAIL,
          languages: userEmail === SUPER_ADMIN_EMAIL ? ['FR', 'EN', 'AR'] : []
        };

        let resolvedUser: User = rawUser;

        try {
          const syncRes = await syncUserApi(rawUser);
          // Always use the DB-returned user if we got one — isLiveDb=false means DB is offline
          // but the user object is still returned with local fallback. Use DB role if available.
          if (syncRes && syncRes.user && syncRes.user.email) {
            resolvedUser = {
              ...rawUser,
              ...syncRes.user,
              // Always keep Firebase photo/name (DB may not store latest)
              avatar: rawUser.avatar || syncRes.user.avatar || '',
              name: rawUser.name || syncRes.user.name || 'User',
            };
          }
        } catch (e) {
          console.warn('DB sync failed, using Firebase auth data only');
        }

        setCurrentUser(resolvedUser);
        setIsLoggedIn(true);
        localStorage.setItem('hostkeys_logged_in', 'true');
        localStorage.setItem('hostkeys_current_user', JSON.stringify(resolvedUser));

        setUsers(prev => {
          const exists = prev.some(u => u && u.email === resolvedUser.email);
          const updated = exists
            ? prev.map(u => u && u.email === resolvedUser.email ? { ...u, ...resolvedUser } : u)
            : [...prev, resolvedUser];
          localStorage.setItem('hostkeys_all_users', JSON.stringify(updated));
          return updated;
        });
      } else {
        // fbUser is null — user signed out
        setCurrentUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('hostkeys_logged_in');
        localStorage.removeItem('hostkeys_current_user');
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-redirect if already logged in when visiting auth modal
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  useEffect(() => {
    if (isLoggedIn && showRegisterDialog) {
      setShowRegisterDialog(false);
      setActiveTab('dashboard');
    }
  }, [isLoggedIn, showRegisterDialog]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {}
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('hostkeys_logged_in');
    localStorage.removeItem('hostkeys_current_user');
    setActiveTab('catalog');
  };

  // --- Translation State ---
  const [lang, setLang] = useState<'en' | 'fr'>(() => {
    const cached = localStorage.getItem('hostkeys_lang');
    return (cached === 'en' || cached === 'fr') ? cached : 'en';
  });

  useEffect(() => {
    localStorage.setItem('hostkeys_lang', lang);
  }, [lang]);

  // --- Currency States ---
  const [currency, setCurrency] = useState<Currency>('MAD');
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
      } catch (err) {}
    };
    fetchRates();
  }, []);

  // --- Filtering State hooks ---
  const [activeTab, setActiveTab] = useState<'catalog' | 'dashboard'>('catalog');
  const [activeSegment, setActiveSegment] = useState<'buy' | 'rent'>('buy');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [bedroomsFilter, setBedroomsFilter] = useState<number | 'All'>('All');
  const [bathroomsFilter, setBathroomsFilter] = useState<number | 'All'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    return activeSegment === 'buy' ? 20000000 : 80000;
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Registered website admin agents from API
  const [fetchedAgents, setFetchedAgents] = useState<User[]>([]);

  useEffect(() => {
    fetchPublicAgentsApi().then(agents => {
      if (agents && Array.isArray(agents)) {
        setFetchedAgents(agents);
      }
    });
  }, []);

  // Dynamically compute real active site agents (Super Admin + any promoted Admins strictly)
  const getActiveSiteAgents = (): User[] => {
    const superAdminInUsers = users.find(u => u && u.email === SUPER_ADMIN_EMAIL);
    const currentSuperAdmin: User = (currentUser && currentUser.email === SUPER_ADMIN_EMAIL)
      ? currentUser
      : (superAdminInUsers || DEFAULT_SUPER_ADMIN);

    const promotedAdmins = users.filter(u => u && u.role === 'admin' && u.email !== SUPER_ADMIN_EMAIL);
    const apiAdmins = fetchedAgents.filter(u => u && u.email !== SUPER_ADMIN_EMAIL);

    const allAdmins = [...promotedAdmins, ...apiAdmins];
    const uniqueAdminsMap = new Map<string, User>();
    allAdmins.forEach(u => uniqueAdminsMap.set(u.email, u));

    return [currentSuperAdmin, ...Array.from(uniqueAdminsMap.values())];
  };

  const activeAgents = getActiveSiteAgents();

  // Responsive view states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewListingForm, setShowNewListingForm] = useState(false);
  const [expandedListing, setExpandedListing] = useState<Listing | null>(null);

  // Deep Link URL parameter auto-open (?property=prop-id)
  useEffect(() => {
    if (listings.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const propertyId = params.get('property') || window.location.hash.replace('#property-', '').replace('#', '');
      if (propertyId) {
        const found = listings.find(l => l && l.id === propertyId);
        if (found) setExpandedListing(found);
      }
    }
  }, [listings]);

  const handleOpenListing = (listing: Listing) => {
    setExpandedListing(listing);
    window.history.pushState(null, '', `?property=${listing.id}`);
  };

  const handleCloseListing = () => {
    setExpandedListing(null);
    window.history.pushState(null, '', window.location.pathname);
  };

  // Auth Dialog Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'owner' | 'admin'>('owner');
  const [authError, setAuthError] = useState<string>('');

  useEffect(() => {
    const baseValue = activeSegment === 'buy' ? 10000000 : 200000;
    if (currency === 'MAD') setMaxPrice(baseValue * 10.10);
    else if (currency === 'EUR') setMaxPrice(Math.round(baseValue * eurRate));
    else setMaxPrice(baseValue);
  }, [activeSegment, currency, eurRate]);

  // Carousel timer
  const [heroImgIndex, setHeroImgIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroImgIndex((prev) => (prev + 1) % HERO_CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auth Submit Handler
  const handleRegisterAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (isFirebaseConfigured() && regEmail && regPassword) {
      try {
        if (authMode === 'register') {
          const fbUser = await registerWithEmail(regEmail, regPassword);
          const autoRole = regEmail === SUPER_ADMIN_EMAIL ? 'superadmin' : regRole;
          const newUser: User = {
            id: fbUser.uid,
            name: regName || regEmail.split('@')[0],
            email: regEmail,
            phone: regPhone || '+212 600-000000',
            avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80`,
            role: autoRole
          };
          await syncUserApi(newUser);
          setCurrentUser(newUser);
          setIsLoggedIn(true);
          localStorage.setItem('hostkeys_logged_in', 'true');
          localStorage.setItem('hostkeys_current_user', JSON.stringify(newUser));
        } else {
          await loginWithEmail(regEmail, regPassword);
          setIsLoggedIn(true);
        }
        setShowRegisterDialog(false);
        setActiveTab('dashboard');
        return;
      } catch (err: any) {
        console.error('Firebase Auth error:', err);
        setAuthError(err?.message || 'Authentication failed');
      }
    }

    // Direct Login/Register Fallback
    if (!regEmail) return;

    const fallbackRole = regEmail === SUPER_ADMIN_EMAIL ? 'superadmin' : regRole;
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: regName || regEmail.split('@')[0],
      email: regEmail,
      phone: regPhone || '+212 600-000000',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80`,
      role: fallbackRole
    };

    try {
      await syncUserApi(newUser);
    } catch (e) {}

    setUsers(prev => {
      const exists = prev.some(u => u && u.email === newUser.email);
      const updated = exists 
        ? prev.map(u => u && u.email === newUser.email ? { ...u, ...newUser } : u)
        : [...prev, newUser];
      localStorage.setItem('hostkeys_all_users', JSON.stringify(updated));
      return updated;
    });

    setCurrentUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('hostkeys_logged_in', 'true');
    localStorage.setItem('hostkeys_current_user', JSON.stringify(newUser));
    setShowRegisterDialog(false);
    setActiveTab('dashboard');
  };

  const handleGoogleAuth = async () => {
    if (!isFirebaseConfigured()) {
      setAuthError('Firebase is not configured. Please use email login.');
      return;
    }
    try {
      setAuthError('');
      await loginWithGoogle();
      // onAuthStateChanged in subscribeToAuthState handles the rest
      setShowRegisterDialog(false);
    } catch (err: any) {
      const msg = err?.message || 'Google authentication failed';
      setAuthError(msg);
    }
  };

  // Add Property
  const handleAddProperty = async (propertyData: Omit<Listing, 'id' | 'status' | 'ownerId' | 'createdAt' | 'approvedByAdminId'>) => {
    if (!currentUser) {
      setShowRegisterDialog(true);
      return;
    }

    const isAdminOrSuper = currentUser.role === 'admin' || currentUser.role === 'superadmin';
    const newProperty: Listing = {
      ...propertyData,
      id: `prop-${Date.now()}`,
      status: isAdminOrSuper ? 'approved' : 'pending',
      ownerId: currentUser.id,
      createdAt: new Date().toISOString(),
      approvedByAdminId: isAdminOrSuper ? currentUser.id : undefined
    };

    try {
      const res = await createPropertyApi(newProperty);
      if (res && res.listing) {
        setListings(prev => [res.listing, ...prev.filter(l => l && l.id !== res.listing.id)]);
      } else {
        setListings(prev => [newProperty, ...prev.filter(l => l && l.id !== newProperty.id)]);
      }
      if (res && res.isLiveDb) setIsLiveDb(true);
    } catch (err: any) {
      setListings(prev => [newProperty, ...prev.filter(l => l && l.id !== newProperty.id)]);
    }

    // Auto-switch segment to 'buy' or 'rent' matching property type
    setActiveSegment(newProperty.type);
    setShowNewListingForm(false);

    if (isAdminOrSuper) {
      setActiveTab('catalog');
      addToast('success', lang === 'fr' ? 'Propriété publiée et active sur le portail !' : 'Property published & live on portal!');
    } else {
      setActiveTab('dashboard');
      addToast('success', lang === 'fr' ? 'Propriété soumise ! Suivez sa validation ici dans votre tableau de bord.' : 'Property submitted for verification! Track it here in your Dashboard.');
    }

    // Refetch from database
    loadPropertiesFromApi();
  };

  // Approve / Reject Property
  const handleApproveListing = async (listingId: string, adminId: string) => {
    let approvedType: 'buy' | 'rent' = 'buy';

    setListings(prev => {
      const updated = prev.map(listing => {
        if (listing && listing.id === listingId) {
          approvedType = listing.type;
          return { ...listing, status: 'approved' as const, approvedByAdminId: adminId };
        }
        return listing;
      });
      localStorage.setItem('hostkeys_cached_listings', JSON.stringify(updated));
      return updated;
    });

    // Auto-switch active category segment (Buy/Rent) so user immediately sees approved property
    setActiveSegment(approvedType);

    try {
      await updatePropertyStatusApi(listingId, 'approved', adminId);
      addToast('success', lang === 'fr' ? 'Propriété approuvée et publiée dans le catalogue !' : 'Property approved & published live!');
    } catch (err) {
      addToast('info', lang === 'fr' ? 'Statut mis à jour localement.' : 'Status updated locally.');
    }
  };

  const handleRejectListing = async (listingId: string) => {
    setListings(prev => prev.map(listing => {
      if (listing && listing.id === listingId) {
        return { ...listing, status: 'rejected' };
      }
      return listing;
    }));

    try {
      await updatePropertyStatusApi(listingId, 'rejected');
      addToast('info', lang === 'fr' ? 'Propriété refusée.' : 'Property submission rejected.');
    } catch (err) {
      addToast('info', lang === 'fr' ? 'Statut mis à jour localement.' : 'Status updated locally.');
    }
  };

  const handleUpdateUserRole = (userId: string, newRole: 'owner' | 'admin', success: boolean, errorMsg?: string) => {
    if (success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      addToast('success', lang === 'fr' ? 'Rôle utilisateur mis à jour avec succès !' : 'User role updated successfully!');
    } else {
      addToast('error', lang === 'fr' ? `Échec de mise à jour du rôle: ${errorMsg || 'Erreur serveur'}` : `Role update failed: ${errorMsg || 'Server error'}`);
    }
  };

  const handleUpdateUserAgentStatus = (userId: string, isAgent: boolean, languages: string[], success: boolean, errorMsg?: string) => {
    if (success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isAgent, languages } : u));
      addToast('success', lang === 'fr' ? 'Statut agent et langues mis à jour !' : 'Agent status & languages updated!');
    } else {
      addToast('error', lang === 'fr' ? `Échec de mise à jour agent: ${errorMsg || 'Erreur serveur'}` : `Agent update failed: ${errorMsg || 'Server error'}`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedLocation('All');
    setBedroomsFilter('All');
    setBathroomsFilter('All');
    setSelectedAmenities([]);
    const baseValue = activeSegment === 'buy' ? 20000000 : 80000;
    setMaxPrice(baseValue);
  };

  const handleUpdateProfile = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('hostkeys_current_user', JSON.stringify(updatedUser));
    try {
      await syncUserApi(updatedUser);
    } catch (e) {}
  };

  // Filter listings
  // Filter listings
  const filteredListings = listings.filter(item => {
    if (!item) return false;

    // Status check (case-insensitive)
    const statusNorm = (item.status || 'pending').toLowerCase();
    if (statusNorm !== 'approved') return false;

    // Segment check (buy vs rent)
    const typeNorm = (item.type || 'buy').toLowerCase();
    const activeSegNorm = (activeSegment || 'buy').toLowerCase();
    if (typeNorm !== activeSegNorm) return false;

    if (searchTerm) {
      const query = searchTerm.trim().toLowerCase();
      const matchesTitle = (item.title || '').toLowerCase().includes(query);
      const matchesDesc = (item.description || '').toLowerCase().includes(query);
      const matchesLoc = (item.location || '').toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
    }

    if (selectedLocation !== 'All' && (item.location || '').trim().toLowerCase() !== selectedLocation.trim().toLowerCase()) {
      return false;
    }

    if (bedroomsFilter !== 'All') {
      const bedsNum = Number(item.bedrooms || 0);
      if (bedroomsFilter === 4) {
        if (bedsNum < 4) return false;
      } else {
        if (bedsNum < Number(bedroomsFilter)) return false;
      }
    }

    if (bathroomsFilter !== 'All') {
      const bathsNum = Number(item.bathrooms || 0);
      if (bathroomsFilter === 3) {
        if (bathsNum < 3) return false;
      } else {
        if (bathsNum < Number(bathroomsFilter)) return false;
      }
    }

    const valuationInActiveCurrency = convertValue(item.price || 0, currency, eurRate);
    if (maxPrice > 0 && valuationInActiveCurrency > maxPrice) return false;

    if (selectedAmenities.length > 0) {
      const hasAll = selectedAmenities.every(amenity => item.amenities && item.amenities.includes(amenity));
      if (!hasAll) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#030303] text-slate-100 font-sans flex flex-col antialiased">
      
      {/* Main Header */}
      <header className="border-b border-neutral-900 bg-[#030303]/90 backdrop-blur-md py-4 px-4 sticky top-0 z-35">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <img src="/logo.png" alt="Hostkeys" className="h-10 md:h-12 object-contain hover:opacity-90 transition-opacity" />
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
                {t('navBuyCatalog', lang)}
              </button>
              <button
                id="header-nav-rent"
                onClick={() => {
                  setActiveTab('catalog');
                  setActiveSegment('rent');
                }}
                className={`px-4 py-1.5 rounded-lg transition-all ${activeTab === 'catalog' && activeSegment === 'rent' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-450 hover:text-slate-200'}`}
              >
                {t('navRentCatalog', lang)}
              </button>
              {isLoggedIn && (
                <button
                  id="header-nav-dashboard"
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-1.5 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-450 hover:text-slate-200'}`}
                >
                  {t('navDashboard', lang)}
                </button>
              )}
            </div>
          </nav>

          {/* Currency & Language Switchers */}
          <div className="hidden md:flex items-center gap-3">
            {/* Currency Selector */}
            <div className="bg-neutral-900/65 p-1 rounded-xl border border-neutral-850 text-xs font-mono select-none flex">
              <button
                onClick={() => setCurrency('MAD')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-semibold ${currency === 'MAD' ? 'bg-brand text-[#030303]' : 'text-slate-400 hover:text-slate-100'}`}
                title={t('tooltipMAD', lang)}
              >
                MAD DH
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-semibold ${currency === 'USD' ? 'bg-brand text-[#030303]' : 'text-slate-400 hover:text-slate-100'}`}
                title={t('tooltipUSD', lang)}
              >
                USD $
              </button>
              <button
                onClick={() => setCurrency('EUR')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-semibold ${currency === 'EUR' ? 'bg-brand text-[#030303]' : 'text-slate-400 hover:text-slate-100'}`}
                title={t('tooltipEUR', lang)}
              >
                EUR €
              </button>
            </div>

            {/* Language Selector */}
            <div className="bg-neutral-900/65 p-1 rounded-xl border border-neutral-850 text-xs font-mono select-none flex">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-semibold ${lang === 'en' ? 'bg-brand text-[#030303]' : 'text-slate-400 hover:text-slate-100'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-semibold ${lang === 'fr' ? 'bg-brand text-[#030303]' : 'text-slate-400 hover:text-slate-100'}`}
              >
                FR
              </button>
            </div>
          </div>

          {/* User Auth Buttons / Profile Menu */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <button
                onClick={() => setShowRegisterDialog(true)}
                className="px-4 py-2 rounded-xl bg-brand text-[#030303] hover:bg-brand/90 font-bold font-mono text-xs transition-all shadow-[0_0_15px_rgba(0,180,216,0.25)] cursor-pointer"
              >
                {lang === 'fr' ? 'Se Connecter' : 'Login / Sign Up'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  id="user-profile-header-btn"
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-2 bg-[#0c0c0c] hover:bg-neutral-900 border border-neutral-800 p-1.5 pr-3 rounded-full text-left transition-all group cursor-pointer"
                >
                  <img 
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'} 
                    alt={currentUser?.name || 'User'}
                    referrerPolicy="no-referrer"
                    className="h-7 w-7 rounded-full border border-brand/20 object-cover group-hover:border-brand transition-all" 
                  />
                  <div className="text-left">
                    <p className="text-[11.5px] font-semibold text-slate-100 group-hover:text-brand leading-tight transition-colors line-clamp-1">{currentUser?.name}</p>
                    <p className="text-[9px] font-mono leading-none tracking-wider uppercase text-slate-400">
                      {currentUser?.role === 'superadmin' ? 'Super Admin' : currentUser?.role === 'admin' ? 'Admin' : 'Owner'}
                    </p>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-full bg-neutral-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-neutral-800 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {isLoggedIn && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="p-2 rounded-lg bg-neutral-900/80 text-slate-300 hover:text-brand border border-neutral-800"
                title="Dashboard"
              >
                <UserIcon className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-neutral-900 text-slate-300 hover:text-brand border border-neutral-800 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-neutral-900 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2">
                {/* Nav Links */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => { setActiveTab('catalog'); setActiveSegment('buy'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-mono font-semibold transition-all ${
                      activeTab === 'catalog' && activeSegment === 'buy'
                        ? 'bg-brand text-[#030303]'
                        : 'text-slate-300 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    {t('navBuyCatalog', lang)}
                  </button>
                  <button
                    onClick={() => { setActiveTab('catalog'); setActiveSegment('rent'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-mono font-semibold transition-all ${
                      activeTab === 'catalog' && activeSegment === 'rent'
                        ? 'bg-brand text-[#030303]'
                        : 'text-slate-300 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    {t('navRentCatalog', lang)}
                  </button>
                  {isLoggedIn && (
                    <button
                      onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-mono font-semibold transition-all ${
                        activeTab === 'dashboard'
                          ? 'bg-brand text-[#030303]'
                          : 'text-slate-300 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      {t('navDashboard', lang)}
                    </button>
                  )}
                </div>

                {/* Currency & Language */}
                <div className="flex gap-2 pt-1 border-t border-neutral-900">
                  <div className="flex bg-neutral-900/60 p-1 rounded-xl border border-neutral-800 text-xs font-mono flex-1 justify-center">
                    {(['MAD', 'USD', 'EUR'] as const).map(c => (
                      <button key={c} onClick={() => setCurrency(c)}
                        className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                          currency === c ? 'bg-brand text-[#030303]' : 'text-slate-400 hover:text-slate-100'
                        }`}>
                        {c === 'MAD' ? 'MAD' : c === 'USD' ? 'USD' : 'EUR'}
                      </button>
                    ))}
                  </div>
                  <div className="flex bg-neutral-900/60 p-1 rounded-xl border border-neutral-800 text-xs font-mono">
                    <button onClick={() => setLang('en')}
                      className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                        lang === 'en' ? 'bg-brand text-[#030303]' : 'text-slate-400 hover:text-slate-100'
                      }`}>EN</button>
                    <button onClick={() => setLang('fr')}
                      className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                        lang === 'fr' ? 'bg-brand text-[#030303]' : 'text-slate-400 hover:text-slate-100'
                      }`}>FR</button>
                  </div>
                </div>

                {/* Auth */}
                <div className="pt-1 border-t border-neutral-900">
                  {!isLoggedIn ? (
                    <button
                      onClick={() => { setShowRegisterDialog(true); setMobileMenuOpen(false); }}
                      className="w-full px-4 py-2.5 rounded-xl bg-brand text-[#030303] hover:bg-brand/90 font-bold font-mono text-sm transition-all"
                    >
                      {lang === 'fr' ? 'Se Connecter' : 'Login / Sign Up'}
                    </button>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'}
                          alt={currentUser?.name || 'User'}
                          referrerPolicy="no-referrer"
                          className="h-8 w-8 rounded-full border border-brand/30 object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-100 leading-tight">{currentUser?.name}</p>
                          <p className="text-[10px] font-mono uppercase text-slate-400">
                            {currentUser?.role === 'superadmin' ? 'Super Admin' : currentUser?.role === 'admin' ? 'Admin' : 'Owner'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                        className="p-2 rounded-full bg-neutral-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-neutral-800 transition-all"
                        title="Sign Out"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {activeTab === 'dashboard' && currentUser ? (
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
            allUsers={users}
            onApprove={handleApproveListing}
            onReject={handleRejectListing}
            onSelectListing={(listing) => handleOpenListing(listing)}
            onAddListing={() => setShowNewListingForm(true)}
            onUpdateUserRole={handleUpdateUserRole}
            onUpdateUserAgentStatus={handleUpdateUserAgentStatus}
            currency={currency}
            eurRate={eurRate}
            lang={lang}
          />
        </motion.div>
      ) : (
        /* MAIN CATALOG & SEARCH HERO */
        <motion.main 
          key="catalog-tab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="flex-grow"
        >
          {/* HERO CAROUSEL */}
          <section className="relative min-h-[360px] md:min-h-[440px] flex items-center justify-center overflow-hidden border-b border-neutral-900 bg-[#030303]">
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={heroImgIndex}
                  src={HERO_CAROUSEL_IMAGES[heroImgIndex]}
                  alt="Hostkeys Real Estate Morocco"
                  className="w-full h-full object-cover opacity-60 brightness-110 saturate-125"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 0.6, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-[#030303]/20" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-4 py-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/15 border border-brand/30 text-brand text-xs font-mono backdrop-blur-md shadow-lg">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t('brokerRepresentativeText', lang)}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase font-sans drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                {t('heroHeadingMain', lang)}{' '}
                <span className="text-brand block md:inline drop-shadow-[0_0_20px_rgba(0,180,216,0.4)]">{t('heroHeadingHighlight', lang)}</span>
              </h1>

              <p className="max-w-2xl mx-auto text-xs md:text-sm text-slate-200 font-sans leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] bg-black/40 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
                {t('heroSubheading', lang)}
              </p>

              {/* SEARCH & FILTERS BAR */}
              <div className="pt-4 max-w-3xl mx-auto">
                <div className="bg-[#0c0c0c]/90 p-2 rounded-2xl border border-neutral-800 shadow-2xl flex flex-col md:flex-row items-center gap-2 backdrop-blur-md">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('searchPlaceholder', lang)}
                      className="w-full bg-[#030303] border border-neutral-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand focus:outline-none font-mono"
                    />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 hover:text-white">
                        {t('searchClear', lang)}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${showFilters ? 'bg-brand/10 border-brand text-brand' : 'bg-[#030303] border-neutral-850 text-slate-300 hover:text-white'}`}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>{t('filtersLabel', lang)}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (!isLoggedIn) setShowRegisterDialog(true);
                        else setShowNewListingForm(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-brand text-[#030303] font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,180,216,0.25)] hover:bg-brand/90 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{t('addListingBtn', lang)}</span>
                    </button>
                  </div>
                </div>

                {/* FILTER PANEL EXPANSION */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 bg-[#0c0c0c] border border-neutral-850 rounded-2xl p-5 text-left space-y-5 overflow-hidden font-mono text-xs shadow-2xl"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-slate-400 mb-1">{t('filterNeighborhood', lang)}</label>
                          <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-3 py-2 text-white focus:border-brand focus:outline-none cursor-pointer"
                          >
                            <option value="All">{t('allFilters', lang)}</option>
                            {ALL_LOCATIONS.map(loc => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">{t('filterBedrooms', lang)}</label>
                          <select
                            value={bedroomsFilter}
                            onChange={(e) => setBedroomsFilter(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                            className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-3 py-2 text-white focus:border-brand focus:outline-none cursor-pointer"
                          >
                            <option value="All">{t('allFilters', lang)}</option>
                            <option value={1}>1+ Bed</option>
                            <option value={2}>2+ Beds</option>
                            <option value={3}>3+ Beds</option>
                            <option value={4}>4+ Beds</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Salles de bain' : 'Bathrooms'}</label>
                          <select
                            value={bathroomsFilter}
                            onChange={(e) => setBathroomsFilter(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                            className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-3 py-2 text-white focus:border-brand focus:outline-none cursor-pointer"
                          >
                            <option value="All">{t('allFilters', lang)}</option>
                            <option value={1}>1+ Bath</option>
                            <option value={2}>2+ Baths</option>
                            <option value={3}>3+ Baths</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">
                            {t('filterMaxBudget', lang, { currency })}: <span className="text-brand font-bold">{formatCurrency(maxPrice, currency, eurRate)}</span>
                          </label>
                          <input
                            type="range"
                            min={activeSegment === 'buy' ? 100000 : 500}
                            max={activeSegment === 'buy' ? (currency === 'MAD' ? 100000000 : 10000000) : (currency === 'MAD' ? 2000000 : 200000)}
                            step={activeSegment === 'buy' ? 100000 : 1000}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full accent-brand cursor-pointer mt-2"
                          />
                        </div>
                      </div>

                      {/* AMENITIES FILTER CHIPS */}
                      <div className="pt-2 border-t border-neutral-900 space-y-2">
                        <label className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                          {lang === 'fr' ? 'Équipements & Prestations' : 'Amenities & Specifications'}
                        </label>
                        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                          {ALL_AMENITIES.map(amenity => {
                            const isSelected = selectedAmenities.includes(amenity);
                            return (
                              <button
                                key={amenity}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                                  } else {
                                    setSelectedAmenities([...selectedAmenities, amenity]);
                                  }
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[10px] transition-all border cursor-pointer flex items-center gap-1 ${isSelected ? 'bg-brand/10 border-brand text-brand font-bold' : 'bg-[#030303] border-neutral-850 text-slate-400 hover:text-white'}`}
                              >
                                {isSelected && <Check className="h-2.5 w-2.5 shrink-0" />}
                                {amenity}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-neutral-900">
                        <span className="text-[11px] text-slate-500">
                          {selectedAmenities.length > 0 ? `${selectedAmenities.length} ${lang === 'fr' ? 'équipement(s) sélectionné(s)' : 'amenity filter(s) active'}` : ''}
                        </span>
                        <button onClick={handleResetFilters} className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer font-bold">
                          {t('resetFilters', lang)}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* PROPERTIES GRID SECTION */}
          <section className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono text-slate-400 uppercase tracking-wider">
                {t(filteredListings.length === 1 ? 'filteredCountSingular' : 'filteredCountPlural', lang, { count: filteredListings.length })}
              </h2>
            </div>

            {filteredListings.length === 0 ? (
              <div className="text-center py-20 bg-[#0c0c0c] rounded-2xl border border-neutral-850 p-8 space-y-4">
                <Building className="h-12 w-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">{t('noListingsFound', lang)}</h3>
                <button
                  onClick={() => {
                    if (!isLoggedIn) setShowRegisterDialog(true);
                    else setShowNewListingForm(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-brand text-[#030303] font-bold font-mono text-xs inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t('addListingBtn', lang)}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <PropertyCard
                    key={listing.id}
                    listing={translateListing(listing, lang)}
                    adminUser={users.find(u => u.id === listing.approvedByAdminId) || DEFAULT_SUPER_ADMIN}
                    currentUser={currentUser}
                    agents={users.filter(u => u && (u.email === SUPER_ADMIN_EMAIL || u.role === 'superadmin' || (u.role === 'admin' && u.isAgent)))}
                    onSelect={(l) => handleOpenListing(l)}
                    currency={currency}
                    eurRate={eurRate}
                    lang={lang}
                  />
                ))}
              </div>
            )}
          </section>
        </motion.main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-neutral-900 bg-[#030303] py-8 px-4 text-center text-xs font-mono text-slate-450 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <img src="/logo.png" alt="Hostkeys" className="h-5 object-contain" />
          </div>
          <p>HOSTKEYS REAL ESTATE PORTAL © 2026 — VERCEL & NEON DB LIVE</p>
        </div>
      </footer>

      {/* NEW PROPERTY FORM MODAL */}
      {showNewListingForm && currentUser && (
        <PropertyForm
          currentUser={currentUser}
          onAddListing={handleAddProperty}
          onClose={() => setShowNewListingForm(false)}
          currency={currency}
          eurRate={eurRate}
          lang={lang}
        />
      )}

      {/* AUTH & ACCOUNT DIALOG MODAL */}
      <AnimatePresence>
        {showRegisterDialog && !isLoggedIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c0c0c] border border-neutral-850 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                <div className="flex items-center gap-3">
                  <img src="/miniLogo.png" alt="Hostkeys Icon" className="h-7 w-7 object-contain" />
                  <div>
                    <h3 className="text-lg font-bold text-white font-sans">{t('regTitle', lang)}</h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">{t('regSubtitle', lang)}</p>
                  </div>
                </div>
                <button onClick={() => setShowRegisterDialog(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {authError && (
                <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl border border-rose-500/20 text-xs font-mono">
                  {authError}
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-2 bg-[#141414] hover:bg-[#1a1a1a] border border-neutral-800 rounded-xl py-2.5 px-3 text-xs font-mono transition-all text-slate-200 cursor-pointer"
                >
                  <span className="text-amber-400 font-bold">G</span> {t('regGoogleConnect', lang)}
                </button>
              </div>

              <div className="relative flex items-center justify-center text-xs font-mono text-slate-500">
                <div className="border-t border-neutral-850 w-full" />
                <span className="bg-[#0c0c0c] px-3 absolute">OR</span>
              </div>

              <form onSubmit={handleRegisterAccount} className="space-y-3 font-mono text-xs">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-slate-400 mb-1">{t('regFullNameLabel', lang)}</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Yassine Sadik"
                      className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-3 py-2 text-white focus:border-brand focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 mb-1">{t('regEmailLabel', lang)}</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@hostkeys.ma"
                    className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-3 py-2 text-white focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-3 py-2 text-white focus:border-brand focus:outline-none"
                  />
                </div>



                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
                    className="text-[11px] text-brand hover:underline"
                  >
                    {authMode === 'register' ? 'Already have an account? Login' : 'Need an account? Register'}
                  </button>
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-neutral-850 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setShowRegisterDialog(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    {t('cancel', lang)}
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

      {/* PROPERTY DETAILS DRAWER */}
      <AnimatePresence>
        {expandedListing && (
          <PropertyDetailDrawer
            listing={translateListing(expandedListing, lang)}
            currentUser={currentUser}
            agents={users.filter(u => u && (u.email === SUPER_ADMIN_EMAIL || u.role === 'superadmin' || (u.role === 'admin' && u.isAgent)))}
            adminUser={users.find(u => u.id === expandedListing.approvedByAdminId) || DEFAULT_SUPER_ADMIN}
            onClose={handleCloseListing}
            currency={currency}
            eurRate={eurRate}
            lang={lang}
          />
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION CONTAINER */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
