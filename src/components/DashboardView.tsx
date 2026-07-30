import React, { useState, useEffect } from 'react';
import { User, Listing } from '../types';
import { translateListing } from '../translations';
import { SUPER_ADMIN_EMAIL } from '../mockData';
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
  ArrowRight,
  Crown,
  Users,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency, convertValue, Currency } from '../utils';
import { fetchUsersApi, updateUserRoleApi } from '../api';

interface DashboardViewProps {
  currentUser: User;
  onUpdateProfile: (updatedUser: User) => void;
  listings: Listing[];
  onApprove: (listingId: string, adminId: string) => void;
  onReject: (listingId: string) => void;
  onSelectListing: (listing: Listing) => void;
  onAddListing: () => void;
  currency: Currency;
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
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatar);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isSuperAdmin = currentUser.role === 'superadmin';
  const isAdmin = currentUser.role === 'admin' || isSuperAdmin;

  // Tab state
  const [adminTab, setAdminTab] = useState<'pending' | 'approved' | 'team' | 'profile'>('pending');
  const [ownerTab, setOwnerTab] = useState<'listings' | 'profile'>('listings');

  // Team management state (superadmin only)
  const [teamUsers, setTeamUsers] = useState<User[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState('');
  const [roleUpdateLoading, setRoleUpdateLoading] = useState<string | null>(null);

  // Load team users when team tab is active
  useEffect(() => {
    if (isSuperAdmin && adminTab === 'team') {
      loadTeamUsers();
    }
  }, [adminTab, isSuperAdmin]);

  const loadTeamUsers = async () => {
    setTeamLoading(true);
    setTeamError('');
    try {
      const data = await fetchUsersApi(currentUser.email);
      setTeamUsers(data.users || []);
    } catch (err: any) {
      setTeamError(err?.message || 'Failed to load users');
    } finally {
      setTeamLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'owner' | 'admin') => {
    setRoleUpdateLoading(userId);
    try {
      const result = await updateUserRoleApi(userId, newRole, currentUser.email);
      if (result.success) {
        setTeamUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
        alert(result.message || 'Failed to update role');
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update role');
    } finally {
      setRoleUpdateLoading(null);
    }
  };

  // Stats
  const totalApprovedListings = listings.filter(l => l.status === 'approved');
  const totalPendingListings = listings.filter(l => l.status === 'pending');
  const totalRejectedListings = listings.filter(l => l.status === 'rejected');
  
  const baseBrokeredVolume = totalApprovedListings.reduce((sum, item) => sum + item.price, 0);
  const uniqueOwnerIds = new Set(listings.map(l => l.ownerId));
  const totalContributorsCount = uniqueOwnerIds.size;

  const mySubmissions = listings.filter(l => l.ownerId === currentUser.id);
  const myApprovedCount = mySubmissions.filter(l => l.status === 'approved').length;
  const myPendingCount = mySubmissions.filter(l => l.status === 'pending').length;
  
  const basePortfolioValue = mySubmissions
    .filter(l => l.status === 'approved')
    .reduce((sum, item) => sum + item.price, 0);

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

  const getRoleBadge = (role: string) => {
    if (role === 'superadmin') return { icon: '👑', label: lang === 'fr' ? 'Super Admin' : 'Super Admin', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    if (role === 'admin') return { icon: '🛡️', label: lang === 'fr' ? 'Admin' : 'Admin', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
    return { icon: '👤', label: lang === 'fr' ? 'Propriétaire' : 'Owner', color: 'text-slate-400 bg-neutral-900 border-neutral-800' };
  };

  const myBadge = getRoleBadge(currentUser.role);

  return (
    <div id="dashboard-view-container" className="space-y-8 animate-fadeIn">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0d0d0d] via-[#12180c] to-[#0d0d0d] border border-neutral-850 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Building className="h-64 w-64 text-brand" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'} 
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="h-16 w-16 md:h-20 md:w-20 rounded-2xl border-2 border-brand/40 object-cover shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 h-5 w-5 bg-brand text-[#030303] rounded-full flex items-center justify-center text-[10px] font-bold">✓</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight">{currentUser.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide uppercase border ${myBadge.color}`}>
                  {myBadge.icon} {myBadge.label}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-2">
                <span>{currentUser.email}</span>
                <span>•</span>
                <span>{currentUser.phone || '+212 600-000000'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onAddListing} className="px-5 py-2.5 rounded-xl bg-brand text-[#030303] hover:bg-brand/90 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(166,254,0,0.2)] cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>{lang === 'fr' ? 'Publier un Bien' : 'Add Property'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRICS STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin ? (
          <>
            <div className="bg-[#0c0c0c] border border-neutral-850 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{lang === 'fr' ? 'Volume Global Approuvé' : 'Total Brokered Volume'}</span>
              <div className="text-2xl font-bold font-mono text-brand mt-1">{formatCurrency(baseBrokeredVolume, currency, eurRate)}</div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">{totalApprovedListings.length} {lang === 'fr' ? 'propriétés en ligne' : 'active listings'}</span>
            </div>
            <div className="bg-[#0c0c0c] border border-neutral-850 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{lang === 'fr' ? 'Audits en Attente' : 'Pending Queue'}</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{totalPendingListings.length}</div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">{lang === 'fr' ? 'Nécessite votre validation' : 'Requires admin review'}</span>
            </div>
            <div className="bg-[#0c0c0c] border border-neutral-850 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{lang === 'fr' ? 'Propriétés Actives' : 'Live Properties'}</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{totalApprovedListings.length}</div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">{lang === 'fr' ? 'Publiées sur le portail' : 'Published on portal'}</span>
            </div>
            <div className="bg-[#0c0c0c] border border-neutral-850 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{lang === 'fr' ? 'Partenaires Actifs' : 'Active Owners'}</span>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1">{totalContributorsCount}</div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">{lang === 'fr' ? 'Propriétaires uniques' : 'Unique property owners'}</span>
            </div>
          </>
        ) : (
          <>
            <div className="bg-[#0c0c0c] border border-neutral-850 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{lang === 'fr' ? 'Valeur de mon Portefeuille' : 'My Portfolio Value'}</span>
              <div className="text-2xl font-bold font-mono text-brand mt-1">{formatCurrency(basePortfolioValue, currency, eurRate)}</div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">{myApprovedCount} {lang === 'fr' ? 'biens certifiés' : 'approved listings'}</span>
            </div>
            <div className="bg-[#0c0c0c] border border-neutral-850 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{lang === 'fr' ? 'En Cours de Validation' : 'Pending Verification'}</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{myPendingCount}</div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">{lang === 'fr' ? 'Audit Hostkeys en cours' : 'Hostkeys review in progress'}</span>
            </div>
            <div className="bg-[#0c0c0c] border border-neutral-850 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{lang === 'fr' ? 'Biens Publiés' : 'Live Listings'}</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{myApprovedCount}</div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">{lang === 'fr' ? 'Visibles sur le marché' : 'Visible to public'}</span>
            </div>
            <div className="bg-[#0c0c0c] border border-neutral-850 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{lang === 'fr' ? 'Total des Soumissions' : 'Total Submissions'}</span>
              <div className="text-2xl font-bold font-mono text-slate-200 mt-1">{mySubmissions.length}</div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">{lang === 'fr' ? 'Soumissions immobilières' : 'Property submissions'}</span>
            </div>
          </>
        )}
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-neutral-850 gap-4 text-xs font-mono overflow-x-auto">
        {isAdmin ? (
          <>
            <button onClick={() => setAdminTab('pending')} className={`pb-3 font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${adminTab === 'pending' ? 'border-brand text-brand' : 'border-transparent text-slate-400 hover:text-white'}`}>
              📋 {lang === 'fr' ? 'Validation' : 'Pending Queue'} ({totalPendingListings.length})
            </button>
            <button onClick={() => setAdminTab('approved')} className={`pb-3 font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${adminTab === 'approved' ? 'border-brand text-brand' : 'border-transparent text-slate-400 hover:text-white'}`}>
              ✅ {lang === 'fr' ? 'Actives' : 'Live Properties'} ({totalApprovedListings.length})
            </button>
            {isSuperAdmin && (
              <button onClick={() => setAdminTab('team')} className={`pb-3 font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${adminTab === 'team' ? 'border-brand text-brand' : 'border-transparent text-slate-400 hover:text-white'}`}>
                👑 {lang === 'fr' ? 'Gestion Équipe' : 'Team Management'}
              </button>
            )}
            <button onClick={() => setAdminTab('profile')} className={`pb-3 font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${adminTab === 'profile' ? 'border-brand text-brand' : 'border-transparent text-slate-400 hover:text-white'}`}>
              ⚙️ {lang === 'fr' ? 'Profil' : 'Profile'}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setOwnerTab('listings')} className={`pb-3 font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${ownerTab === 'listings' ? 'border-brand text-brand' : 'border-transparent text-slate-400 hover:text-white'}`}>
              🏠 {lang === 'fr' ? 'Mes Biens' : 'My Properties'} ({mySubmissions.length})
            </button>
            <button onClick={() => setOwnerTab('profile')} className={`pb-3 font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${ownerTab === 'profile' ? 'border-brand text-brand' : 'border-transparent text-slate-400 hover:text-white'}`}>
              ⚙️ {lang === 'fr' ? 'Profil' : 'Profile'}
            </button>
          </>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="bg-[#0c0c0c] border border-neutral-850 rounded-2xl p-6 min-h-[400px]">
        {isAdmin ? (
          adminTab === 'pending' ? (
            /* PENDING QUEUE */
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-brand" />
                {lang === 'fr' ? 'File des Audits de Validation' : 'Pending Property Verification Queue'}
              </h3>

              {totalPendingListings.length === 0 ? (
                <div className="text-center py-16 bg-[#030303] rounded-xl border border-neutral-900">
                  <CheckCircle className="h-12 w-12 text-brand mx-auto opacity-70 mb-3" />
                  <h4 className="text-white font-semibold">{lang === 'fr' ? 'Aucune propriété en attente' : 'No Pending Properties'}</h4>
                  <p className="text-xs font-mono text-slate-400 mt-1">{lang === 'fr' ? 'Toutes les soumissions ont été vérifiées.' : 'All submitted properties have been reviewed.'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {totalPendingListings.map(listing => (
                    <div key={listing.id} className="bg-[#030303] border border-neutral-850 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img src={listing.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&h=150&q=80'} alt={listing.title} className="h-16 w-24 rounded-lg object-cover border border-neutral-800" />
                        <div>
                          <h4 className="text-sm font-semibold text-white">{listing.title}</h4>
                          <p className="text-xs font-mono text-brand mt-0.5">{formatCurrency(listing.price, currency, eurRate)} • {listing.location}</p>
                          <p className="text-[11px] font-mono text-slate-400 mt-1">Owner: {listing.personalOwnerInfo?.name || listing.ownerId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button onClick={() => onApprove(listing.id, currentUser.id)} className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black font-mono text-xs font-bold transition-all border border-emerald-500/20 cursor-pointer">
                          ✓ {lang === 'fr' ? 'Approuver' : 'Approve'}
                        </button>
                        <button onClick={() => onReject(listing.id)} className="px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white font-mono text-xs font-bold transition-all border border-rose-500/20 cursor-pointer">
                          ✕ {lang === 'fr' ? 'Refuser' : 'Refuse'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : adminTab === 'approved' ? (
            /* APPROVED PROPERTIES */
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                {lang === 'fr' ? 'Propriétés Actives sur Hostkeys' : 'Live Hostkeys Properties'}
              </h3>
              {totalApprovedListings.length === 0 ? (
                <div className="text-center py-16 bg-[#030303] rounded-xl border border-neutral-900">
                  <Building className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-white font-semibold">{lang === 'fr' ? 'Aucune propriété active' : 'No Live Properties'}</h4>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {totalApprovedListings.map(listing => (
                    <div key={listing.id} onClick={() => onSelectListing(listing)} className="bg-[#030303] border border-neutral-850 rounded-xl p-3 cursor-pointer hover:border-brand/30 transition-all">
                      <img src={listing.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&h=250&q=80'} alt={listing.title} className="w-full h-36 rounded-lg object-cover mb-3" />
                      <h4 className="text-xs font-semibold text-white line-clamp-1">{listing.title}</h4>
                      <p className="text-xs font-mono text-brand mt-1">{formatCurrency(listing.price, currency, eurRate)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : adminTab === 'team' && isSuperAdmin ? (
            /* TEAM MANAGEMENT — SUPER ADMIN ONLY */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-400" />
                  {lang === 'fr' ? 'Gestion de l\'Équipe' : 'Team & Role Management'}
                </h3>
                <button onClick={loadTeamUsers} className="px-3 py-1.5 rounded-lg bg-neutral-900 text-slate-400 hover:text-white font-mono text-xs border border-neutral-800 cursor-pointer">
                  {lang === 'fr' ? '↻ Rafraîchir' : '↻ Refresh'}
                </button>
              </div>

              <p className="text-xs font-mono text-slate-400">
                {lang === 'fr' ? 'En tant que Super Admin, vous pouvez promouvoir ou rétrograder les utilisateurs.' : 'As Super Admin, you can promote users to Admin or demote them back to Owner.'}
              </p>

              {teamLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin h-8 w-8 border-2 border-brand border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="text-xs font-mono text-slate-400">{lang === 'fr' ? 'Chargement...' : 'Loading users...'}</p>
                </div>
              ) : teamError ? (
                <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl border border-rose-500/20 text-xs font-mono">{teamError}</div>
              ) : teamUsers.length === 0 ? (
                <div className="text-center py-16 bg-[#030303] rounded-xl border border-neutral-900">
                  <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-white font-semibold">{lang === 'fr' ? 'Aucun utilisateur enregistré' : 'No Registered Users'}</h4>
                  <p className="text-xs font-mono text-slate-400 mt-1">{lang === 'fr' ? 'Les utilisateurs apparaîtront ici lorsqu\'ils s\'inscriront.' : 'Users will appear here when they sign up.'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamUsers.map(user => {
                    const badge = getRoleBadge(user.role);
                    const isYou = user.id === currentUser.id;
                    const isSA = user.email === SUPER_ADMIN_EMAIL;
                    
                    return (
                      <div key={user.id} className={`bg-[#030303] border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${isSA ? 'border-amber-500/30' : 'border-neutral-850'}`}>
                        <div className="flex items-center gap-3">
                          <img src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80'} alt={user.name} referrerPolicy="no-referrer" className="h-10 w-10 rounded-full border border-neutral-700 object-cover" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white">{user.name}</span>
                              {isYou && <span className="text-[9px] font-mono text-brand bg-brand/10 px-1.5 py-0.5 rounded-full">{lang === 'fr' ? 'Vous' : 'You'}</span>}
                            </div>
                            <p className="text-[11px] font-mono text-slate-400">{user.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase border ${badge.color}`}>
                            {badge.icon} {badge.label}
                          </span>
                          
                          {/* Role change buttons — not for super admin themselves */}
                          {!isSA && (
                            <div className="flex items-center gap-1.5">
                              {user.role !== 'admin' ? (
                                <button
                                  onClick={() => handleRoleChange(user.id, 'admin')}
                                  disabled={roleUpdateLoading === user.id}
                                  className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500 hover:text-white font-mono text-[10px] font-bold transition-all border border-sky-500/20 cursor-pointer disabled:opacity-50"
                                >
                                  {roleUpdateLoading === user.id ? '...' : (lang === 'fr' ? '↑ Promouvoir Admin' : '↑ Promote to Admin')}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRoleChange(user.id, 'owner')}
                                  disabled={roleUpdateLoading === user.id}
                                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white font-mono text-[10px] font-bold transition-all border border-rose-500/20 cursor-pointer disabled:opacity-50"
                                >
                                  {roleUpdateLoading === user.id ? '...' : (lang === 'fr' ? '↓ Rétrograder' : '↓ Demote to Owner')}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* PROFILE TAB */
            <form onSubmit={handleProfileSave} className="max-w-md space-y-4 font-mono text-xs">
              <h3 className="text-lg font-semibold text-white font-sans">{lang === 'fr' ? 'Informations du Compte' : 'Account Profile'}</h3>
              {saveSuccess && (
                <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>{lang === 'fr' ? 'Profil mis à jour avec succès !' : 'Profile updated successfully!'}</span>
                </div>
              )}
              <div>
                <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Nom Complet' : 'Full Name'}</label>
                <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:border-brand focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Adresse Email' : 'Email Address'}</label>
                <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:border-brand focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Téléphone' : 'Phone Number'}</label>
                <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:border-brand focus:outline-none" />
              </div>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-brand text-[#030303] font-bold hover:bg-brand/90 transition-all cursor-pointer">
                {lang === 'fr' ? 'Enregistrer le Profil' : 'Save Changes'}
              </button>
            </form>
          )
        ) : (
          /* OWNER WORKSPACE */
          ownerTab === 'listings' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Building className="h-5 w-5 text-brand" />
                  {lang === 'fr' ? 'Mes Biens Immobiliers' : 'My Real Estate Portfolio'}
                </h3>
                <button onClick={onAddListing} className="px-3 py-1.5 rounded-lg bg-brand text-[#030303] font-bold font-mono text-xs flex items-center gap-1 cursor-pointer">
                  <Plus className="h-3.5 w-3.5" />
                  <span>{lang === 'fr' ? 'Publier un Bien' : 'Add Property'}</span>
                </button>
              </div>

              {mySubmissions.length === 0 ? (
                <div className="text-center py-16 bg-[#030303] rounded-xl border border-neutral-900">
                  <Building className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-white font-semibold">{lang === 'fr' ? 'Aucune propriété publiée' : 'No Properties Listed Yet'}</h4>
                  <p className="text-xs font-mono text-slate-400 mt-1 max-w-sm mx-auto">{lang === 'fr' ? 'Cliquez sur le bouton pour soumettre votre premier bien.' : 'Click "Add Property" to publish your first listing.'}</p>
                  <button onClick={onAddListing} className="mt-4 px-4 py-2 rounded-xl bg-brand text-[#030303] font-bold font-mono text-xs inline-flex items-center gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    <span>{lang === 'fr' ? 'Publier ma Première Propriété' : 'Publish My First Property'}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mySubmissions.map(listing => (
                    <div key={listing.id} onClick={() => onSelectListing(listing)} className="bg-[#030303] border border-neutral-850 rounded-xl p-3 cursor-pointer hover:border-brand/30 transition-all">
                      <div className="relative">
                        <img src={listing.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&h=250&q=80'} alt={listing.title} className="w-full h-36 rounded-lg object-cover mb-3" />
                        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase ${listing.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : (listing.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30')}`}>
                          {listing.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-white line-clamp-1">{listing.title}</h4>
                      <p className="text-xs font-mono text-brand mt-1">{formatCurrency(listing.price, currency, eurRate)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* PROFILE TAB */
            <form onSubmit={handleProfileSave} className="max-w-md space-y-4 font-mono text-xs">
              <h3 className="text-lg font-semibold text-white font-sans">{lang === 'fr' ? 'Informations du Compte' : 'Account Profile'}</h3>
              {saveSuccess && (
                <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>{lang === 'fr' ? 'Profil mis à jour !' : 'Profile updated!'}</span>
                </div>
              )}
              <div>
                <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Nom Complet' : 'Full Name'}</label>
                <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:border-brand focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Adresse Email' : 'Email Address'}</label>
                <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:border-brand focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Téléphone' : 'Phone Number'}</label>
                <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:border-brand focus:outline-none" />
              </div>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-brand text-[#030303] font-bold hover:bg-brand/90 transition-all cursor-pointer">
                {lang === 'fr' ? 'Enregistrer' : 'Save Changes'}
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
}
