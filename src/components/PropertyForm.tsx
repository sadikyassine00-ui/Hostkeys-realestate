import React, { useState, useRef } from 'react';
import { Listing, User } from '../types';
import { ALL_AMENITIES, ALL_LOCATIONS } from '../mockData';
import { ShieldAlert, Plus, Check, Info, FilePlus, UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { translateAmenity, translateLocation } from '../translations';
import { Currency, formatCurrency } from '../utils';
import { uploadImageApi } from '../api';

interface PropertyFormProps {
  currentUser: User;
  onAddListing: (listing: Omit<Listing, 'id' | 'status' | 'ownerId' | 'createdAt' | 'approvedByAdminId'>) => void;
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

export default function PropertyForm({ currentUser, onAddListing, onClose, currency, eurRate, lang }: PropertyFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'buy' | 'rent'>('buy');
  const [price, setPrice] = useState<number | ''>('');
  const [location, setLocation] = useState(ALL_LOCATIONS[0]);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2.5);
  const [squareMeters, setSquareMeters] = useState<number | ''>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Image state
  const [imageSource, setImageSource] = useState<'upload' | 'preset' | 'url'>('upload');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState(HOUSING_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [personalName, setPersonalName] = useState(currentUser.name);
  const [personalEmail, setPersonalEmail] = useState(currentUser.email);
  const [personalPhone, setPersonalPhone] = useState(currentUser.phone);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError(lang === 'fr' ? 'Fichier invalide. Veuillez utiliser une image.' : 'Invalid file. Please upload an image.');
      return;
    }
    if (file.size > 4.5 * 1024 * 1024) {
      setUploadError(lang === 'fr' ? 'Image trop volumineuse (max 4.5 MB).' : 'Image too large (max 4.5 MB).');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const result = await uploadImageApi(file);
      setUploadedImageUrl(result.url);
      setImageSource('upload');
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const getFinalImageUrl = (): string => {
    if (imageSource === 'upload' && uploadedImageUrl) return uploadedImageUrl;
    if (imageSource === 'url' && customImageUrl.trim()) return customImageUrl.trim();
    return selectedPreset;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || price === '' || squareMeters === '') {
      alert(lang === 'fr' ? 'Veuillez remplir tous les champs obligatoires.' : 'Please fill out all required fields.');
      return;
    }

    onAddListing({
      title,
      description,
      type,
      price: Number(price),
      location,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      squareMeters: Number(squareMeters),
      amenities: selectedAmenities,
      image: getFinalImageUrl(),
      personalOwnerInfo: {
        name: personalName,
        email: personalEmail,
        phone: personalPhone
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0c0c0c] border border-neutral-850 rounded-2xl w-full max-w-2xl p-6 md:p-8 space-y-6 shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
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

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
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
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={lang === 'fr' ? 'ex: Villa Moderne avec Piscine à Marrakech' : 'e.g., Luxury Villa with Private Pool'} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Description Détaillée *' : 'Description *'}</label>
            <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={lang === 'fr' ? 'Décrivez les atouts, équipements et pièces...' : 'Describe the architectural layout, amenities, and unique features...'} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none" />
          </div>

          {/* Price & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">
                {type === 'buy' ? (lang === 'fr' ? 'Prix de Vente ($ USD) *' : 'Price ($ USD) *') : (lang === 'fr' ? 'Loyer Mensuel ($ USD) *' : 'Monthly Rent ($ USD) *')}
              </label>
              <input type="number" required min={1} value={price} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')} placeholder="250000" className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none" />
              {price !== '' && (
                <span className="text-[10px] text-brand mt-1 block">≈ {formatCurrency(Number(price), currency, eurRate)}</span>
              )}
            </div>
            <div>
              <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Surface Habitable (m²) *' : 'Interior Area (m²) *'}</label>
              <input type="number" required min={10} value={squareMeters} onChange={(e) => setSquareMeters(e.target.value ? Number(e.target.value) : '')} placeholder="220" className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none" />
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Chambres' : 'Bedrooms'}</label>
              <select value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
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

          {/* Location */}
          <div>
            <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Ville / Secteur' : 'City / Neighborhood'}</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-[#030303] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:border-brand focus:outline-none">
              {ALL_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div>
            <label className="block text-slate-400 mb-2">{lang === 'fr' ? 'Photo de la Propriété' : 'Property Photo'}</label>
            
            {/* Image source tabs */}
            <div className="flex gap-1 bg-[#030303] p-1 rounded-xl border border-neutral-850 mb-3">
              <button type="button" onClick={() => setImageSource('upload')} className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${imageSource === 'upload' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-400'}`}>
                <UploadCloud className="h-3.5 w-3.5" /> {lang === 'fr' ? 'Téléverser' : 'Upload'}
              </button>
              <button type="button" onClick={() => setImageSource('preset')} className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${imageSource === 'preset' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-400'}`}>
                <ImageIcon className="h-3.5 w-3.5" /> {lang === 'fr' ? 'Galerie' : 'Gallery'}
              </button>
              <button type="button" onClick={() => setImageSource('url')} className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${imageSource === 'url' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-400'}`}>
                🔗 URL
              </button>
            </div>

            {/* Upload Zone */}
            {imageSource === 'upload' && (
              <div>
                {!uploadedImageUrl ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragActive ? 'border-brand bg-brand/5' : 'border-neutral-800 hover:border-brand/40 bg-[#030303]'}`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-brand animate-spin" />
                        <span className="text-slate-300">{lang === 'fr' ? 'Téléversement en cours...' : 'Uploading...'}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <UploadCloud className="h-8 w-8 text-slate-500" />
                        <span className="text-slate-300">{lang === 'fr' ? 'Glissez-déposez ou cliquez pour sélectionner' : 'Drag & drop or click to select'}</span>
                        <span className="text-[10px] text-slate-500">JPG, PNG, WebP — Max 4.5 MB</span>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </div>
                ) : (
                  <div className="relative">
                    <img src={uploadedImageUrl} alt="Uploaded" className="w-full h-40 rounded-xl object-cover border border-neutral-800" />
                    <button
                      type="button"
                      onClick={() => { setUploadedImageUrl(''); setUploadError(''); }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-rose-500 transition-all cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-[10px] font-bold text-white">
                      ✓ {lang === 'fr' ? 'Image téléversée' : 'Uploaded'}
                    </span>
                  </div>
                )}
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
            <label className="block text-slate-400 mb-1">{lang === 'fr' ? 'Équipements' : 'Amenities & Features'}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#030303] p-3 rounded-xl border border-neutral-850 max-h-36 overflow-y-auto">
              {ALL_AMENITIES.map(amenity => (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-2 rounded-lg text-[10px] text-left transition-all border cursor-pointer ${selectedAmenities.includes(amenity) ? 'bg-brand/10 border-brand text-brand font-bold' : 'border-neutral-850 text-slate-400 hover:text-white'}`}
                >
                  {selectedAmenities.includes(amenity) ? '✓ ' : ''}{amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-neutral-800 text-slate-400 hover:text-white cursor-pointer">
              {lang === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-brand text-[#030303] font-bold hover:bg-brand/90 transition-all shadow-[0_0_15px_rgba(166,254,0,0.2)] cursor-pointer">
              {lang === 'fr' ? 'Publier la Propriété' : 'Publish Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
