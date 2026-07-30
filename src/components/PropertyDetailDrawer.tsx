import React, { useState, useEffect } from 'react';
import { Listing, User } from '../types';
import { 
  Bed, 
  Bath, 
  Maximize, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  X, 
  Copy, 
  Check,
  Compass,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, convertValue } from '../utils';
import { t } from '../translations';

const MOROCCO_VILLA_IMAGES = [
  "https://images.unsplash.com/photo-1549294413-26f195afcbce?auto=format&fit=crop&w=1200&q=80", // Marrakech Riad
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80", // Villa pool
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80", // Luxury modern villa
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", // Coastal villa
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80", // Desert riad
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", // Premium villa interior
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", // Morocco sunset villa
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"  // Moroccan design bedroom
];

interface PropertyDetailDrawerProps {
  listing: Listing;
  currentUser: User;
  onClose: () => void;
  adminUser?: User;
  currency: 'USD' | 'EUR';
  eurRate: number;
  lang: 'en' | 'fr';
}

export default function PropertyDetailDrawer({ listing, currentUser, onClose, adminUser, currency, eurRate, lang }: PropertyDetailDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [showBrokerDirect, setShowBrokerDirect] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Generate dynamic scenic Moroccan villa picture set for beautiful cycling list
  const propertyImages = [
    listing.image,
    MOROCCO_VILLA_IMAGES[(listing.id.charCodeAt(0) || 0) % MOROCCO_VILLA_IMAGES.length],
    MOROCCO_VILLA_IMAGES[(listing.id.charCodeAt(listing.id.length - 1) || 1) % MOROCCO_VILLA_IMAGES.length],
    MOROCCO_VILLA_IMAGES[Math.abs(listing.price) % MOROCCO_VILLA_IMAGES.length]
  ].filter((v, i, a) => a.indexOf(v) === i);

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  // Support swipability with touch listeners
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      handleNextPhoto();
    }
    if (isRightSwipe) {
      handlePrevPhoto();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Address lookup calculations or values
  const isDirectAdminListing = listing.ownerId.startsWith('admin');
  const contactName = isDirectAdminListing
    ? (listing.personalOwnerInfo.name || "Marcus Sterling")
    : (adminUser?.name || "Marcus Sterling (Lead Broker)");
  
  const contactEmail = isDirectAdminListing
    ? (listing.personalOwnerInfo.email || "marcus.sterling@primeestates.ma")
    : (adminUser?.email || "marcus.sterling@primeestates.ma");

  const contactPhone = isDirectAdminListing
    ? (listing.personalOwnerInfo.phone || "+212 522-902206")
    : (adminUser?.phone || "+212 522-902206");

  const contactAvatar = isDirectAdminListing
    ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
    : (adminUser?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80");

  const convertedPrice = currency === 'EUR' ? listing.price * eurRate : listing.price;
  const pricePerSqMeter = Math.round(convertedPrice / listing.squareMeters);
  const isMyListing = listing.ownerId === currentUser.id;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Prevent scroll propagation on body when drawer is active
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
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <motion.div 
        id="property-drawer-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 210 }}
        className="relative z-10 w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-[#0b0b0b] border-l border-neutral-900 h-full flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-[#030303]/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand/10 text-brand border border-brand/20 px-2.5 py-0.5 text-[10px] font-bold font-mono uppercase tracking-wider">
              {listing.type === 'buy' ? t('cardForSale', lang) : t('cardForRent', lang)}
            </span>
            <span className="text-[10px] font-mono text-neutral-450 uppercase">{lang === 'fr' ? 'MÉTRIQUES DE PRESTIGE PRIME' : 'PRIME MOROCCO METRICS'}</span>
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
            className="relative h-56 md:h-64 rounded-xl overflow-hidden bg-neutral-950/45 border border-neutral-900 group cursor-pointer select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => handleNextPhoto()}
            title="Click to view next image, swipe or use arrows to navigate"
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImgIndex}
                src={propertyImages[currentImgIndex]} 
                referrerPolicy="no-referrer"
                alt={`${listing.title} - View ${currentImgIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b]/90 via-transparent to-transparent pointer-events-none" />
            
            {/* Navigation Chevron Arrows */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/65 border border-neutral-900 text-slate-300 hover:text-brand hover:scale-110 flex items-center justify-center transition-all z-10 cursor-pointer"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={handleNextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/65 border border-neutral-900 text-slate-300 hover:text-brand hover:scale-110 flex items-center justify-center transition-all z-10 cursor-pointer"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>

            {/* Slider count indicators */}
            <div className="absolute bottom-4 right-4 z-10 rounded-full bg-black/75 border border-neutral-900 px-2.5 py-0.5 text-[10px] font-mono text-slate-300">
              {currentImgIndex + 1} / {propertyImages.length}
            </div>

            {/* Progress dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 bg-black/40 px-2.5 py-1.5 rounded-full backdrop-blur-md">
              {propertyImages.map((_, dotIdx) => (
                <div 
                  key={dotIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImgIndex(dotIdx);
                  }}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${dotIdx === currentImgIndex ? 'bg-brand w-3' : 'bg-slate-500/60 hover:bg-slate-300'}`}
                />
              ))}
            </div>
            
            {isMyListing && (
              <span className="absolute top-4 left-4 z-10 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">{lang === 'fr' ? 'Configuration Métrique' : 'Metric Configuration'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#030303] rounded-xl p-3 border border-neutral-900">
                <Bed className="h-5 w-5 text-brand mb-1.5" />
                <span className="block text-sm font-semibold text-white">{listing.bedrooms} {listing.bedrooms === 1 ? t('cardBed', lang) : t('cardBeds', lang)}</span>
                <span className="text-[10px] text-neutral-400 font-mono">{lang === 'fr' ? "Chambres d'exception" : 'Premium Bedspaces'}</span>
              </div>
              <div className="bg-[#030303] rounded-xl p-3 border border-neutral-900">
                <Bath className="h-5 w-5 text-brand mb-1.5" />
                <span className="block text-sm font-semibold text-white">{listing.bathrooms} {listing.bathrooms === 1 ? t('cardBath', lang) : t('cardBaths', lang)}</span>
                <span className="text-[10px] text-neutral-400 font-mono">{lang === 'fr' ? "Design Céramique" : 'Ceramic Design'}</span>
              </div>
              <div className="bg-[#030303] rounded-xl p-3 border border-neutral-900">
                <Maximize className="h-5 w-5 text-brand mb-1.5" />
                <span className="block text-sm font-semibold text-white">{listing.squareMeters} m²</span>
                <span className="text-[10px] text-neutral-400 font-mono">{lang === 'fr' ? 'Surface Intérieure' : 'Interior Floor Space'}</span>
              </div>
              <div className="bg-[#030303] rounded-xl p-3 border border-neutral-900">
                <Compass className="h-5 w-5 text-brand mb-1.5" />
                <span className="block text-sm font-semibold text-white">
                  {currency === 'EUR' ? '€' : '$'}{pricePerSqMeter.toLocaleString()} / m²
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">{t('drawerUnitCost', lang)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">{lang === 'fr' ? 'Récit Architectural' : 'Architectural Narrative'}</h3>
            <p className="text-neutral-300 text-sm leading-relaxed font-sans">
              {listing.description}
            </p>
          </div>

          {/* Full Amenities */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">{t('drawerAmenitiesTitle', lang)} ({listing.amenities.length})</h3>
            <div className="grid grid-cols-2 gap-2">
              {listing.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#030303] border border-neutral-900 rounded-lg p-2.5 text-xs text-neutral-300 font-mono">
                  <Check className="h-3.5 w-3.5 text-brand shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Representative Identity & Connection */}
          <div className="bg-[#0f0f0f] p-5 rounded-xl border border-neutral-900 hover:border-brand/20 transition-all space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-brand font-bold">
              <ShieldCheck className="h-4.5 w-4.5" />
              <span>{t('drawerBrokerIdentityMask', lang).toUpperCase()}</span>
            </div>
            <p className="text-neutral-300 leading-relaxed font-sans text-xs">
              {lang === 'fr' 
                ? "Cette annonce marocaine est certifiée sous le code de conformité MA-CAS-2026. L'identité du propriétaire a été masquée pour garantir une sécurité absolue. Les administrateurs de Prime filtrent les demandes d'acheteurs et planifient des visites exclusives physiques ou virtuelles au Maroc." 
                : "This Moroccan listing is verified under compliance code MA-CAS-2026. The private owner profile has been masked for direct protection. Prime administrators vet buyer requests and schedule exclusive digital or physically representative tours in Morocco destinations."}
            </p>
            <div className="border-t border-neutral-900 pt-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={contactAvatar} 
                  alt={contactName} 
                  className="h-9 w-9 rounded-full border border-brand/20 object-cover"
                />
                <div>
                  <div className="flex items-center gap-1 text-slate-200">
                    <span className="font-semibold text-xs">{contactName}</span>
                    <span className="text-brand">✓</span>
                  </div>
                  <span className="text-[10px] text-neutral-450 block">{t('drawerContactOwnerLabel', lang)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowBrokerDirect(!showBrokerDirect)}
                className="w-full rounded-lg bg-brand px-4 py-2 text-xs font-bold text-[#030303] hover:shadow-[0_0_12px_rgba(166,254,0,0.3)] transition-all cursor-pointer text-center"
              >
                {showBrokerDirect ? (lang === 'fr' ? 'Masquer les coordonnées' : 'Hide Direct Contact lines') : t('drawerContactButton', lang)}
              </button>
            </div>

            {showBrokerDirect && (
              <div className="bg-[#030303] p-4 rounded-lg border border-brand/20 mt-3 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Mail className="h-3.5 w-3.5 text-brand" />
                  <span className="font-semibold text-neutral-200">Email:</span>
                  <a href={`mailto:${contactEmail}`} className="hover:underline hover:text-brand">{contactEmail}</a>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <Phone className="h-3.5 w-3.5 text-brand" />
                  <span className="font-semibold text-neutral-200">{lang === 'fr' ? 'Téléphone:' : 'Phone:'}</span>
                  <a href={`tel:${contactPhone}`} className="hover:underline hover:text-brand">{contactPhone}</a>
                </div>
                <div className="text-[10px] text-neutral-500 mt-2 font-sans">
                  {lang === 'fr'
                    ? "En vous connectant, vous acceptez de respecter les conditions de transaction de Prime Maroc. Les journaux d'activité sont conservés de manière sécurisée."
                    : "By connecting, you agree to comply with Moroccan Prime transaction terms. Verification logs are saved securely."}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sliding actions footer */}
        <div className="bg-[#030303] border-t border-neutral-900 px-6 py-4 flex flex-col gap-3 font-mono text-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-brand" /> {lang === 'fr' ? 'Vérifié' : 'Vetted'} 21 June 2026
            </span>
            <span>Ref: {listing.id.toUpperCase()}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-neutral-850 text-neutral-300 hover:text-brand hover:bg-[#0b0b0b] transition-all cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? (lang === 'fr' ? 'Lien Copié' : 'Link Copied') : (lang === 'fr' ? 'Partager' : 'Share')}</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border border-neutral-800 transition-all cursor-pointer text-center font-bold"
            >
              {lang === 'fr' ? 'Fermer le panneau' : 'Close Drawer'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
