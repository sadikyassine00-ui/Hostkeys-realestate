import React, { useState } from 'react';
import { Listing } from '../types';
import { 
  X, 
  Copy, 
  Check, 
  Send, 
  MessageSquare, 
  Share2, 
  ExternalLink,
  Globe,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, Currency } from '../utils';

interface ShareModalProps {
  listing: Listing;
  currency: Currency;
  eurRate: number;
  lang: string;
  onClose: () => void;
}

export default function ShareModal({ listing, currency, eurRate, lang, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const propertyUrl = `${window.location.origin}${window.location.pathname}?property=${listing.id}`;
  const priceFormatted = formatCurrency(listing.price, currency, eurRate, true, listing.type);
  const shareTitle = `${listing.title} - Hostkeys Real Estate`;
  const shareText = `Check out this property on Hostkeys: ${listing.title} (${listing.location}) - ${priceFormatted}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(propertyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: propertyUrl,
        });
      } catch (err) {
        // Fallback to copy link
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${propertyUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(`${shareText}\n${propertyUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    // Open Instagram DMs
    window.open('https://instagram.com/direct/inbox/', '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(propertyUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(propertyUrl)}`;
    window.open(twUrl, '_blank', 'noopener,noreferrer');
  };

  const handleEmailShare = () => {
    const mailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${propertyUrl}`)}`;
    window.open(mailUrl, '_self');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative z-10 w-full max-w-md bg-[#0c0c0c] border border-neutral-850 rounded-2xl shadow-2xl overflow-hidden p-5 md:p-6 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3.5">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-brand" />
              <h3 className="text-base font-bold text-white font-sans">
                {lang === 'fr' ? 'Partager cette Propriété' : 'Share Property'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Property Card Preview */}
          <div className="bg-[#030303] border border-neutral-850 rounded-xl p-3 flex items-center gap-3">
            <img
              src={listing.image || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80'}
              alt={listing.title}
              className="h-14 w-14 rounded-lg object-cover border border-neutral-800 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate leading-tight">{listing.title}</h4>
              <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">{listing.location}, Morocco</p>
              <p className="text-xs font-mono font-bold text-brand mt-1">{priceFormatted}</p>
            </div>
          </div>

          {/* Share Channels Grid */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block tracking-wider">
              {lang === 'fr' ? 'Choisir une plateforme' : 'Choose Platform'}
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-all font-mono text-xs font-semibold cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span>WhatsApp</span>
              </button>

              {/* Instagram DMs */}
              <button
                onClick={handleInstagramShare}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 hover:text-pink-300 transition-all font-mono text-xs font-semibold cursor-pointer"
              >
                <Send className="h-4 w-4 shrink-0" />
                <span>Instagram DM</span>
              </button>

              {/* Telegram */}
              <button
                onClick={handleTelegramShare}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 hover:text-sky-300 transition-all font-mono text-xs font-semibold cursor-pointer"
              >
                <Send className="h-4 w-4 shrink-0" />
                <span>Telegram</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookShare}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 transition-all font-mono text-xs font-semibold cursor-pointer"
              >
                <Globe className="h-4 w-4 shrink-0" />
                <span>Facebook</span>
              </button>

              {/* Twitter / X */}
              <button
                onClick={handleTwitterShare}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-slate-200 hover:text-white transition-all font-mono text-xs font-semibold cursor-pointer"
              >
                <Globe className="h-4 w-4 shrink-0 text-slate-400" />
                <span>X (Twitter)</span>
              </button>

              {/* Direct Email */}
              <button
                onClick={handleEmailShare}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-slate-200 hover:text-white transition-all font-mono text-xs font-semibold cursor-pointer"
              >
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{lang === 'fr' ? 'Email' : 'Direct Email'}</span>
              </button>
            </div>
          </div>

          {/* Copy Direct Link Section */}
          <div className="pt-2 border-t border-neutral-900 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
              {lang === 'fr' ? 'Lien direct' : 'Direct Link'}
            </span>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={propertyUrl}
                className="flex-1 bg-[#030303] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  copied
                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-brand text-[#030303] hover:bg-brand/90 shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? (lang === 'fr' ? 'Copié !' : 'Copied!') : (lang === 'fr' ? 'Copier' : 'Copy Link')}</span>
              </button>
            </div>
          </div>

          {/* Web Native Share Option */}
          {typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function' && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-slate-200 hover:text-white font-mono text-xs font-bold border border-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="h-4 w-4 text-brand" />
              <span>{lang === 'fr' ? 'Menu de partage système' : 'System Share Menu'}</span>
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
