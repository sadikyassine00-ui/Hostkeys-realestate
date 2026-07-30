import React, { useState } from 'react';
import { User, Listing } from '../types';
import { translateListing } from '../translations';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  BarChart3, 
  Building, 
  Plus, 
  FileText,
  UserCheck,
  ExternalLink,
  Sparkles,
  ClipboardList,
  Check,
  Lock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency } from '../utils';

interface DashboardViewProps {
  currentUser: User;
  onUpdateProfile: (updatedUser: User) => void;
  listings: Listing[];
  onApprove: (listingId: string, adminId: string) => void;
  onReject: (listingId: string) => void;
  onSelectListing: (listing: Listing) => void;
  onAddListing: () => void;
  currency: 'USD' | 'EUR';
  eurRate: number;
  lang: 'en' | 'fr';
}

export default function DashboardView({
  currentUser,
  onUpdateProfile,
  listings,
  onApprove,
  onReject,
  onSelectListing,
  onAddListing,
  currency,
  eurRate,
  lang
}: DashboardViewProps) {
  // Profile editing state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatar);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active workspace subsection state: 'overview' or 'queue' or 'portfolio'
  const [adminTab, setAdminTab] = useState<'pending' | 'approved' | 'profile'>('pending');
  const [ownerTab, setOwnerTab] = useState<'listings' | 'profile'>('listings');

  // Derive stats
  const isAdmin = currentUser.role === 'admin';
  
  // Admin stats calculations
  const totalApprovedListings = listings.filter(l => l.status === 'approved');
  const totalPendingListings = listings.filter(l => l.status === 'pending');
  const totalRejectedListings = listings.filter(l => l.status === 'rejected');
  
  const baseBrokeredVolume = totalApprovedListings.reduce((sum, item) => sum + item.price, 0);
  const totalSystemBrokeredVolume = currency === 'EUR' ? baseBrokeredVolume * eurRate : baseBrokeredVolume;
  const uniqueOwnerIds = new Set(listings.map(l => l.ownerId));
  const totalContributorsCount = uniqueOwnerIds.size;

  // Owner stats calculations
  const mySubmissions = listings.filter(l => l.ownerId === currentUser.id);
  const myApprovedCount = mySubmissions.filter(l => l.status === 'approved').length;
  const myPendingCount = mySubmissions.filter(l => l.status === 'pending').length;
  const myRejectedCount = mySubmissions.filter(l => l.status === 'rejected').length;
  
  const basePortfolioValue = mySubmissions
    .filter(l => l.status === 'approved')
    .reduce((sum, item) => sum + item.price, 0);
  const myPortfolioValue = currency === 'EUR' ? basePortfolioValue * eurRate : basePortfolioValue;

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...currentUser,
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      avatar: profileAvatar
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleQuickAvatarChange = (gender: 'male' | 'female' | 'tech') => {
    let url = '';
    if (gender === 'male') {
      url = `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80`;
    } else if (gender === 'female') {
      url = `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80`;
    } else {
      url = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80`;
    }
    setProfileAvatar(url);
  };

  return (
    <div id="bureau-dashboard-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-4">
      
      {/* 1. Left Sidebar: User Portal Badge & Quick Navigation Controls */}
      <div id="dash-left-panel" className="lg:col-span-4 space-y-6">
        
        {/* Dynamic Badge Card */}
        <div 
          id="portal-identity-badge" 
          className="rounded-2xl bg-[#0c0c0c] border border-neutral-850 p-6 space-y-5 relative overflow-hidden group shadow-lg"
        >
          {/* Decorative neon subtle gradient */}
          <div className="absolute top-0 right-0 h-20 w-20 bg-brand/10 rounded-full blur-3xl group-hover:bg-brand/20 transition-all pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                referrerPolicy="no-referrer"
                className="h-16 w-16 rounded-full object-cover border-2 border-brand"
              />
              <span className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#0c0c0c] flex items-center justify-center ${isAdmin ? 'bg-[#a6fe00]' : 'bg-amber-500'}`}>
                {isAdmin ? <ShieldCheck className="h-2.5 w-2.5 text-black" /> : <UserIcon className="h-2.5 w-2.5 text-black" />}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-semibold text-white tracking-tight leading-tight">{currentUser.name}</h3>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
                {currentUser.role === 'admin' 
                  ? (lang === 'fr' ? 'Administrateur' : 'Administrator') 
                  : (lang === 'fr' ? 'Contributeur Foncier' : 'Property Contributor')}
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-900 pt-4 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span className="text-slate-500">{lang === 'fr' ? 'Réf ID :' : 'ID Ref:'}</span>
              <span className="text-slate-300">{currentUser.id}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span className="text-slate-500">{lang === 'fr' ? 'Rôle Système :' : 'System Role:'}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold leading-none ${isAdmin ? 'bg-brand/15 text-brand border border-brand/35' : 'bg-neutral-900 text-slate-300 border border-neutral-800'}`}>
                {currentUser.role === 'admin' ? (lang === 'fr' ? 'Admin' : 'admin') : (lang === 'fr' ? 'Propriétaire' : 'owner')}
              </span>
            </div>
          </div>

          {/* Masking Status Info */}
          <div className="bg-[#030303]/90 p-4 rounded-xl border border-neutral-900 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-brand font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>{lang === 'fr' ? "Garde d'Identité Actif" : "Identity Guard Active"}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              {lang === 'fr' 
                ? "Les coordonnées de compte enregistrées sont strictement confidentielles. Pour les annonces publiques, les détails sont automatiquement acheminés par les canaux de courtiers agréés."
                : "Internal registered account details are strictly confidential. For public listings, details are automatically routed through Authorized Broker channels."}
            </p>
          </div>
        </div>

        {/* Workspace Quick Tab switcher */}
        <div id="workspace-navigator" className="rounded-2xl bg-[#0c0c0c] border border-neutral-850 p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
            {lang === 'fr' ? "Opérations de l'Espace" : "Workspace Operations"}
          </h4>
          
          <div className="flex flex-col gap-1 text-xs font-mono">
            {isAdmin ? (
              <>
                <button
                  id="tab-btn-admin-vtting"
                  onClick={() => setAdminTab('pending')}
                  className={`w-full py-3 px-4 rounded-xl text-left border flex items-center justify-between transition-all ${adminTab === 'pending' ? 'bg-[#a6fe00]/10 border-brand text-brand font-bold' : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-neutral-900'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <ClipboardList className="h-4 w-4" />
                    <span>{lang === 'fr' ? "Matrice de File d'Audit" : "Audit Queue Matrix"}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${totalPendingListings.length > 0 ? 'bg-brand text-[#030303] font-bold animate-pulse' : 'bg-neutral-900 text-slate-400'}`}>
                    {totalPendingListings.length}
                  </span>
                </button>

                <button
                  id="tab-btn-admin-portfolio"
                  onClick={() => setAdminTab('approved')}
                  className={`w-full py-3 px-4 rounded-xl text-left border flex items-center justify-between transition-all ${adminTab === 'approved' ? 'bg-[#a6fe00]/10 border-brand text-brand font-bold' : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-neutral-900'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <Building className="h-4 w-4" />
                    <span>{lang === 'fr' ? "Portefeuille Actif Global" : "Global Active Portfolio"}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-900 text-slate-400">
                    {totalApprovedListings.length}
                  </span>
                </button>
              </>
            ) : (
              <button
                id="tab-btn-owner-listings"
                onClick={() => setOwnerTab('listings')}
                className={`w-full py-3 px-4 rounded-xl text-left border flex items-center justify-between transition-all ${ownerTab === 'listings' ? 'bg-[#a6fe00]/10 border-brand text-brand font-bold' : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-neutral-900'}`}
              >
                <span className="flex items-center gap-2.5">
                  <Building className="h-4 w-4" />
                  <span>{lang === 'fr' ? "Mes Propriétés Soumises" : "My Submitted Properties"}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-900 text-slate-400">
                  {mySubmissions.length}
                </span>
              </button>
            )}

            <button
               id="tab-btn-edit-profile"
              onClick={() => {
                if (isAdmin) setAdminTab('profile');
                else setOwnerTab('profile');
              }}
              className={`w-full py-3 px-4 rounded-xl text-left border flex items-center gap-2.5 transition-all ${(isAdmin ? adminTab === 'profile' : ownerTab === 'profile') ? 'bg-[#a6fe00]/10 border-brand text-brand font-bold' : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-neutral-900'}`}
            >
              <UserIcon className="h-4 w-4" />
              <span>{lang === 'fr' ? "Modifier mon Profil de Sécurité" : "Edit Personal Profile Context"}</span>
            </button>
          </div>
        </div>

        {/* Identity Verification Details */}
        <div className="rounded-2xl border border-neutral-900 bg-[#070707] p-5 text-xs font-mono space-y-3 leading-relaxed text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold uppercase tracking-wider">
            <Lock className="h-4 w-4 text-brand" />
            <span>{lang === 'fr' ? "Accès Session Privilégié" : "Privileged Session Access"}</span>
          </div>
          <p>
            {lang === 'fr' 
              ? "Votre session active possède des privilèges administratifs sécurisés. Les modifications sont enregistrées directement dans le cache de l'application. Soumettez librement de nouveaux biens pour vérifier les parcours système."
              : "Your current logged session holds secure Administrative lines. Changes commit directly to safe sandbox standard cache. Submit new assets freely to verify live system routes."}
          </p>
        </div>
      </div>

      {/* 2. Right Workspace Panel: Dynamic display based on tab selection */}
      <div id="dash-right-workspace" className="lg:col-span-8 space-y-8">
        
        {/* Statistics Grid Rows */}
        <div id="stats-grid-row" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {isAdmin ? (
            /* ADMIN STATS CARDS */
            <>
              <div id="stat-card-approved-total" className="bg-[#0c0c0c] border border-neutral-850 rounded-2xl p-4 flex flex-col justify-between hover:border-brand/20 transition-all">
                <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider uppercase block">
                  {lang === 'fr' ? "ACTIF GLOBAL" : "GLOBAL ACTIVE"}
                </span>
                <div className="my-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-brand">{totalApprovedListings.length}</span>
                  <span className="text-[10px] text-slate-500">{lang === 'fr' ? 'unités' : 'units'}</span>
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-[#a6fe00]" />
                  <span>{lang === 'fr' ? "Approuvé & Public" : "Approved & Public"}</span>
                </div>
              </div>

              <div id="stat-card-pending-total" className="bg-[#0c0c0c] border border-neutral-850 rounded-2xl p-4 flex flex-col justify-between hover:border-brand/20 transition-all">
                <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider uppercase block">
                  {lang === 'fr' ? "AUDIT EN COURS" : "PENDING VET"}
                </span>
                <div className="my-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-amber-400">{totalPendingListings.length}</span>
                  <span className="text-[10px] text-slate-500">{lang === 'fr' ? 'tâches' : 'tasks'}</span>
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3 text-amber-500" />
                  <span>{lang === 'fr' ? "Nécessite Validation" : "Requires Admin Audit"}</span>
                </div>
              </div>

              <div id="stat-card-brokered-vol" className="bg-[#0c0c0c] border border-neutral-850 rounded-2xl p-4 flex flex-col justify-between col-span-2 hover:border-brand/20 transition-all relative overflow-hidden group">
                <div className="absolute top-1 right-1 opacity-10 font-sans text-5xl font-black">$$</div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider uppercase block">
                  {lang === 'fr' ? "VOLUME GLOBAL PORTÉ" : "BROKERED VOLUME CAP"}
                </span>
                <div className="my-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-white">
                    {currency === 'EUR' ? '€' : '$'}{Math.round(totalSystemBrokeredVolume).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-brand">{currency}</span>
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1 flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3 text-brand" />
                  <span>{lang === 'fr' ? "Cumul des actifs certifiés" : "Vetted list valuation aggregate"}</span>
                </div>
              </div>
            </>
          ) : (
            /* OWNER STATS CARDS */
            <>
              <div id="stat-card-owner-total" className="bg-[#0c0c0c] border border-neutral-850 rounded-2xl p-4 flex flex-col justify-between hover:border-brand/20 transition-all">
                <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider uppercase block">
                  {lang === 'fr' ? "MON PORTEFEUILLE" : "MY PORTFOLIO"}
                </span>
                <div className="my-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-brand">{mySubmissions.length}</span>
                  <span className="text-[10px] text-slate-500">{lang === 'fr' ? 'villas' : 'villas'}</span>
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1 flex items-center gap-1">
                  <FileText className="h-3 w-3 text-brand" />
                  <span>{lang === 'fr' ? "Approuvé + Queue" : "Approved + Queue"}</span>
                </div>
              </div>

              <div id="stat-card-owner-approved" className="bg-[#0c0c0c] border border-neutral-850 rounded-2xl p-4 flex flex-col justify-between hover:border-brand/20 transition-all">
                <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider uppercase block">
                  {lang === 'fr' ? "BIENS PUBLIÉS" : "APPROVED UNIT"}
                </span>
                <div className="my-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-emerald-400">{myApprovedCount}</span>
                  <span className="text-[10px] text-slate-500">{lang === 'fr' ? 'en ligne' : 'live'}</span>
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-400" />
                  <span>{lang === 'fr' ? "Public & Masqué" : "Public & Broker-Masked"}</span>
                </div>
              </div>

              <div id="stat-card-owner-value" className="bg-[#0c0c0c] border border-neutral-850 rounded-2xl p-4 flex flex-col justify-between col-span-2 hover:border-brand/20 transition-all relative overflow-hidden group">
                <div className="absolute top-1 right-1 opacity-10 font-sans text-5xl font-black">VAL</div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider uppercase block">
                  {lang === 'fr' ? "ÉVALUATION NETTE CERTIFIÉE" : "MY VETTED NET VALUATION"}
                </span>
                <div className="my-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-white">
                    {currency === 'EUR' ? '€' : '$'}{Math.round(myPortfolioValue).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-brand">{currency}</span>
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-brand" />
                  <span>{lang === 'fr' ? "Valeur totale certifiée en direct" : "Live list combined value"}</span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* MAIN WORKSPACE RENDER VIEW */}
        <div id="workspace-main-panel" className="bg-[#0c0c0c] border border-neutral-850 rounded-2xl p-6 min-h-[450px] shadow-sm">
          
          {isAdmin ? (
            /* =========================================
               ADMINISTRATION WORKSPACE
               ========================================= */
            adminTab === 'pending' ? (
              <div id="admin-pending-workspace" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-900 pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-brand" />
                      {lang === 'fr' ? "File des Audits de Validation" : "Pending Audit Work List"}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {lang === 'fr' 
                        ? "Protégez l'identité réelle du propriétaire, acheminez via les représentants agréés" 
                        : "Protect real owner identity, route via Prime representative lines"}
                    </p>
                  </div>
                  <span className="self-start sm:self-center font-mono text-xs text-slate-400 bg-neutral-950 px-3 py-1 rounded-full border border-neutral-900">
                    {lang === 'fr' ? 'File d\'attente :' : 'Queue:'} <span className="text-brand font-bold">{totalPendingListings.length} {lang === 'fr' ? 'en cours' : 'pending'}</span>
                  </span>
                </div>

                {totalPendingListings.length === 0 ? (
                  <div className="text-center py-20 bg-[#030303] rounded-xl border border-neutral-900/40">
                    <CheckCircle className="h-12 w-12 text-[#a6fe00] mx-auto opacity-70 mb-4" />
                    <h4 className="text-white font-semibold">
                      {lang === 'fr' ? "File de validation vide" : "Verification Queue Clear"}
                    </h4>
                    <p className="text-xs font-mono text-slate-400 mt-2 max-w-md mx-auto">
                      {lang === 'fr'
                        ? "Toutes les propriétés soumises sont approuvées. Utilisez le sélecteur d'acteurs en haut de l'écran pour soumettre des entrées de test."
                        : "All properties submitted by catalog participants are approved. Use the switch client controls at the screen top to submit test entries."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5">
                    {totalPendingListings.map((rawListing) => {
                      const listing = translateListing(rawListing, lang);
                      return (
                        <div 
                          key={listing.id}
                          id={`audit-workspace-item-${listing.id}`}
                          className="bg-[#030303] p-5 rounded-xl border border-neutral-900 hover:border-brand/10 transition-all grid grid-cols-1 md:grid-cols-12 gap-5"
                        >
                          {/* Thumbnail */}
                          <div className="md:col-span-3">
                            <div className="relative aspect-[1.3] w-full rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800">
                              <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                              <span className="absolute bottom-2 left-2 rounded bg-black/90 font-mono text-[9px] px-1.5 py-0.5 text-brand uppercase border border-brand/20">
                                {listing.type === 'buy' ? (lang === 'fr' ? 'Achat' : 'Buy') : (lang === 'fr' ? 'Location' : 'Rent')}
                              </span>
                            </div>
                          </div>

                          {/* Title, specifications & Vetting action */}
                          <div className="md:col-span-9 flex flex-col justify-between space-y-4">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="text-sm font-semibold text-white tracking-tight hover:text-brand transition-colors cursor-pointer select-none" onClick={() => onSelectListing(rawListing)}>
                                  {listing.title}
                                </h4>
                                <span className="font-mono text-xs text-brand font-bold">{formatCurrency(listing.price, currency, eurRate, true, listing.type)}</span>
                              </div>
                              <p className="text-[11px] font-mono text-slate-500">{listing.location}</p>
                              <p className="text-xs text-slate-400 line-clamp-2 md:line-clamp-3">{listing.description}</p>
                            </div>

                            {/* Exposed Identity Verification Portal */}
                            <div className="bg-[#080808] p-3 rounded-lg border border-neutral-850 space-y-2 font-mono text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-brand/80 font-bold tracking-wider">
                                  {lang === 'fr' ? "DÉMASQUAGE SÉCURISÉ D'IDENTITÉ (ADMIN UNIQUEMENT) :" : "SECURE IDENTITY DE-MASK (ADMIN ONLY):"}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 uppercase">
                                  {lang === 'fr' ? "Propriétaire non certifié" : "Unvetted Owner"}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300">
                                <p className="truncate">{lang === 'fr' ? 'Nom : ' : 'Name: '} <span className="text-white font-medium">{listing.personalOwnerInfo.name}</span></p>
                                <p className="truncate">{lang === 'fr' ? 'Email : ' : 'Email: '} <span className="text-white font-medium">{listing.personalOwnerInfo.email}</span></p>
                                <p className="truncate">{lang === 'fr' ? 'Tél : ' : 'Phone: '} <span className="text-white font-medium">{listing.personalOwnerInfo.phone}</span></p>
                              </div>
                            </div>

                            {/* Action triggers */}
                            <div className="flex justify-end gap-3 pt-2">
                              <button
                                id={`audit-btn-reject-${listing.id}`}
                                onClick={() => onReject(listing.id)}
                                className="px-4 py-2 rounded-lg bg-transparent hover:bg-neutral-900 border border-neutral-900 text-slate-400 hover:text-red-400 font-mono text-xs transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                {lang === 'fr' ? "REFUSER L'ANNONCE" : "REJECT ENTRY"}
                              </button>
                              <button
                                id={`audit-btn-approve-${listing.id}`}
                                onClick={() => onApprove(listing.id, currentUser.id)}
                                className="px-5 py-2 rounded-lg bg-brand text-[#030303] hover:shadow-[0_0_12px_rgba(166,254,0,0.3)] font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <Check className="h-3.5 w-3.5" />
                                {lang === 'fr' ? "APPROUVER LA PUBLICATION" : "APPROVE VETTING"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : adminTab === 'approved' ? (
              <div id="admin-approved-workspace" className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#a6fe00]" />
                      {lang === 'fr' ? "Registre des Portefeuilles Certifiés" : "Global Vetted Portfolio Registry"}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {lang === 'fr' 
                        ? "Biens de prestige visibles publiquement et couverts par la marque du courtier" 
                        : "Listing objects publicly visible & protected under broker names"}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-slate-350 bg-neutral-950 px-3 py-1 rounded-full border border-neutral-900">
                    {lang === 'fr' ? 'Registre actif :' : 'Active Registry:'} <span className="text-brand font-bold">{totalApprovedListings.length} {lang === 'fr' ? 'modèles' : 'models'}</span>
                  </span>
                </div>

                {totalApprovedListings.length === 0 ? (
                  <div className="text-center py-20 bg-[#030303] rounded-xl border border-neutral-900/40">
                    <Building className="h-12 w-12 text-slate-500 mx-auto opacity-50 mb-4" />
                    <h4 className="text-white font-semibold">{lang === 'fr' ? "Aucun bien actif" : "No Assets Currently Live"}</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mt-2 font-mono">
                      {lang === 'fr'
                        ? "Veuillez auditer les soumissions en attente pour les activer, ou publiez directement de nouvelles propriétés."
                        : "Please audit pending listings to move products to the active portfolio, or list new property assets directly."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {totalApprovedListings.map(rawListing => {
                      const listing = translateListing(rawListing, lang);
                      return (
                        <div 
                          key={listing.id}
                          id={`approved-portfolio-${listing.id}`}
                          className="bg-[#030303] rounded-xl border border-neutral-900 p-4 space-y-3 flex flex-col justify-between"
                        >
                          <div className="flex gap-3">
                            <img src={listing.image} alt="" className="h-12 w-12 rounded object-cover border border-neutral-850 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-semibold text-white truncate">{listing.title}</h4>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{listing.location}</p>
                              <p className="text-[11px] text-brand font-semibold font-mono mt-1">{formatCurrency(listing.price, currency, eurRate, true, listing.type)}</p>
                            </div>
                          </div>

                          {/* Masking status readout */}
                          <div className="bg-[#070707] p-2.5 rounded-lg border border-neutral-850 text-[10px] font-mono text-slate-400 flex flex-col gap-1">
                            <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                              {lang === 'fr' ? "CANAL DE MASQUAGE DU REPRÉSENTANT :" : "REPRESENTATIVE CHANNEL MASK:"}
                            </p>
                            <p className="text-slate-200 truncate">{lang === 'fr' ? "Courtier Conseil Référent : " : "Advisory Lead Broker: "}<span className="text-brand">Marcus Sterling</span></p>
                            <p className="text-slate-300 truncate">{lang === 'fr' ? "ID Contributeur Certifié : " : "Vetted Contributor ID: "}<span className="text-amber-500">{listing.ownerId}</span></p>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              onClick={() => onSelectListing(rawListing)}
                              className="bg-neutral-900 text-slate-300 border border-neutral-800 text-[10px] font-mono py-1 px-3 rounded-lg hover:text-white transition-all cursor-pointer flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {lang === 'fr' ? 'Voir détails' : 'View Details'}
                            </button>
                            <button
                              id={`delist-btn-${listing.id}`}
                              onClick={() => onReject(listing.id)}
                              className="bg-transparent hover:bg-neutral-950/60 border border-neutral-900 text-red-400 hover:text-red-300 text-[10px] font-mono py-1 px-3 rounded-lg transition-all cursor-pointer"
                            >
                              {lang === 'fr' ? 'Retirer / Révoquer' : 'De-list / Revoke'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* ADMIN EDIT PROFILE TAB */
              <div id="admin-profile-workspace" className="space-y-6">
                <div className="border-b border-neutral-900 pb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-brand" />
                    {lang === 'fr' ? "Profil Opérateur Sécurisé" : "Secure Operator Account Profile"}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {lang === 'fr' ? "Registre des informations des spécialistes d'audit" : "Vetting specialist registry information"}
                  </p>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-6 max-w-xl">
                  {saveSuccess && (
                    <div className="bg-brand/10 border border-brand/20 rounded-xl p-3 text-xs font-mono text-brand flex items-center gap-2 animate-fade-in">
                      <CheckCircle className="h-4 w-4" />
                      <span>
                        {lang === 'fr' 
                          ? "Contexte de sécurité mis à jour avec succès via proxy !"
                          : "Security context updated successfully under safe proxy!"}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        {lang === 'fr' ? "Nom de l'Administrateur Encodé" : "Registered Administrator Name"}
                      </label>
                      <input 
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        {lang === 'fr' ? "Ligne d'Audit Téléphonique Principale" : "Primary Vetting Line Phone"}
                      </label>
                      <input 
                        type="text"
                        required
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      {lang === 'fr' ? "Email Sécurisé de Correspondance" : "Secured Official Correspondece Email"}
                    </label>
                    <input 
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand focus:outline-none font-mono"
                    />
                  </div>

                  {/* Avatar section */}
                  <div className="space-y-3">
                    <label className="block text-xs font-mono text-slate-400">
                      {lang === 'fr' ? "Représentation Biométrique (Avatar)" : "Representative Biometrics Identity (Avatar)"}
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <img src={profileAvatar} alt="" className="h-14 w-14 rounded-full border border-brand object-cover" />
                      <div className="flex-1 space-y-2">
                        <input 
                          type="text"
                          value={profileAvatar}
                          onChange={(e) => setProfileAvatar(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-3 py-1.5 text-xs text-white focus:border-brand focus:outline-none font-mono"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuickAvatarChange('male')}
                            className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-mono py-1 px-2.5 rounded text-slate-300"
                          >
                            {lang === 'fr' ? "Modèle Homme" : "Set Model Male"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAvatarChange('female')}
                            className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-mono py-1 px-2.5 rounded text-slate-300"
                          >
                            {lang === 'fr' ? "Modèle Femme" : "Set Model Female"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-neutral-900">
                    <button
                      id="btn-save-admin-profile"
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-brand font-mono text-xs font-bold text-[#030303] hover:shadow-[0_0_12px_rgba(166,254,0,0.3)] transition-all cursor-pointer flex items-center gap-2"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {lang === 'fr' ? "ENREGISTRER LE PROFIL ADMIN" : "COMMIT PROFILE MODIFICATIONS"}
                    </button>
                  </div>
                </form>
              </div>
            )
          ) : (
            /* =========================================
               OWNER PARTICIPANT WORKSPACE
               ========================================= */
            ownerTab === 'listings' ? (
              <div id="owner-listings-workspace" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-900 pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Building className="h-5 w-5 text-brand" />
                      {lang === 'fr' ? "Catalogue de mes Propriétés Soumises" : "My Submitted Property Catalog"}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {lang === 'fr' ? "Validation des biens & statut du canal de masquage" : "Asset vetting pipelines & masked representative channel states"}
                    </p>
                  </div>
                  <button
                    id="dash-submit-btn-shrt"
                    onClick={onAddListing}
                    className="self-start sm:self-center px-4 py-2 rounded-xl bg-[#a6fe00] font-mono text-xs font-bold text-[#030303] hover:shadow-[0_0_12px_rgba(166,254,0,0.3)] transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {lang === 'fr' ? "Nouvelle Soumission" : "Submit New Asset"}
                  </button>
                </div>

                {mySubmissions.length === 0 ? (
                  <div className="text-center py-20 bg-[#030303] rounded-xl border border-neutral-900/40">
                    <Building className="h-12 w-12 text-slate-500 mx-auto opacity-50 mb-4 animate-pulse" />
                    <h4 className="text-white font-semibold">{lang === 'fr' ? "Votre Catalogue est Vide" : "Your Submissions List is Empty"}</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mt-2 font-mono">
                      {lang === 'fr'
                        ? "Vous n'avez pas publié de villas ni de riads. Soumettez un bien pour observer le masquage d'approbation administrative !"
                        : "You haven't posted any villas or riads from this experimental mock profile. Let's submit some to check how admin approval masking works!"}
                    </p>
                    <button
                      id="dash-submit-btn-shrt-mid"
                      onClick={onAddListing}
                      className="mt-5 px-5 py-2.5 rounded-xl bg-[#a6fe00] text-xs font-mono text-[#030303] font-bold shadow-lg hover:shadow-[0_0_15px_rgba(166,254,0,0.25)] transition-all cursor-pointer"
                    >
                      {lang === 'fr' ? "PUBLIER UN BIEN ILLICO" : "POST NEW PROPERTY ASSETNOW"}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {mySubmissions.map((rawListing) => {
                      const listing = translateListing(rawListing, lang);
                      return (
                        <div 
                          key={listing.id}
                          id={`owner-property-row-${listing.id}`}
                          className="bg-[#030303] p-4 rounded-xl border border-neutral-900 hover:border-brand/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <img src={listing.image} alt="" className="h-12 w-12 rounded-lg object-cover border border-neutral-850 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-semibold text-white tracking-tight truncate max-w-[280px]" onClick={() => onSelectListing(rawListing)}>
                                  {listing.title}
                                </h4>
                                
                                {/* Decoupled Status Pill */}
                                {listing.status === 'approved' ? (
                                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono font-medium text-emerald-400 border border-emerald-500/20 uppercase tracking-tight flex items-center gap-1">
                                    <CheckCircle className="h-2.5 w-2.5" />
                                    {lang === 'fr' ? "Approuvé" : "Approved"}
                                  </span>
                                ) : listing.status === 'pending' ? (
                                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-mono font-medium text-amber-400 border border-amber-500/20 uppercase tracking-tight flex items-center gap-1">
                                    <ShieldAlert className="h-2.5 w-2.5 animate-pulse" />
                                    {lang === 'fr' ? "Audit en cours" : "Pending Audit"}
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[9px] font-mono font-medium text-red-400 border border-red-500/20 uppercase tracking-tight flex items-center gap-1">
                                    <XCircle className="h-2.5 w-2.5" />
                                    {lang === 'fr' ? "Refusé" : "Rejected"}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                                {listing.location} · <span>{listing.bedrooms} {listing.bedrooms === 1 ? (lang === 'fr' ? 'Chambre' : 'Bed') : (lang === 'fr' ? 'Chambres' : 'Beds')}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-neutral-900 pt-3 md:pt-0">
                            {/* Price */}
                            <div className="font-mono text-xs text-right">
                              <p className="text-slate-500 uppercase text-[9px]">{lang === 'fr' ? "Prix Estimé" : "Market Price"}</p>
                              <p className="text-white font-bold">{formatCurrency(listing.price, currency, eurRate, true, listing.type)}</p>
                            </div>
                            
                            <button
                              onClick={() => onSelectListing(rawListing)}
                              className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-mono text-slate-300 py-1.5 px-3 rounded-lg hover:text-white transition-colors cursor-pointer flex items-center gap-1 ml-auto md:ml-0"
                            >
                              <span>{lang === 'fr' ? 'Inspecter' : 'Inspect'}</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* OWNER EDIT PROFILE TAB */
              <div id="owner-profile-workspace" className="space-y-6">
                <div className="border-b border-neutral-900 pb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-brand" />
                    {lang === 'fr' ? "Profil de Contributeur Protégé" : "Protectable Contributor Profile Context"}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {lang === 'fr' ? "Modifiez vos identifiants pour garantir la confidentialité de l'acheminement" : "Edit credentials ensuring routing privacy verification"}
                  </p>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-6 max-w-xl">
                  {saveSuccess && (
                    <div className="bg-brand/10 border border-brand/20 rounded-xl p-3 text-xs font-mono text-brand flex items-center gap-2 animate-fade-in">
                      <CheckCircle className="h-4 w-4" />
                      <span>
                        {lang === 'fr' 
                          ? "Identifiants de sécurité enregistrés de manière sécurisée !"
                          : "Security credentials committed securely inside browser registry!"}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-mono">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{lang === 'fr' ? "Nom Complet du Participant Réel" : "Real Participant Full Name"}</label>
                      <input 
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{lang === 'fr' ? "Téléphone de Contact Réel" : "Real Vetting Contact Phone"}</label>
                      <input 
                        type="text"
                        required
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="font-mono">
                    <label className="block text-xs text-slate-400 mb-1.5">{lang === 'fr' ? "Canal d'Email Sécurisé Principal" : "Primary Secured Email Route"}</label>
                    <input 
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand focus:outline-none"
                    />
                  </div>

                  {/* Avatar section */}
                  <div className="space-y-3 font-mono">
                    <label className="block text-xs text-slate-400">{lang === 'fr' ? "Avatar Visuel de Représentation Personnel (URL)" : "Personal Representative Visual Avatar (URL)"}</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <img src={profileAvatar} alt="" className="h-14 w-14 rounded-full border border-brand object-cover" />
                      <div className="flex-1 space-y-2">
                        <input 
                          type="text"
                          value={profileAvatar}
                          onChange={(e) => setProfileAvatar(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-[#030303] border border-neutral-850 rounded-xl px-3 py-1.5 text-xs text-white focus:border-brand focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuickAvatarChange('male')}
                            className="bg-neutral-900 border border-neutral-800 text-[10px] py-1 px-2.5 rounded text-slate-300 cursor-pointer"
                          >
                            {lang === 'fr' ? "Image Homme" : "Set Male Image"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAvatarChange('female')}
                            className="bg-neutral-900 border border-neutral-800 text-[10px] py-1 px-2.5 rounded text-slate-300 cursor-pointer"
                          >
                            {lang === 'fr' ? "Image Femme" : "Set Female Image"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-neutral-900 font-mono">
                    <button
                      id="save-owner-profile-btn"
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-brand text-xs font-bold text-[#030303] hover:shadow-[0_0_12px_rgba(166,254,0,0.3)] transition-all cursor-pointer flex items-center gap-2"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {lang === 'fr' ? "ENREGISTRER LES IDENTIFIANTS" : "COMMIT OWNER CREDENTIALS"}
                    </button>
                  </div>
                </form>
              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}
