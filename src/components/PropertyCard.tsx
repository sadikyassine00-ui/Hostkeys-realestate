import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Listing, User } from '../types';
import { Bed, DoorOpen, Bath, Maximize, ShieldCheck, Mail, Phone, UserCheck, Star, Sparkles, Globe } from 'lucide-react';
import { formatCurrency, Currency } from '../utils';
import { t } from '../translations';
import { HOSTKEYS_AGENTS } from '../mockData';

interface PropertyCardProps {
  key?: string;
  listing: Listing;
  adminUser?: User;
  currentUser?: User | null;
  onSelect?: (listing: Listing) => void;
  currency: Currency;
  eurRate: number;
  lang: 'en' | 'fr';
}

export default function PropertyCard({ listing, adminUser, currentUser, onSelect, currency, eurRate, lang }: PropertyCardProps) {
  const isDirectAdminListing = listing.ownerId.startsWith('admin');
  const finalContactName = isDirectAdminListing
    ? (listing.personalOwnerInfo.name || "Hostkeys Admin")
    : (adminUser?.name || "Hostkeys Support");
  
  const finalContactEmail = isDirectAdminListing
    ? (listing.personalOwnerInfo.email || "support@hostkeys.ma")
    : (adminUser?.email || "support@hostkeys.ma");

  const finalContactPhone = isDirectAdminListing
    ? (listing.personalOwnerInfo.phone || "+212 522 000000")
    : (adminUser?.phone || "+212 522 000000");

  const finalContactAvatar = isDirectAdminListing
    ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
    : (adminUser?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80");

  const isMyListing = currentUser && listing.ownerId === currentUser.id;

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
          src={listing.images?.[0] || listing.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&h=500&q=80'} 
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
            <span className="rounded-full bg-[#030303]/90 px-3 py-1 text-xs font-medium text-brand border border-brand/20 backdrop-blur-md">
              {t('cardYourSubmission', lang)}
            </span>
          )}
        </div>

        {/* Protection / Masked Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#030303]/90 text-brand border border-brand/30 backdrop-blur-md cursor-pointer hover:bg-brand hover:text-[#030303] transition-colors" title="Hostkeys Verified & Protected">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="rounded-xl bg-[#030303]/90 px-3.5 py-1.5 border border-brand/20 backdrop-blur-md">
            <span className="text-lg font-bold font-mono text-brand">
              {formatCurrency(listing.price, currency, eurRate, true, listing.type)}
            </span>
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 text-xs font-mono text-brand/80 mb-2">
          <span>{listing.location}</span>
          <span>•</span>
          <span>{listing.squareMeters} m²</span>
        </div>

        <h3 className="font-sans text-lg font-semibold tracking-tight text-slate-100 group-hover:text-brand transition-colors line-clamp-1">
          {listing.title}
        </h3>

        <p className="mt-2 text-sm text-slate-400 line-clamp-2 flex-grow">
          {listing.description}
        </p>

        {/* Technical Specs: Bedrooms, Beds, Bathrooms, SqM */}
        <div className="mt-4 grid grid-cols-4 gap-1.5 border-t border-b border-neutral-800/60 py-3 text-[11px] text-slate-300 font-mono">
          <div className="flex items-center gap-1 justify-center bg-neutral-900 rounded-lg py-1 px-1" title="Bedrooms">
            <DoorOpen className="h-3 w-3 text-brand shrink-0" />
            <span className="truncate">{listing.bedrooms} {listing.bedrooms === 1 ? t('cardBedroom', lang) : t('cardBedrooms', lang)}</span>
          </div>
          <div className="flex items-center gap-1 justify-center bg-neutral-900 rounded-lg py-1 px-1" title="Physical Beds">
            <Bed className="h-3 w-3 text-brand shrink-0" />
            <span className="truncate">{listing.beds || listing.bedrooms || 1} { (listing.beds || listing.bedrooms) === 1 ? t('cardBed', lang) : t('cardBeds', lang)}</span>
          </div>
          <div className="flex items-center gap-1 justify-center bg-neutral-900 rounded-lg py-1 px-1" title="Bathrooms">
            <Bath className="h-3 w-3 text-brand shrink-0" />
            <span className="truncate">{listing.bathrooms} {listing.bathrooms === 1 ? t('cardBath', lang) : t('cardBaths', lang)}</span>
          </div>
          <div className="flex items-center gap-1 justify-center bg-neutral-900 rounded-lg py-1 px-1" title="Area">
            <Maximize className="h-3 w-3 text-brand shrink-0" />
            <span className="truncate">{listing.squareMeters} m²</span>
          </div>
        </div>

        {/* Amenities */}
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

      {/* 3 Hostkeys Advisory Agents Footer */}
      <div className="mx-5 mb-5 border-t border-neutral-900 pt-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-brand" />
            {lang === 'fr' ? 'Équipe Conseil Hostkeys' : 'Hostkeys Advisory Team'}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(listing);
            }}
            className="px-2.5 py-1 rounded-lg bg-brand/10 hover:bg-brand text-brand hover:text-[#030303] text-[11px] font-semibold font-mono transition-all border border-brand/20 cursor-pointer"
          >
            {t('cardDetailsBtn', lang)}
          </button>
        </div>

        {/* 3 Agents list */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {HOSTKEYS_AGENTS.map(agent => (
            <div key={agent.id} className="bg-neutral-900/70 border border-neutral-850 p-1.5 rounded-lg flex flex-col items-center text-center">
              <div className="relative mb-1">
                <img 
                  src={agent.avatar} 
                  alt={agent.firstName}
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-full border border-brand/30 object-cover" 
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-brand border border-[#030303]" />
              </div>
              <span className="text-[11px] font-bold text-slate-200 leading-tight">{agent.firstName}</span>
              <span className="text-[9px] font-mono text-slate-450 mt-0.5 truncate w-full">{agent.phone}</span>
              <div className="flex items-center justify-center gap-0.5 mt-1">
                {agent.languages.map(l => (
                  <span key={l} className="text-[8px] font-mono bg-neutral-800 text-slate-300 px-1 py-0.2 rounded">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
