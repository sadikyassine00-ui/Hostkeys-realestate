import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Listing, User } from '../types';
import { Bed, Bath, Maximize, ShieldCheck, Mail, Phone, UserCheck, Star, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils';
import { t } from '../translations';

interface PropertyCardProps {
  key?: string;
  listing: Listing;
  adminUser?: User; // The admin who approved or managed this listing
  currentUser: User;
  onSelect?: (listing: Listing) => void;
  currency: 'USD' | 'EUR';
  eurRate: number;
  lang: 'en' | 'fr';
}

export default function PropertyCard({ listing, adminUser, currentUser, onSelect, currency, eurRate, lang }: PropertyCardProps) {
  const [showContact, setShowContact] = useState(false);

  // Determine who to show as contact based on approval state
  // "when his listing is approved its not shown with his personal info but with the info of the admin that approved it, and of course the admin can also list a listing"
  const isDirectAdminListing = listing.ownerId.startsWith('admin');
  const finalContactName = isDirectAdminListing
    ? (listing.personalOwnerInfo.name || "Marcus Sterling")
    : (adminUser?.name || "Marcus Sterling (Lead Broker)");
  
  const finalContactEmail = isDirectAdminListing
    ? (listing.personalOwnerInfo.email || "marcus.sterling@primeestates.com")
    : (adminUser?.email || "marcus.sterling@primeestates.com");

  const finalContactPhone = isDirectAdminListing
    ? (listing.personalOwnerInfo.phone || "+1 (555) 900-2026")
    : (adminUser?.phone || "+1 (555) 900-2026");

  const finalContactAvatar = isDirectAdminListing
    ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
    : (adminUser?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80");

  const isMyListing = listing.ownerId === currentUser.id;

  return (
    <motion.div 
      id={`property-card-${listing.id}`}
      onClick={() => onSelect?.(listing)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, borderColor: 'var(--color-brand)' }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#0d0d0d] border border-neutral-900 shadow-md hover:shadow-[0_0_20px_-5px_rgba(166,254,0,0.15)] cursor-pointer"
    >
      {/* Property Image & Badges */}
      <div className="relative aspect-[1.6] w-full overflow-hidden bg-[#030303]">
        <img 
          src={listing.image} 
          referrerPolicy="no-referrer"
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Buy / Rent Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="rounded-full bg-[#030303]/90 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-brand border border-brand/20 backdrop-blur-md">
            {listing.type === 'buy' ? t('cardForSale', lang) : t('cardForRent', lang)}
          </span>
          {isMyListing && (
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
              {t('cardYourSubmission', lang)}
            </span>
          )}
        </div>

        {/* Protection / Masked Badge - Dynamic indicator of our core feature */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#030303]/90 text-brand border border-brand/30 backdrop-blur-md cursor-pointer hover:bg-brand hover:text-[#030303] transition-colors" title="Admin Representative Broker Model Active">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="rounded-xl bg-[#030303]/90 px-3.5 py-1.5 border border-brand/20 backdrop-blur-md">
            <span className="text-xl font-bold font-mono text-brand">
              {formatCurrency(listing.price, currency, eurRate, true, listing.type)}
            </span>
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 text-xs font-mono text-brand/80 mb-2">
          <span>{listing.location.split(',')[1] || listing.location}</span>
          <span>•</span>
          <span>{listing.squareMeters} m²</span>
        </div>

        <h3 className="font-sans text-lg font-semibold tracking-tight text-slate-100 group-hover:text-brand transition-colors line-clamp-1">
          {listing.title}
        </h3>

        <p className="mt-2 text-sm text-slate-400 line-clamp-2 flex-grow">
          {listing.description}
        </p>

        {/* Technical Specs */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-b border-neutral-800/60 py-3 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5 justify-center bg-neutral-900 rounded-lg py-1">
            <Bed className="h-3.5 w-3.5 text-brand" />
            <span>{listing.bedrooms} {listing.bedrooms === 1 ? t('cardBed', lang) : t('cardBeds', lang)}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center bg-neutral-900 rounded-lg py-1">
            <Bath className="h-3.5 w-3.5 text-brand" />
            <span>{listing.bathrooms} {listing.bathrooms === 1 ? t('cardBath', lang) : t('cardBaths', lang)}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center bg-neutral-900 rounded-lg py-1">
            <Maximize className="h-3.5 w-3.5 text-brand" />
            <span>{listing.squareMeters} m²</span>
          </div>
        </div>

        {/* Amenities Pill Box - up to 4 */}
        <div className="mt-3.5 flex flex-wrap gap-1">
          {listing.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="rounded bg-neutral-900 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-neutral-850">
              {amenity}
            </span>
          ))}
          {listing.amenities.length > 3 && (
            <span className="rounded bg-neutral-900/60 px-1.5 py-0.5 text-[10px] font-mono text-brand font-medium border border-brand/10">
              {t('cardMore', lang, { count: listing.amenities.length - 3 })}
            </span>
          )}
        </div>
      </div>

      {/* Broker Profile Mask (Admin Represents Owner) */}
      <div className="mx-5 mb-5 border-t border-neutral-900 pt-4 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src={finalContactAvatar} 
              alt={finalContactName}
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-full border border-brand/20 object-cover" 
            />
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="text-xs font-semibold text-slate-200 line-clamp-1">{finalContactName}</span>
                <span className="text-brand flex-shrink-0" title="Broker Representative Verified">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#a6fe00] mt-0.5">{t('cardAdvisoryPartner', lang)}</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button 
              id={`btn-expand-${listing.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(listing);
              }}
              className="rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-mono text-brand border border-brand/20 hover:bg-brand hover:text-[#030303] transition-all"
            >
              {t('cardExpand', lang)}
            </button>
            <button 
              id={`btn-contact-${listing.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowContact(!showContact);
              }}
              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-mono text-slate-300 border border-neutral-800 hover:bg-brand hover:text-[#030303] transition-all"
            >
              {showContact ? t('cardClose', lang) : t('cardBroker', lang)}
            </button>
          </div>
        </div>

        {/* Contact Details Expand (Smooth transitions) */}
        {showContact && (
          <div className="mt-3.5 overflow-hidden rounded-xl bg-[#030303]/90 p-3 border border-brand/15 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2 mb-1.5">
              <Mail className="h-3.5 w-3.5 text-brand shrink-0" />
              <span className="truncate">{finalContactEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-brand shrink-0" />
              <span>{finalContactPhone}</span>
            </div>
            <div className="mt-2 border-t border-neutral-850 pt-2 text-[10px] text-slate-400 leading-tight">
              {t('cardVettedAdvisoryNotice', lang)}
            </div>
          </div>
        )}
      </div>

      {/* Optional action triggers (e.g. For admin or details popup) */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
