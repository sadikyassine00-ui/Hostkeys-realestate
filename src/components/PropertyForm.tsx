import React, { useState } from 'react';
import { Listing, User } from '../types';
import { ALL_AMENITIES, ALL_LOCATIONS } from '../mockData';
import { ShieldAlert, Plus, Check, Info, FilePlus, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { translateAmenity, translateLocation } from '../translations';

interface PropertyFormProps {
  currentUser: User;
  onAddListing: (listing: Omit<Listing, 'id' | 'status' | 'ownerId' | 'createdAt' | 'approvedByAdminId'>) => void;
  onClose: () => void;
  currency: 'USD' | 'EUR';
  eurRate: number;
  lang: 'en' | 'fr';
}

// Curated high quality housing image options that owners can select to keep standard high
const HOUSING_PRESETS = [
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&h=500&q=80',
    label: 'Modern Minimal Vista'
  },
  {
    url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&h=500&q=80',
    label: 'Warm Terrazzo Villa'
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&h=500&q=80',
    label: 'Brutalist Concrete Pavilion'
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&h=500&q=80',
    label: 'Forest A-frame Oasis'
  }
];

export default function PropertyForm({ currentUser, onAddListing, onClose, currency, eurRate, lang }: PropertyFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'buy' | 'rent'>('buy');
  const [price, setPrice] = useState<number | ''>('');
  const [location, setLocation] = useState(ALL_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2.5);
  const [squareMeters, setSquareMeters] = useState<number | ''>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(HOUSING_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [imageType, setImageType] = useState<'preset' | 'url' | 'upload'>('preset');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setUploadedImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Personal Info verification for Regular owner
  const [personalName, setPersonalName] = useState(currentUser.name);
  const [personalEmail, setPersonalEmail] = useState(currentUser.email);
  const [personalPhone, setPersonalPhone] = useState(currentUser.phone);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !price || !squareMeters) {
      alert("Please fill in all core fields");
      return;
    }

    const finalLocation = useCustomLocation ? customLocation : location;
    
    let finalImage = selectedImage;
    if (imageType === 'url') {
      finalImage = customImageUrl;
    } else if (imageType === 'upload') {
      finalImage = uploadedImage || HOUSING_PRESETS[0].url;
    }

    onAddListing({
      title,
      description,
      type,
      price: Number(price),
      location: finalLocation || "Gueliz, Marrakech",
      bedrooms,
      bathrooms,
      squareMeters: Number(squareMeters),
      amenities: selectedAmenities,
      image: finalImage || HOUSING_PRESETS[0].url,
      personalOwnerInfo: {
        name: personalName,
        email: personalEmail,
        phone: personalPhone
      }
    });

    onClose();
  };

  return (
    <div id="property-form-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030303]/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="property-form-container"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c0c0c] border border-neutral-900 absolute-center p-6 md:p-8 text-slate-200"
      >
        <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
              <FilePlus className="h-5 w-5 text-brand" />
              {lang === 'fr' ? 'Enregistrer une nouvelle annonce' : 'Register New Listing'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {lang === 'fr' ? "Le numéro de l'annonce sera généré automatiquement dans le registre de sécurité." : "Listing ID will be auto-generated inside high security ledger model."}
            </p>
          </div>
          <button 
            id="property-form-close-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-brand font-mono text-sm leading-none bg-neutral-900 border border-neutral-800 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Feature Info Note */}
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-blend-soft-light bg-brand/5 p-4 border border-brand/10 text-xs text-brand/95">
          <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold uppercase tracking-wider font-mono">
              {lang === 'fr' ? "Règle de Masquage d'Identité Active :" : "Identity Masking Rule Active:"}
            </span>
            <p className="mt-1 text-slate-300 leading-normal">
              {lang === 'fr' 
                ? "Lorsque vous mettez en vente un bien en tant que propriétaire, il entre dans la file d'attente d'audit. Une fois approuvé par notre équipe, votre profil de propriétaire est entièrement masqué. Les détails publics ne montreront que les coordonnées de l'Agent d'Audit Référent (Admin)."
                : "When you list a property as a property owner, it enters the review queue. Once approved by our team, your owner profile is fully masked. The public listing details will only show the contact info of the Approving Lead Broker (Admin)."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSub} className="space-y-6">
          {/* Section 1: Property Basics */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-neutral-900 pb-2">
              {lang === 'fr' ? "1. Spécifications de la Propriété" : "1. Property Specifications"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Buy or Rent */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  {lang === 'fr' ? "Secteur de l'Annonce" : "Listing Sector"}
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#030303] p-1.5 rounded-xl border border-neutral-900">
                  <button
                    type="button"
                    onClick={() => setType('buy')}
                    className={`py-1.5 rounded-lg text-xs font-mono transition-all ${type === 'buy' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-450 hover:text-slate-200'}`}
                  >
                    {lang === 'fr' ? "Acheter" : "Buy (For Sale)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('rent')}
                    className={`py-1.5 rounded-lg text-xs font-mono transition-all ${type === 'rent' ? 'bg-brand text-[#030303] font-bold' : 'text-slate-450 hover:text-slate-200'}`}
                  >
                    {lang === 'fr' ? "Louer" : "Rent"}
                  </button>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  {type === 'buy' 
                    ? (lang === 'fr' ? 'Prix demandé ($ USD)' : 'Listing Price ($ USD)') 
                    : (lang === 'fr' ? 'Loyer mensuel ($ USD)' : 'Monthly Rent ($ USD)')}
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder={type === 'buy' ? '1,200,000' : '2,800'}
                  className="w-full bg-[#030303] border border-neutral-900 rounded-xl px-4 py-2 text-sm text-slate-100 font-mono focus:border-brand focus:outline-none"
                />
                {price !== '' && typeof price === 'number' && (
                  <p className="text-[10px] text-slate-400 font-mono mt-1.5 flex items-center gap-1">
                    <span className="text-[#a6fe00]">✔</span>
                    <span>
                      {lang === 'fr' ? 'Conversion approximative :' : 'Approximate conversion:'} <span className="text-white font-semibold">€{Math.round(price * eurRate).toLocaleString()} EUR</span> (@ 1 USD = {eurRate} EUR)
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                {lang === 'fr' ? "Titre exhaustif de l'annonce" : "Property Name / Heading"}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={lang === 'fr' ? "ex. Charmante villa contemporaine sous les palmiers" : "e.g. The Silverwood brutalist studio penthouse"}
                className="w-full bg-[#030303] border border-neutral-900 rounded-xl px-4 py-2 text-sm text-slate-100 focus:border-brand focus:outline-none"
              />
            </div>

            {/* Location Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-slate-400">
                  {lang === 'fr' ? "Localisation du Bien" : "Registered Location"}
                </label>
                <button
                  type="button"
                  onClick={() => setUseCustomLocation(!useCustomLocation)}
                  className="text-[10px] font-mono text-brand hover:underline"
                >
                  {useCustomLocation 
                    ? (lang === 'fr' ? 'Sélectionner un emplacement existant' : 'Select preset location') 
                    : (lang === 'fr' ? 'Saisir une localisation personnalisée' : 'Enter custom location')}
                </button>
              </div>
              
              {useCustomLocation ? (
                <input
                  type="text"
                  required
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="e.g. Gueliz, Marrakech"
                  className="w-full bg-[#030303] border border-neutral-900 rounded-xl px-4 py-2 text-sm text-slate-100 focus:border-brand focus:outline-none"
                />
              ) : (
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#030303] border border-neutral-900 rounded-xl px-4 py-2 text-sm text-slate-100 focus:border-brand focus:outline-none"
                >
                  {ALL_LOCATIONS.map((loc, idx) => (
                    <option key={idx} value={loc}>
                      {translateLocation(loc, lang)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  {lang === 'fr' ? "Chambres" : "Bedrooms"}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full bg-[#030303] border border-neutral-900 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  {lang === 'fr' ? "Bains" : "Bathrooms"}
                </label>
                <input
                  type="number"
                  required
                  min={0.5}
                  step={0.5}
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full bg-[#030303] border border-neutral-900 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  {lang === 'fr' ? "Surface (m²)" : "Area (m²)"}
                </label>
                <input
                  type="number"
                  required
                  min={10}
                  value={squareMeters}
                  onChange={(e) => setSquareMeters(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="120"
                  className="w-full bg-[#030303] border border-neutral-900 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                {lang === 'fr' ? "Description du Bien" : "Description"}
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={lang === 'fr' ? "Rédigez un descriptif valorisant le style architectural, l'acoustique, l'agencement..." : "Compose a beautiful explanation of style, acoustics, layout features..."}
                rows={4}
                className="w-full bg-[#030303] border border-neutral-900 rounded-xl px-4 py-2 text-sm text-slate-100 focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Image Selection */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-900 pb-2 gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                {lang === 'fr' ? "2. Choix de l'Esthétique Visuelle" : "2. Architectural Aesthetics"}
              </h3>
              {/* Tabs for Image Input Type */}
              <div className="flex bg-[#030303] border border-neutral-900 rounded-lg p-0.5 self-start">
                <button
                  type="button"
                  onClick={() => setImageType('preset')}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded-md transition-all cursor-pointer ${imageType === 'preset' ? 'bg-[#1a1a1a] text-brand font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {lang === 'fr' ? "Modèles" : "Presets"}
                </button>
                <button
                  type="button"
                  onClick={() => setImageType('url')}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded-md transition-all cursor-pointer ${imageType === 'url' ? 'bg-[#1a1a1a] text-brand font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {lang === 'fr' ? "Lien Image" : "Custom Link"}
                </button>
                <button
                  type="button"
                  onClick={() => setImageType('upload')}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded-md transition-all cursor-pointer ${imageType === 'upload' ? 'bg-[#1a1a1a] text-brand font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {lang === 'fr' ? "Téléverser" : "Direct Upload"}
                </button>
              </div>
            </div>

            {imageType === 'url' && (
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400">
                  {lang === 'fr' ? "Lien HTTP absolu de l'image" : "Absolute URL for Image"}
                </label>
                <input
                  type="url"
                  required
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#030303] border border-neutral-900 rounded-xl px-4 py-2 text-sm text-slate-100 font-mono focus:border-brand focus:outline-none"
                />
              </div>
            )}

            {imageType === 'preset' && (
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  {lang === 'fr' ? "Sélectionner une ambiance prédéfinie" : "Choose Design Vibe Preset"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {HOUSING_PRESETS.map((preset, idx) => {
                    const isSelected = selectedImage === preset.url;
                    return (
                      <div 
                        key={idx}
                        onClick={() => setSelectedImage(preset.url)}
                        className={`group relative aspect-[1.3] rounded-lg overflow-hidden border cursor-pointer transition-all ${isSelected ? 'border-brand ring-1 ring-brand' : 'border-neutral-800 hover:border-neutral-700'}`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.label}
                          className="h-full w-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-mono text-white text-center px-1">{preset.label}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 bg-brand text-[#030303] rounded-full p-0.5">
                            <Check className="h-3 w-3 font-semibold" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {imageType === 'upload' && (
              <div className="space-y-3">
                <label className="block text-xs font-mono text-slate-400">
                  {lang === 'fr' ? "Glisser-déposer ou sélectionner une photo du bien" : "Drag & Drop or Select Property Photo"}
                </label>
                
                {uploadedImage ? (
                  <div className="relative aspect-[2] w-full rounded-xl overflow-hidden border border-neutral-800 group bg-[#030303]">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded Property" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                      <p className="text-xs font-mono text-white">
                        {lang === 'fr' ? "Image téléversée avec succès" : "Image Uploaded Successfully"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setUploadedImage(null)}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] transition-colors cursor-pointer"
                      >
                        {lang === 'fr' ? "Supprimer et remplacer" : "Remove & Re-upload"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all bg-[#030303] ${dragActive ? 'border-brand bg-brand/5' : 'border-neutral-800 hover:border-neutral-700'}`}
                  >
                    <input
                      type="file"
                      id="property-file-uploader"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <UploadCloud className={`h-8 w-8 transition-colors ${dragActive ? 'text-brand' : 'text-slate-500'}`} />
                    <div className="text-center space-y-1">
                      <p className="text-xs text-slate-200 font-semibold font-mono">
                        {lang === 'fr' 
                          ? <span>Glissez-déposez votre image ici, ou <span className="text-brand underline">parcourez</span></span>
                          : <span>Drag and drop your image here, or <span className="text-brand underline">browse</span></span>}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {lang === 'fr' ? "Formats acceptés : PNG, JPG, GIF, WebP (Max 5Mo)" : "Supports PNG, JPG, GIF, WebP (Max 5MB)"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Amenities Selectors */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-neutral-900 pb-2">
              {lang === 'fr' ? "3. Équipements & Commodités" : "3. Amenities Check-off"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_AMENITIES.map((amenity, idx) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 rounded-xl p-2.5 border cursor-pointer transition-all ${isSelected ? 'bg-blend-soft-light bg-brand/5 border-brand text-brand' : 'bg-[#030303] border-neutral-900 text-slate-400 hover:text-slate-200'}`}
                  >
                    <div className={`h-4 w-4 rounded flex items-center justify-center border transition-all ${isSelected ? 'border-brand bg-brand text-[#030303]' : 'border-slate-600 bg-transparent'}`}>
                      {isSelected && <Check className="h-3.5 w-3.5 font-bold" />}
                    </div>
                    <span className="text-xs font-mono">{translateAmenity(amenity, lang)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Owner Identity (Required to simulate full profile details) */}
          <div className="space-y-4 bg-neutral-900/40 p-5 rounded-2xl border border-neutral-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand font-mono flex items-center gap-1.5">
              <Info className="h-4 w-4" />
              {lang === 'fr' ? "4. Profil du Propriétaire Soumettant" : "4. Property Contributor Profile (Your Personal Info)"}
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              {lang === 'fr'
                ? "Vous devez renseigner vos données personnelles requises pour l'audit physique de vérification. Rappel : Ce numéro de téléphone et cet e-mail resteront strictement cachés des utilisateurs publics réguliers et ne seront accessibles qu'aux administrateurs de Prime autorisés."
                : "You must register your personal data. We require this for physical auditing. Remember: This contact phone/email will remain fully hidden from regular public users and only be accessible by Lead Administrators during auditing."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">
                  {lang === 'fr' ? "Nom Complet du Contractant" : "Full Contractor Name"}
                </label>
                <input
                  type="text"
                  required
                  value={personalName}
                  onChange={(e) => setPersonalName(e.target.value)}
                  className="w-full bg-[#030303] border border-neutral-900 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">
                  {lang === 'fr' ? "Email Professionnel Direct" : "Direct Work Email"}
                </label>
                <input
                  type="email"
                  required
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  className="w-full bg-[#030303] border border-neutral-900 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">
                  {lang === 'fr' ? "Téléphone de Contact Audit" : "Mobile Audit Number"}
                </label>
                <input
                  type="tel"
                  required
                  value={personalPhone}
                  onChange={(e) => setPersonalPhone(e.target.value)}
                  className="w-full bg-[#030303] border border-neutral-900 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:border-brand focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white border border-neutral-900 bg-transparent transition-all"
            >
              {lang === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-mono text-[#030303] bg-brand font-bold hover:shadow-[0_0_15px_rgba(166,254,0,0.35)] transition-all"
            >
              {currentUser.role === 'admin' 
                ? (lang === 'fr' ? 'Publier et Diffuser' : 'Submit and Auto-Publish') 
                : (lang === 'fr' ? 'Soumettre pour Approbations' : 'Submit for Admin Approval')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
