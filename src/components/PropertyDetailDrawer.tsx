import React, { useState, useEffect } from 'react';
import { Listing, User } from '../types';
import { 
  Bed, 
  DoorOpen,
  Bath, 
  Maximize, 
  Maximize2,
  ZoomIn,
  ShieldCheck, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  X, 
  Copy, 
  Check,
  CheckCircle,
  Compass,
  ChevronLeft,
  ChevronRight,
  Share2,
  Trash2,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, convertValue, Currency } from '../utils';
import { t } from '../translations';
import ShareModal from './ShareModal';

const MOROCCO_VILLA_IMAGES = [
  "https://images.unsplash.com/photo-1549294413-26f195afcbce?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
];

interface PropertyDetailDrawerProps {
  listing: Listing;
  currentUser?: User | null;
  agents?: User[];
  onClose: () => void;
  onEditListing?: (listing: Listing) => void;
  onDeleteListing?: (listingId: string) => void;
  adminUser?: User;
  currency: Currency;
  eurRate: number;
  lang: 'en' | 'fr';
}

export default function PropertyDetailDrawer({ listing, currentUser, agents = [], onClose, onEditListing, onDeleteListing, adminUser, currency, eurRate, lang }: PropertyDetailDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [showBrokerDirect, setShowBrokerDirect] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const isSuperAdmin = currentUser && currentUser.email === 'yassinesadik0@gmail.com';
  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin' || isSuperAdmin);
  const isOwner = currentUser && listing.ownerId === currentUser.id;
  const canEdit = isAdmin;
  const canDelete = isAdmin || isOwner;

  const renderAgentAvatar = (agent: User, size = "h-10 w-10", textSize = "text-sm") => {
    const nameToUse = agent?.name || agent?.email || 'Agent';
    const initial = nameToUse.charAt(0).toUpperCase();

    if (agent?.avatar && agent.avatar.trim() !== '') {
      return (
        <img 
          src={agent.avatar} 
          alt={nameToUse}
          referrerPolicy="no-referrer"
          className={`${size} rounded-full border border-brand/30 object-cover`} 
        />
      );
    }

    return (
      <div className={`${size} rounded-full bg-brand text-[#030303] font-bold flex items-center justify-center border border-brand/40 font-mono ${textSize} uppercase shadow-md shrink-0`}>
        {initial}
      </div>
    );
  };

  const propertyImages = (
    listing.images && listing.images.length > 0 
      ? listing.images 
      : [
          listing.image,
          MOROCCO_VILLA_IMAGES[(listing.id.charCodeAt(0) || 0) % MOROCCO_VILLA_IMAGES.length],
          MOROCCO_VILLA_IMAGES[(listing.id.charCodeAt(listing.id.length - 1) || 1) % MOROCCO_VILLA_IMAGES.length],
          MOROCCO_VILLA_IMAGES[Math.abs(listing.price) % MOROCCO_VILLA_IMAGES.length]
        ]
  ).filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  // Keyboard navigation for full-screen Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCurrentImgIndex((prev) => (prev + 1) % propertyImages.length);
      else if (e.key === 'ArrowLeft') setCurrentImgIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
      else if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, propertyImages.length]);

  const isDirectAdminListing = listing.ownerId.startsWith('admin');
  const contactName = isDirectAdminListing
    ? (listing.personalOwnerInfo.name || "Hostkeys Support")
    : (adminUser?.name || "Hostkeys Support");
  
  const contactEmail = isDirectAdminListing
    ? (listing.personalOwnerInfo.email || "support@hostkeys.ma")
    : (adminUser?.email || "support@hostkeys.ma");

  const contactPhone = isDirectAdminListing
    ? (listing.personalOwnerInfo.phone || "+212 522 000000")
    : (adminUser?.phone || "+212 522 000000");

  const contactAvatar = isDirectAdminListing
    ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
    : (adminUser?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80");

  const isMyListing = currentUser && listing.ownerId === currentUser.id;

  const handleSystemShare = async () => {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const shareUrl = `${window.location.origin}${window.location.pathname}?property=${listing.id}`;
    const priceFormatted = formatCurrency(listing.price, currency, eurRate, true, listing.type);
    const shareTitle = `${listing.title} - Hostkeys`;
    const shareText = `Check out this property on Hostkeys: ${listing.title} (${listing.location}) - ${priceFormatted}`;

    if (isMobileDevice && typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function') {
      try {
        await (navigator as any).share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (e) {
        // User closed native share menu
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {}
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div 
        id="property-drawer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Drawer Container */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative z-10 w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-[#0b0b0b] border-l border-neutral-900 h-full flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-[#030303]/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand/10 text-brand border border-brand/20 px-2.5 py-0.5 text-[10px] font-bold font-mono uppercase tracking-wider">
              {listing.type === 'buy' ? t('cardForSale', lang) : t('cardForRent', lang)}
            </span>
            <span className="text-[10px] font-mono text-neutral-450 uppercase">{lang === 'fr' ? 'PROPRIÉTÉ HOSTKEYS CERTIFIÉE' : 'HOSTKEYS VERIFIED PROPERTY'}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-brand transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body Scroll Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cover image slider / carousel */}
          <div 
            className="relative h-60 md:h-72 rounded-xl overflow-hidden bg-neutral-950/45 border border-neutral-900 group cursor-pointer select-none"
            onClick={() => setIsLightboxOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImgIndex}
                src={propertyImages[currentImgIndex]} 
                referrerPolicy="no-referrer"
                alt={listing.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {/* Click to expand overlay hint */}
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
              <div className="bg-black/80 text-white px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-mono flex items-center gap-1.5 backdrop-blur-md shadow-2xl">
                <ZoomIn className="h-4 w-4 text-brand" />
                <span>{lang === 'fr' ? 'Agrandir la photo' : 'Click to Expand'}</span>
              </div>
            </div>
            
            {/* Slider controls */}
            {propertyImages.length > 1 && (
              <>
                <button
                  onClick={(e) => handlePrevPhoto(e)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/75 border border-neutral-900 text-slate-300 hover:text-brand hover:scale-110 flex items-center justify-center transition-all z-20 cursor-pointer"
                  title="Previous Photo"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => handleNextPhoto(e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/75 border border-neutral-900 text-slate-300 hover:text-brand hover:scale-110 flex items-center justify-center transition-all z-20 cursor-pointer"
                  title="Next Photo"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/80 border border-neutral-800 text-[10px] font-mono text-slate-300 backdrop-blur-md flex items-center gap-1.5">
                  <Maximize2 className="h-3 w-3 text-brand" />
                  <span>{currentImgIndex + 1} / {propertyImages.length}</span>
                </div>
              </>
            )}
            
            {isMyListing && (
              <span className="absolute top-4 left-4 z-20 rounded-full bg-[#030303]/90 px-3 py-1 text-xs font-medium text-brand border border-brand/20 backdrop-blur-md">
                {t('cardYourSubmission', lang)}
              </span>
            )}
          </div>

          {/* Title, price and location */}
          <div className="space-y-3 pb-5 border-b border-neutral-900">
            <div className="flex items-center gap-1.5 text-brand font-mono text-xs font-semibold">
              <MapPin className="h-3.5 w-3.5" />
              <span>{listing.location}, {lang === 'fr' ? 'Maroc' : 'Morocco'}</span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">{listing.title}</h2>
            
            <div className="flex items-baseline gap-2 bg-[#030303]/70 p-3.5 rounded-xl border border-neutral-900">
              <span className="text-2xl font-bold font-mono text-brand">
                {formatCurrency(listing.price, currency, eurRate, true, listing.type)}
              </span>
              <span className="text-neutral-500 font-mono text-[10px] uppercase">
                {t(listing.type === 'buy' ? 'drawerEstValuation' : 'drawerEstRentalRate', lang)}
              </span>
            </div>
          </div>

          {/* Metric specs breakdown */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">{lang === 'fr' ? 'Caractéristiques' : 'Property Specifications'}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#030303] rounded-xl p-3 border border-neutral-900">
                <DoorOpen className="h-4 w-4 text-brand mb-1" />
                <p className="text-[10px] text-neutral-500 font-mono uppercase">{lang === 'fr' ? 'Chambres' : 'Bedrooms'}</p>
                <p className="text-sm font-bold text-slate-200 font-mono">{listing.bedrooms} {listing.bedrooms === 1 ? t('cardBedroom', lang) : t('cardBedrooms', lang)}</p>
              </div>
              <div className="bg-[#030303] rounded-xl p-3 border border-neutral-900">
                <Bed className="h-4 w-4 text-brand mb-1" />
                <p className="text-[10px] text-neutral-500 font-mono uppercase">{lang === 'fr' ? 'Lits' : 'Beds'}</p>
                <p className="text-sm font-bold text-slate-200 font-mono">{listing.beds || listing.bedrooms} {(listing.beds || listing.bedrooms) === 1 ? t('cardBed', lang) : t('cardBeds', lang)}</p>
              </div>
              <div className="bg-[#030303] rounded-xl p-3 border border-neutral-900">
                <Bath className="h-4 w-4 text-brand mb-1" />
                <p className="text-[10px] text-neutral-500 font-mono uppercase">{lang === 'fr' ? 'Salles de bain' : 'Bathrooms'}</p>
                <p className="text-sm font-bold text-slate-200 font-mono">{listing.bathrooms} {listing.bathrooms === 1 ? t('cardBath', lang) : t('cardBaths', lang)}</p>
              </div>
              <div className="bg-[#030303] rounded-xl p-3 border border-neutral-900">
                <Maximize className="h-4 w-4 text-brand mb-1" />
                <p className="text-[10px] text-neutral-500 font-mono uppercase">{lang === 'fr' ? 'Surface' : 'Area'}</p>
                <p className="text-sm font-bold text-slate-200 font-mono">{listing.squareMeters} m²</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">{lang === 'fr' ? 'Description' : 'Property Overview'}</h3>
            <div className="bg-[#030303] p-4 rounded-xl border border-neutral-900 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
              {listing.description}
            </div>
          </div>

          {/* Amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">{t('drawerAmenitiesTitle', lang)}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {listing.amenities.map((amenity, idx) => (
                  <div key={idx} className="bg-[#030303] border border-neutral-900 px-3 py-2 rounded-xl flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-brand shrink-0" />
                    <span className="text-xs text-slate-300 font-mono leading-tight">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Representative Security & 3 Assigned Advisory Agents */}
          <div className="bg-[#0f0f0f] p-5 rounded-xl border border-neutral-900 hover:border-brand/20 transition-all space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-brand font-bold">
              <ShieldCheck className="h-4.5 w-4.5 text-brand shrink-0" />
              <span className="uppercase text-[11px] tracking-wider">{t('drawerBrokerContactHeader', lang)}</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              {t('cardVettedAdvisoryNotice', lang)}
            </p>

            {/* If direct admin personal info exists */}
            {isDirectAdminListing && (
              <div className="bg-[#030303] border border-neutral-850 p-3 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img src={contactAvatar} alt={contactName} className="h-10 w-10 rounded-full border border-brand/30 object-cover" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-brand border border-[#030303]" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-white block">{contactName}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{contactPhone}</span>
                  </div>
                </div>
                <a 
                  href={`tel:${contactPhone}`} 
                  className="px-3 py-1.5 rounded-lg bg-brand text-[#030303] font-bold text-xs flex items-center gap-1.5 hover:bg-brand/90 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{lang === 'fr' ? 'Appeler' : 'Call'}</span>
                </a>
              </div>
            )}

            {/* List of Real Active Agents */}
            {agents && agents.length > 0 && (
              <div className="border-t border-neutral-900 pt-3.5 space-y-3">
                <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  {lang === 'fr' ? 'Conseiller(s) Dédié(s)' : 'Assigned Agent(s)'} ({agents.length})
                </span>
                <div className="space-y-2.5">
                  {agents.map((agent, idx) => (
                    <div key={agent?.id || `agent-${idx}`} className="bg-[#030303] border border-neutral-850 p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-w-0">
                      <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                        <div className="relative shrink-0">
                          {renderAgentAvatar(agent, "h-10 w-10", "text-sm")}
                          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-brand border border-[#030303]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-xs text-white truncate max-w-[150px] sm:max-w-none">{agent?.name || agent?.email?.split('@')[0] || 'Agent'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono truncate max-w-[200px] sm:max-w-none">{agent?.email || 'admin@hostkeys.ma'}</span>
                        </div>
                      </div>
                      <a
                        href={`tel:${agent?.phone || '+212 600-000000'}`}
                        className="px-2.5 py-1.5 rounded-lg bg-brand/10 hover:bg-brand text-brand hover:text-[#030303] text-[10px] font-bold font-mono transition-all border border-brand/20 cursor-pointer flex items-center gap-1.5"
                      >
                        <Phone className="h-3 w-3 shrink-0" />
                        <span>{agent?.phone || '+212 600-000000'}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sliding actions footer */}
        <div className="bg-[#030303] border-t border-neutral-900 px-6 py-4 flex flex-col gap-3 font-mono text-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-brand" /> Hostkeys Certified
            </span>
            <span>Ref: {listing.id.toUpperCase()}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSystemShare}
              className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-neutral-850 text-neutral-300 hover:text-brand hover:bg-[#0b0b0b] transition-all cursor-pointer min-w-[120px]"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4 text-brand" />}
              <span>{copied ? (lang === 'fr' ? 'Lien Copié !' : 'Link Copied!') : (lang === 'fr' ? 'Partager' : 'Share')}</span>
            </button>

            {canEdit && onEditListing && (
              <button
                onClick={() => onEditListing(listing)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white border border-sky-500/20 font-bold transition-all cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
                <span>{lang === 'fr' ? 'Éditer' : 'Edit'}</span>
              </button>
            )}

            {canDelete && onDeleteListing && (
              <button
                onClick={() => {
                  if (confirm(lang === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette propriété ?' : 'Are you sure you want to delete this property?')) {
                    onDeleteListing(listing.id);
                  }
                }}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 font-bold transition-all cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>{lang === 'fr' ? 'Supprimer' : 'Delete'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border border-neutral-800 transition-all cursor-pointer text-center font-bold min-w-[120px]"
            >
              {lang === 'fr' ? 'Fermer le panneau' : 'Close Drawer'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* FULLSCREEN EXPANDED IMAGE LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar */}
            <div 
              className="flex items-center justify-between w-full max-w-7xl mx-auto z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm md:text-base font-bold text-white font-sans truncate max-w-md">{listing.title}</span>
                <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-brand font-semibold">
                  {currentImgIndex + 1} / {propertyImages.length}
                </span>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-slate-300 hover:text-white border border-neutral-800 transition-all cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Main Stage Image & Navigation Arrows */}
            <div 
              className="relative flex-1 flex items-center justify-center my-3 overflow-hidden w-full max-w-7xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {propertyImages.length > 1 && (
                <button
                  onClick={(e) => handlePrevPhoto(e)}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/80 hover:bg-brand text-slate-200 hover:text-[#030303] border border-neutral-800 hover:border-brand flex items-center justify-center transition-all z-20 cursor-pointer shadow-2xl hover:scale-110"
                  title="Previous Photo (Left Arrow)"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImgIndex}
                  src={propertyImages[currentImgIndex]}
                  referrerPolicy="no-referrer"
                  alt={`${listing.title} - photo ${currentImgIndex + 1}`}
                  className="max-h-[75vh] md:max-h-[82vh] max-w-full object-contain rounded-2xl shadow-2xl border border-neutral-900 select-none"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>

              {propertyImages.length > 1 && (
                <button
                  onClick={(e) => handleNextPhoto(e)}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/80 hover:bg-brand text-slate-200 hover:text-[#030303] border border-neutral-800 hover:border-brand flex items-center justify-center transition-all z-20 cursor-pointer shadow-2xl hover:scale-110"
                  title="Next Photo (Right Arrow)"
                >
                  <ChevronRight className="h-7 w-7" />
                </button>
              )}
            </div>

            {/* Bottom Thumbnails Strip */}
            {propertyImages.length > 1 && (
              <div 
                className="w-full max-w-4xl mx-auto flex items-center justify-center gap-2.5 overflow-x-auto py-2 px-4 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {propertyImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`relative h-14 w-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      idx === currentImgIndex
                        ? 'border-brand scale-105 shadow-[0_0_20px_rgba(0,240,255,0.5)]'
                        : 'border-neutral-850 opacity-50 hover:opacity-100 hover:border-neutral-600'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      referrerPolicy="no-referrer"
                      alt={`thumbnail-${idx}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
