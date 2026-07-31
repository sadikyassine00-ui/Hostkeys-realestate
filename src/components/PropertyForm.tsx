import React, { useState, useRef } from 'react';
import { Listing, User } from '../types';
import { ALL_AMENITIES, ALL_CITIES } from '../mockData';
import { ShieldAlert, Plus, Check, Info, FilePlus, UploadCloud, Image as ImageIcon, X, Loader2, MapPin, Link as LinkIcon, Search, ChevronDown } from 'lucide-react';
import { translateAmenity, translateLocation } from '../translations';
import { Currency, formatCurrency, EXCHANGE_RATES } from '../utils';
import { uploadImageApi } from '../api';

interface PropertyFormProps {
  currentUser: User;
  initialListing?: Listing;
  onAddListing: (listing: Omit<Listing, 'id' | 'status' | 'ownerId' | 'createdAt' | 'approvedByAdminId'>) => void;
  onUpdateListing?: (listing: Listing) => void;
  onClose: () => void;
  currency: Currency;
  eurRate: number;
  lang: 'en' | 'fr';
}

const HOUSING_PRESETS = [
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&h=500&q=80',
    label: 'Modern Villa Vista'
  },
  {
    url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&h=500&q=80',
    label: 'Warm Terrazzo Villa'
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&h=500&q=80',
    label: 'Modern Coastline Pavilion'
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&h=500&q=80',
    label: 'Mountain Oasis Villa'
  }
];

export default function PropertyForm({ currentUser, initialListing, onAddListing, onUpdateListing, onClose, currency, eurRate, lang }: PropertyFormProps) {
  const [title, setTitle] = useState(initialListing?.title || '');
  const [description, setDescription] = useState(initialListing?.description || '');
  const [type, setType] = useState<'buy' | 'rent'>(initialListing?.type || 'buy');
  const [price, setPrice] = useState<number | ''>(initialListing ? Math.round(initialListing.price) : '');
  const [location, setLocation] = useState(initialListing?.location || ALL_CITIES[0]);
  const [address, setAddress] = useState(initialListing?.address || '');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [bedrooms, setBedrooms] = useState<number>(initialListing?.bedrooms || 3);
  const [beds, setBeds] = useState<number>(initialListing?.beds || 4);
  const [bathrooms, setBathrooms] = useState<number>(initialListing?.bathrooms || 2.5);
  const [squareMeters, setSquareMeters] = useState<number | ''>(initialListing?.squareMeters || '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialListing?.amenities || []);
  
  // Image state — supports multiple images
  const [imageSource, setImageSource] = useState<'upload' | 'preset' | 'url'>(initialListing ? 'url' : 'upload');
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialListing?.images || (initialListing?.image ? [initialListing.image] : []));
  const [selectedPreset, setSelectedPreset] = useState(HOUSING_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState(initialListing?.image || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [personalName, setPersonalName] = useState(initialListing?.personalOwnerInfo?.name || currentUser.name);
  const [personalEmail, setPersonalEmail] = useState(initialListing?.personalOwnerInfo?.email || currentUser.email);
  const [personalPhone, setPersonalPhone] = useState(initialListing?.personalOwnerInfo?.phone || currentUser.phone);

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(f => f.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      setUploadError(lang === 'fr' ? 'Fichier invalide. Veuillez utiliser des images.' : 'Invalid file(s). Please upload images.');
      return;
    }

    const oversized = validFiles.filter(f => f.size > 4.5 * 1024 * 1024);
    if (oversized.length > 0) {
      setUploadError(lang === 'fr' ? 'Certaines images sont trop volumineuses (max 4.5 MB chacune).' : 'Some images are too large (max 4.5 MB each).');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const newUrls: string[] = [];
      for (const file of validFiles) {
        const result = await uploadImageApi(file);
        newUrls.push(result.url);
      }
      setUploadedImages(prev => [...prev, ...newUrls]);
      setImageSource('upload');
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const getFinalImages = (): string[] => {
    if (imageSource === 'upload' && uploadedImages.length > 0) return uploadedImages;
    if (imageSource === 'url' && customImageUrl.trim()) return [customImageUrl.trim()];
    return [selectedPreset];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || price === '' || squareMeters === '') {
      alert(lang === 'fr' ? 'Veuillez remplir tous les champs obligatoires.' : 'Please fill out all required fields.');
      return;
    }

    const finalImages = getFinalImages();
    const numPrice = Number(price);
    let baseUsdPrice = numPrice;
    if (currency === 'MAD') {
      baseUsdPrice = numPrice / (EXCHANGE_RATES.MAD?.rate || 10.10);
    } else if (currency === 'EUR') {
      baseUsdPrice = numPrice / (eurRate || 0.92);
    }

    if (initialListing && onUpdateListing) {
      onUpdateListing({
        ...initialListing,
        title,
        description,
        type,
        price: Math.round(baseUsdPrice),
        location,
        address: address.trim(),
        bedrooms: Number(bedrooms),
        beds: Number(beds),
        bathrooms: Number(bathrooms),
        squareMeters: Number(squareMeters),
        amenities: selectedAmenities,
        image: finalImages[0] || initialListing.image || '',
        images: finalImages.length > 0 ? finalImages : (initialListing.images || []),
        personalOwnerInfo: {
          name: personalName,
          email: personalEmail,
          phone: personalPhone
        }
      });
    } else {
      onAddListing({
        title,
        description,
        type,
        price: Math.round(baseUsdPrice),
        location,
        address: address.trim(),
        bedrooms: Number(bedrooms),
        beds: Number(beds),
        bathrooms: Number(bathrooms),
        squareMeters: Number(squareMeters),
        amenities: selectedAmenities,
        image: finalImages[0] || '',
        images: finalImages,
        personalOwnerInfo: {
          name: personalName,
          email: personalEmail,
          phone: personalPhone
        }
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0c0c0c] border border-neutral-850 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-900 p-6 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <FilePlus className="h-5 w-5 text-brand" />
              {lang === 'fr' ? 'Publier Votre Propriété' : 'Publish Your Property'}
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              {lang === 'fr' ? 'Soumettez les détails de votre bien pour validation Hostkeys.' : 'Submit property details for Hostkeys verification.'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-neutral-900 text-slate-400 hover:text-white cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 font-mono text-xs flex-grow">
          {/* Transaction Type */}
          <div>
            <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Type de Transaction' : 'Listing Type'}</label>
            <div className="grid grid-cols-2 gap-2 bg-[#030303] p-1 rounded-xl border border-neutral-850">
              <button type="button" onClick={() => setType('buy')} className={`py-2 rounded-lg font-bold text-center transition-all cursor-pointer ${type === 'buy' ? 'bg-brand text-[#030303]' : 'text-slate-400'}`}>
                {lang === 'fr' ? 'Vente (Acheter)' : 'For Sale (Buy)'}
              </button>
              <button type="button" onClick={() => setType('rent')} className={`py-2 rounded-lg font-bold text-center transition-all cursor-pointer ${type === 'rent' ? 'bg-brand text-[#030303]' : 'text-slate-400'}`}>
                {lang === 'fr' ? 'Location' : 'For Lease (Rent)'}
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Titre de l\'Annonce *' : 'Property Title *'}</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={lang === 'fr' ? 'ex: Villa Moderne avec Piscine a Marrakech' : 'e.g., Luxury Villa with Private Pool'} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Description Detaillee *' : 'Description *'}</label>
            <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={lang === 'fr' ? 'Decrivez les atouts, equipements et pieces...' : 'Describe the architectural layout, amenities, and unique features...'} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none" />
          </div>

          {/* Price & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">
                {type === 'buy' ? (lang === 'fr' ? 'Prix de Vente ($ USD) *' : 'Price ($ USD) *') : (lang === 'fr' ? 'Loyer Mensuel ($ USD) *' : 'Monthly Rent ($ USD) *')}
              </label>
              <input type="number" required min={1} value={price} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')} placeholder="250000" className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none" />
              {price !== '' && (
                <span className="text-[10px] text-brand mt-1 block">{formatCurrency(Number(price), currency, eurRate)}</span>
              )}
            </div>
            <div>
              <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Surface Habitable (m2) *' : 'Interior Area (m2) *'}</label>
              <input type="number" required min={10} value={squareMeters} onChange={(e) => setSquareMeters(e.target.value ? Number(e.target.value) : '')} placeholder="220" className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none" />
            </div>
          </div>

          {/* Bedrooms, Beds & Bathrooms */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Chambres' : 'Bedrooms'}</label>
              <select value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Lits' : 'Beds'}</label>
              <select value={beds} onChange={(e) => setBeds(Number(e.target.value))} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Bed' : 'Beds'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Salles de Bain' : 'Bathrooms'}</label>
              <select value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none">
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Bath' : 'Baths'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* City Selection — Searchable */}
          <div className="relative">
            <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Ville au Maroc *' : 'City in Morocco *'}</label>
            <button
              type="button"
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white flex items-center justify-between focus:border-brand focus:outline-none cursor-pointer"
            >
              <span className="font-semibold text-brand">{location}</span>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {cityDropdownOpen && (
              <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-[#0c0c0c] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden p-2 space-y-2 max-h-60 flex flex-col">
                <div className="relative shrink-0">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    placeholder={lang === 'fr' ? 'Rechercher une ville...' : 'Search city...'}
                    className="w-full bg-[#030303] border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-brand focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto space-y-0.5 max-h-44 pr-1">
                  {ALL_CITIES.filter(c => c.toLowerCase().includes(citySearchQuery.toLowerCase())).map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setLocation(city);
                        setCityDropdownOpen(false);
                        setCitySearchQuery('');
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${location === city ? 'bg-brand/10 text-brand font-bold' : 'text-slate-300 hover:bg-neutral-900 hover:text-white'}`}
                    >
                      <span>{city}</span>
                      {location === city && <Check className="h-3 w-3 text-brand shrink-0" />}
                    </button>
                  ))}
                  {ALL_CITIES.filter(c => c.toLowerCase().includes(citySearchQuery.toLowerCase())).length === 0 && (
                    <p className="text-[11px] text-slate-500 p-2 text-center">{lang === 'fr' ? 'Aucune ville trouvée' : 'No city found'}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              {lang === 'fr' ? 'Adresse Exacte' : 'Property Address'}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={lang === 'fr' ? 'ex: 24 Rue des Jasmins, Gueliz, Marrakech 40000' : 'e.g., 24 Jasmine Street, Gueliz, Marrakech 40000'}
              className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none"
            />
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div>
            <label className="block text-slate-400 mb-2">{lang === 'fr' ? 'Photos de la Propriete' : 'Property Photos'}</label>
            
            {/* Image source tabs */}
            <div className="flex gap-1 bg-[#030303] p-1 rounded-xl border border-neutral-850 mb-3">
              <button type="button" onClick={() => setImageSource('upload')} className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${imageSource === 'upload' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-400'}`}>
                <UploadCloud className="h-3.5 w-3.5" /> {lang === 'fr' ? 'Televerser' : 'Upload'}
              </button>
              <button type="button" onClick={() => setImageSource('preset')} className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${imageSource === 'preset' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-400'}`}>
                <ImageIcon className="h-3.5 w-3.5" /> {lang === 'fr' ? 'Galerie' : 'Gallery'}
              </button>
              <button type="button" onClick={() => setImageSource('url')} className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${imageSource === 'url' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-400'}`}>
                <LinkIcon className="h-3.5 w-3.5" /> URL
              </button>
            </div>

            {/* Upload Zone — Multiple */}
            {imageSource === 'upload' && (
              <div>
                {/* Uploaded images grid */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {uploadedImages.map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-24 rounded-lg object-cover border border-neutral-800" />
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(idx)}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white hover:bg-rose-500 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full bg-brand/90 text-[8px] font-bold text-[#030303]">
                            {lang === 'fr' ? 'Principale' : 'Primary'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Drop zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragActive ? 'border-brand bg-brand/5' : 'border-neutral-800 hover:border-brand/40 bg-[#030303]'}`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-7 w-7 text-brand animate-spin" />
                      <span className="text-slate-300">{lang === 'fr' ? 'Televersement en cours...' : 'Uploading...'}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <UploadCloud className="h-7 w-7 text-slate-500" />
                      <span className="text-slate-300">{lang === 'fr' ? 'Glissez-deposez ou cliquez pour selectionner' : 'Drag & drop or click to select'}</span>
                      <span className="text-[10px] text-slate-500">{lang === 'fr' ? 'JPG, PNG, WebP — Max 4.5 MB par image — Plusieurs fichiers acceptes' : 'JPG, PNG, WebP — Max 4.5 MB each — Multiple files accepted'}</span>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                </div>

                {uploadError && (
                  <p className="text-rose-400 text-[11px] mt-1">{uploadError}</p>
                )}
              </div>
            )}

            {/* Preset Gallery */}
            {imageSource === 'preset' && (
              <div className="grid grid-cols-2 gap-2">
                {HOUSING_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.url}
                    onClick={() => setSelectedPreset(preset.url)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${selectedPreset === preset.url ? 'border-brand' : 'border-neutral-800 hover:border-neutral-700'}`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-24 object-cover" />
                    {selectedPreset === preset.url && (
                      <span className="absolute top-1.5 right-1.5 h-5 w-5 bg-brand rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-[#030303]" />
                      </span>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white px-2 py-0.5 text-center">{preset.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Custom URL */}
            {imageSource === 'url' && (
              <div>
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://example.com/property-image.jpg"
                  className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none"
                />
                {customImageUrl && (
                  <img src={customImageUrl} alt="Preview" className="w-full h-32 rounded-xl object-cover mt-2 border border-neutral-800" onError={(e) => (e.currentTarget.style.display = 'none')} />
                )}
              </div>
            )}
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Equipements' : 'Amenities & Features'}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#030303] p-3 rounded-xl border border-neutral-850 max-h-36 overflow-y-auto">
              {ALL_AMENITIES.map(amenity => (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-2 rounded-lg text-[10px] text-left transition-all border cursor-pointer flex items-center gap-1 ${selectedAmenities.includes(amenity) ? 'bg-brand/10 border-brand text-brand font-bold' : 'border-neutral-850 text-slate-400 hover:text-white'}`}
                >
                  {selectedAmenities.includes(amenity) && <Check className="h-2.5 w-2.5 shrink-0" />}
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-neutral-800 text-slate-400 hover:text-white cursor-pointer">
              {lang === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-brand text-[#030303] font-bold hover:bg-brand/90 transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)] cursor-pointer">
              {lang === 'fr' ? 'Publier la Propriete' : 'Publish Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
