// Bilingual dictionary and translation utilities for Morocco Prime Shelters
import { Listing } from './types';

export const DICTIONARY = {
  en: {
    // Top active session bar
    sessionBarTitle: "Active Session Override Profile Simulator",
    sessionBarRoleOwner: "👤 Owner (Lucas)",
    sessionBarRoleAdmin: "🛡️ Team Admin (Marcus)",
    sessionBarRegister: "+ Register New Account",
    
    // Header
    brandName: "PRIME ESTATES",
    navBuyCatalog: "Buy (Catalog)",
    navRentCatalog: "Rent (Catalog)",
    navDashboard: "Dashboard",
    currencyUSD: "USD $",
    currencyEUR: "EUR €",
    tooltipUSD: "Show pricing in Dollars ($ USD)",
    tooltipEUR: "Show pricing in Euros (€ EUR)",
    roleAdmin: "🛡️ Admin",
    roleOwner: "👤 Owner",
    activeCurrencyLabel: "Active Unit Currency",
    activeCurrencyUSD: "Dollars ($ USD)",
    activeCurrencyEUR: "Euros (€ EUR)",

    // Hero Section
    brokerRepresentativeText: "Prime Broker Representative Model Active",
    heroHeadingMain: "Minimalist Shelters",
    heroHeadingHighlight: "For Pure Organic Living",
    heroSubheading: "Submit your elite real estate listing under full identity mask protection. All approved entries are brokered and certified directly by Prime Administrators.",

    // Main workspace search & filters
    searchPlaceholder: "Search by neighborhood, architectural style, or keyword...",
    searchClear: "CLEAR",
    filtersLabel: "Filters",
    addListingBtn: "+ Add Listing",
    filteredCountSingular: "{count} rare architectural site matching filters",
    filteredCountPlural: "{count} rare architectural sites matching filters",
    noListingsFound: "No architectural shelters found matching your criteria. Try adjusting your premium filters.",
    allFilters: "All",
    anyOption: "Any",
    applyFilters: "Apply Filters",
    resetFilters: "Reset Filters",

    // Filter fields
    filterNeighborhood: "Neighborhood / Region",
    filterType: "Listing Type",
    filterBedrooms: "Bedrooms Count",
    filterMaxBudget: "Max Budget Limit ({currency})",
    filterExchangeNotice: "* Converted live from USD limits (1 USD = {rate} EUR)",
    buyOption: "Buy (For Sale)",
    rentOption: "Rent (For Lease)",

    // Chat / AI Companion panel
    chatHeaderTitle: "AI Architectural Advisor",
    chatSubtitle: "Subconscious Spatial Reasoning Module",
    chatDisclaimer: "Ask about Morrocan construction materials, brutalist concrete layouts, or structural pricing valuations.",
    chatPlaceholder: "Ask our automated advisor about Marrakech or Tanger spaces...",
    chatSend: "Query",
    chatSystemGreeting: "Welcome to Prime Estates. I can assist you with building codes, clay soils, structural steel spans, and prime real estate valuations across Morocco. What are you looking to design?",
    chatCalculating: "Analyzing spatial query...",

    // Property Card
    cardExclusiveLabel: "Prime Exclusive",
    cardVettedLabel: "Vetted",
    cardApprovedBy: "Approved by: {name}",
    cardPendingApproval: "Pending Team Verification",
    cardRejected: "Refused by Brokerage",
    cardDetailsBtn: "Structure Details",
    cardBed: "Bed",
    cardBeds: "Beds",
    cardBath: "Bath",
    cardBaths: "Baths",
    cardContactBroker: "Contact Broker",
    cardContactOwner: "Contact Owner",
    cardForSale: "For Sale",
    cardForRent: "For Rent",
    cardYourSubmission: "Your Submission",
    cardMore: "+{count} more",
    cardAdvisoryPartner: "Prime Advisory Partner",
    cardExpand: "Expand",
    cardClose: "Close",
    cardBroker: "Broker",
    cardVettedAdvisoryNotice: "Listing vetted & brokered on behalf of property owner. For queries, contact Prime Client Advisory.",

    // Property Detail Drawer
    drawerTitle: "Architectural Details",
    drawerEstValuation: "Est. Valuation",
    drawerEstRentalRate: "Est. Rental Rate",
    drawerSpacialLayout: "Spacial Layout",
    drawerUnitCost: "Unit Cost Evaluation",
    drawerExclusiveCertifiedBadge: "Exclusive Certified Structure",
    drawerAmenitiesTitle: "Engineered Amenities",
    drawerBrokerContactHeader: "Direct Broker Communications",
    drawerBrokerName: "Marcus Sterling",
    drawerBrokerTitle: "Principal Vetting Broker",
    drawerBrokerPlaceholder: "I have reviewed this file and verified the legal boundaries, solar grid logs, and structural integrity certificates for absolute protection.",
    drawerBrokerCall: "Secure Call",
    drawerBrokerEmail: "Direct Email",
    drawerBrokerIdentityMask: "Secure Identity Mask Mode Active",
    drawerIdentityMaskExplanation: "The owner's contact info is encrypted. All messages route securely through the principal broker's terminal.",
    drawerOwnerContactHeader: "Direct Owner Communications",
    drawerContactOwnerLabel: "Owner Representative",
    drawerContactButton: "Open Communications",
    drawerCopyBtn: "Copy Link",
    drawerCopiedBtn: "Copied!",

    // Add Property Form Modal
    formHeadline: "Submit Architectural Site",
    formSubheadline: "Provide structural details to list your property. All listings undergo strict legal audits by Prime Administrators.",
    formTitleLabel: "Listing Title / Architectural Concept",
    formTitlePlaceholder: "e.g., Ultra-Brutalist Concrete Oasis",
    formDescriptionLabel: "Design Philosophy & Architectural Description",
    formDescriptionPlaceholder: "e.g., A triple-height raw concrete structure with automated thermal curtains and cedar wood sauna...",
    formPriceLabel: "Listing Price ($ USD)",
    formPriceRentLabel: "Monthly Rent ($ USD)",
    formPricePlaceholder: "1,200,000",
    formPriceRentPlaceholder: "2,800",
    formConversionNotice: "Approximate conversion: {converted} (@ 1 USD = {rate} EUR)",
    formLocationLabel: "Geographical Sector",
    formSizeLabel: "Interior Area (m²)",
    formBedroomsLabel: "Bedrooms",
    formBathroomsLabel: "Bathrooms",
    formAmenitiesGroup: "Amenities & Infrastructure",
    formImageLabel: "Select Architectural Render / Photo",
    formSubmitBtn: "Deploy Listing To Audit",
    formCancelBtn: "Dismiss",
    formValidationError: "Please fill all required fields and specify positive dimensions.",

    // Dashboard View - General
    dashSystemAnalytics: "Brokerage Metrics & Portfolios",
    dashProfileTitle: "My Identity Profile",
    dashVettedNetVal: "My Vetted Net Valuation",
    dashBrokeredVolCap: "Brokered Volume Cap",
    dashContributors: "Certified Contributors",
    dashGlobalSubmissions: "Approved Structures",
    dashPendingSubmissionsCount: "Pending Audits",
    dashRejectedIssuesCount: "Refused Layouts",

    dashProfileSubtitle: "Update your public contact info for direct listings",
    dashFullName: "Full Legal Name",
    dashEmail: "Validated Email",
    dashPhone: "Secure Phone Number",
    dashSaveProfileBtn: "Update Identity Ledger",
    dashIdentityVerifiedBadge: "Verified Identity",

    dashInboxTitle: "Broker & Participant Channels",
    dashInboxDesc: "Secure encrypted channels between owners and brokerage auditors",
    dashInboxNoActiveChat: "Select a channel from the left sidebar to enter secure transit",
    dashInboxParticipantLabel: "Participant Channel",
    dashInboxVettingAuditor: "Vetting Broker",
    dashInboxMemberType: "Participant Status",

    dashVettingQueueTitle: "Vetting Administration Queues",
    dashVettingQueueDesc: "Verify compliance of newly deployed architectural submissions",
    dashAdminActions: "Admin Controls",
    dashApproveBtn: "Approve Listing",
    dashRejectBtn: "Refuse Listing",
    dashAuditActiveLabel: "Auditor Identity Verified",

    dashMySubmissionsTitle: "My Submitted Portfolios",
    dashMySubmissionsDesc: "Monitor review states or update live listings",
    dashNoMySubmissions: "You have not submitted any architectural profiles yet.",
    dashStatusPending: "PENDING LEGAL VETTING",
    dashStatusApproved: "APPROVED & INTERPOLATED",
    dashStatusRejected: "REFUSED COMPLIANCE",
    dashMarketPriceLabel: "Market Price",

    // Dialog: Create Test Profile
    regTitle: "Create Test Profile",
    regSubtitle: "Enter contact info to audit listings or act as admin",
    regOAuthLabel: "Quick Register using Social OAuth",
    regGoogleConnect: "Google Connect",
    regGithubConnect: "GitHub Connect",
    regCredentialsTitle: "Or Register Credentials",
    regFullNameLabel: "Full Legal Name",
    regEmailLabel: "Audit Email Address",
    regPhoneLabel: "Mobile Audit Number",
    regSystemRoleLabel: "Workspace System Role",
    regRoleOwnerMember: "👤 Owner Member",
    regRoleAdmin: "🛡️ Administrator",

    // Common words
    statusApprovedShort: "Approved",
    statusPendingShort: "Pending",
    statusRejectedShort: "Rejected",
    cancel: "Cancel",
    save: "Save"
  },
  fr: {
    // Top active session bar
    sessionBarTitle: "Simulateur de Session Active",
    sessionBarRoleOwner: "👤 Propriétaire (Lucas)",
    sessionBarRoleAdmin: "🛡️ Administrateur principal (Marcus)",
    sessionBarRegister: "+ Enregistrer un nouveau compte",
    
    // Header
    brandName: "PRIME ESTATES",
    navBuyCatalog: "Acheter (Catalogue)",
    navRentCatalog: "Louer (Catalogue)",
    navDashboard: "Tableau de Bord",
    currencyUSD: "USD $",
    currencyEUR: "EUR €",
    tooltipUSD: "Afficher les prix en dollars ($ USD)",
    tooltipEUR: "Afficher les prix convertis en euros (€ EUR)",
    roleAdmin: "🛡️ Administrateur",
    roleOwner: "👤 Propriétaire",
    activeCurrencyLabel: "Devise d'affichage",
    activeCurrencyUSD: "Dollars ($ USD)",
    activeCurrencyEUR: "Euros (€ EUR)",

    // Hero Section
    brokerRepresentativeText: "Modèle de Vente Certifié par Courtier Actif",
    heroHeadingMain: "Refuges Minimalistes",
    heroHeadingHighlight: "Pour une Vie Pure et Organique",
    heroSubheading: "Soumettez votre propriété d'exception de manière confidentielle. Tous les biens publiés sont vérifiés et négociés par des Administrateurs Agréés.",

    // Main workspace search & filters
    searchPlaceholder: "Rechercher par quartier, style architectural, mot-clé...",
    searchClear: "EFFACER",
    filtersLabel: "Filtres",
    addListingBtn: "+ Publier un Bien",
    filteredCountSingular: "{count} site architectural d'exception correspond aux filtres",
    filteredCountPlural: "{count} sites architecturaux d'exception correspondent aux filtres",
    noListingsFound: "Aucune propriété ne correspond à vos filtres premium. Veuillez ajuster vos critères.",
    allFilters: "Tous",
    anyOption: "Tous",
    applyFilters: "Appliquer les Filtres",
    resetFilters: "Réinitialiser",

    // Filter fields
    filterNeighborhood: "Quartier / Région",
    filterType: "Type de contrat",
    filterBedrooms: "Nombre de chambres",
    filterMaxBudget: "Budget maximum ({currency})",
    filterExchangeNotice: "* Converti en temps réel depuis l'USD (1 USD = {rate} EUR)",
    buyOption: "Achat (Vente)",
    rentOption: "Location (Mensuel)",

    // Chat / AI Companion panel
    chatHeaderTitle: "Conseiller Architectural IA",
    chatSubtitle: "Module d'Analyse Spatiale Subconsciente",
    chatDisclaimer: "Posez vos questions sur les matériaux de construction marocains, le béton brutaliste ou les estimations de prix.",
    chatPlaceholder: "Interrogez notre conseiller sur les espaces à Marrakech ou Tanger...",
    chatSend: "Envoyer",
    chatSystemGreeting: "Bienvenue sur Prime Estates. Je peux vous renseigner sur les réglementations de construction, les sols argileux, les structures métalliques et l'estimation des biens d'exception au Maroc. Quel projet souhaitez-vous concevoir ?",
    chatCalculating: "Analyse de la demande spatiale...",

    // Property Card
    cardExclusiveLabel: "Exclusivité Prime",
    cardVettedLabel: "Certifié conforme",
    cardApprovedBy: "Approuvé par: {name}",
    cardPendingApproval: "En cours de validation",
    cardRejected: "Refusé par l'administrateur",
    cardDetailsBtn: "Détails de la Structure",
    cardBed: "Chambre",
    cardBeds: "Chambres",
    cardBath: "SdB",
    cardBaths: "SdB",
    cardContactBroker: "Contacter le Courtier",
    cardContactOwner: "Contacter le Propriétaire",
    cardForSale: "En Vente",
    cardForRent: "En Location",
    cardYourSubmission: "Votre Soumission",
    cardMore: "+{count} de plus",
    cardAdvisoryPartner: "Courtier Conseil Prime",
    cardExpand: "Détails",
    cardClose: "Fermer",
    cardBroker: "Courtier",
    cardVettedAdvisoryNotice: "Annonce vérifiée et négociée pour le compte du propriétaire. Pour toute question, contactez le Service Client Prime.",

    // Property Detail Drawer
    drawerTitle: "Caractéristiques Architecturales",
    drawerEstValuation: "Évaluation estimative",
    drawerEstRentalRate: "Loyer mensuel estimé",
    drawerSpacialLayout: "Configuration Spatiale",
    drawerUnitCost: "Évaluation du coût unitaire",
    drawerExclusiveCertifiedBadge: "Structure Certifiée Exclusive",
    drawerAmenitiesTitle: "Équipements et Infrastructures",
    drawerBrokerContactHeader: "Communication Directe avec le Courtier",
    drawerBrokerName: "Marcus Sterling",
    drawerBrokerTitle: "Courtier Certificateur Principal",
    drawerBrokerPlaceholder: "J'ai personnellement inspecté ce dossier et validé les limites foncières, les performances du réseau solaire et le certificat d'intégrité structurelle pour une protection absolue.",
    drawerBrokerCall: "Appel Sécurisé",
    drawerBrokerEmail: "Email Direct",
    drawerBrokerIdentityMask: "Masquage Sécurisé d'Identité Actif",
    drawerIdentityMaskExplanation: "Les coordonnées du propriétaire sont cryptées. Tous les échanges transitent en toute sécurité par la messagerie du courtier principal.",
    drawerOwnerContactHeader: "Communication Directe avec le Propriétaire",
    drawerContactOwnerLabel: "Représentant Propriétaire",
    drawerContactButton: "Ouvrir les Communications",
    drawerCopyBtn: "Copier le Lien",
    drawerCopiedBtn: "Copié !",

    // Add Property Form Modal
    formHeadline: "Soumettre un Site Architectural",
    formSubheadline: "Renseignez les détails techniques de votre propriété. Toutes les soumissions font l'objet d'un audit juridique strict par les Administrateurs Prime.",
    formTitleLabel: "Nom du Bien / Concept Architectural",
    formTitlePlaceholder: "ex: Oasis Brutaliste en Béton Armé",
    formDescriptionLabel: "Philosophie du Design & Description du Bien",
    formDescriptionPlaceholder: "ex: Structure en béton brut à triple hauteur avec rideaux thermiques automatisés et sauna privé en bois de cèdre...",
    formPriceLabel: "Prix de Vente ($ USD)",
    formPriceRentLabel: "Loyer Mensuel ($ USD)",
    formPricePlaceholder: "1 200 000",
    formPriceRentPlaceholder: "2 800",
    formConversionNotice: "Conversion approximative: {converted} (@ 1 USD = {rate} EUR)",
    formLocationLabel: "Secteur Géographique",
    formSizeLabel: "Surface Habitable (m²)",
    formBedroomsLabel: "Chambres",
    formBathroomsLabel: "Salles de Bain",
    formAmenitiesGroup: "Équipements & Infrastructure",
    formImageLabel: "Sélectionner un Rendu d'Architecte / Photo",
    formSubmitBtn: "Soumettre à l'Audit de Validation",
    formCancelBtn: "Retour",
    formValidationError: "Veuillez remplir correctement tous les champs obligatoires et indiquer des valeurs positives.",

    // Dashboard View - General
    dashSystemAnalytics: "Analyses de Courtage & Portefeuilles",
    dashProfileTitle: "Mon Profil d'Identité",
    dashVettedNetVal: "Mon Évaluation Nette Certifiée",
    dashBrokeredVolCap: "Volume de Transactions Garanti",
    dashContributors: "Contributeurs Agréés",
    dashGlobalSubmissions: "Structures Validées",
    dashPendingSubmissionsCount: "Audits en cours",
    dashRejectedIssuesCount: "Plans Refusés",

    dashProfileSubtitle: "Mettez à jour vos informations publiques pour la mise en relation directe",
    dashFullName: "Nom Légal Complet",
    dashEmail: "Courriel Validé",
    dashPhone: "Numéro de Téléphone Sécurisé",
    dashSaveProfileBtn: "Mettre à Jour le Registre d'Identité",
    dashIdentityVerifiedBadge: "Identité Vérifiée",

    dashInboxTitle: "Canaux Directs & de Courtage",
    dashInboxDesc: "Canaux de messagerie sécurisés et cryptés avec la cellule d'audit",
    dashInboxNoActiveChat: "Sélectionnez une discussion dans la barre latérale pour communiquer en toute sécurité",
    dashInboxParticipantLabel: "Canal Adhérent",
    dashInboxVettingAuditor: "Courtier de Validation",
    dashInboxMemberType: "Statut du Bénéficiaire",

    dashVettingQueueTitle: "Administration des Files d'Attente d'Audits",
    dashVettingQueueDesc: "Vérifier la conformité réglementaire des nouveaux dossiers immobiliers",
    dashAdminActions: "Contrôles Administratifs",
    dashApproveBtn: "Approuver la Publication",
    dashRejectBtn: "Refuser l'Enregistrement",
    dashAuditActiveLabel: "Identité d'Auditeur Vérifiée",

    dashMySubmissionsTitle: "Mes Portefeuilles d'Exception",
    dashMySubmissionsDesc: "Suivez le statut de validation de vos propriétés ou mettez-les à jour",
    dashNoMySubmissions: "Vous n'avez pas encore soumis de proposition architecturale.",
    dashStatusPending: "EN ATTENTE D'AUDIT JURIDIQUE",
    dashStatusApproved: "APPROUVÉ & INSCRIT AU REGISTRE",
    dashStatusRejected: "REFUS DE CONFORMITÉ REGLEMENTAIRE",
    dashMarketPriceLabel: "Prix de Marché",

    // Dialog: Create Test Profile
    regTitle: "Créer un Profil de Test",
    regSubtitle: "Saisissez vos coordonnées pour valider les annonces ou agir en tant qu'administrateur",
    regOAuthLabel: "Inscription Rapide via Connexion Sociale",
    regGoogleConnect: "Connexion Google",
    regGithubConnect: "Connexion GitHub",
    regCredentialsTitle: "Ou Enregistrer vos Identifiants",
    regFullNameLabel: "Nom Légal Complet",
    regEmailLabel: "Adresse Courriel d'Audit",
    regPhoneLabel: "Numéro de Téléphone Mobile",
    regSystemRoleLabel: "Rôle Système attribué",
    regRoleOwnerMember: "👤 En tant que Propriétaire",
    regRoleAdmin: "🛡️ En tant qu'Administrateur",

    // Common words
    statusApprovedShort: "Approuvé",
    statusPendingShort: "En cours",
    statusRejectedShort: "Refusé",
    cancel: "Annuler",
    save: "Enregistrer"
  }
};

// Map of geographical locations to French equivalents
export const LOCATION_TRANSLATIONS: Record<string, string> = {
  'Palmerie, Marrakech': 'La Palmeraie, Marrakech',
  'Gueliz, Marrakech': 'Guéliz, Marrakech',
  'Rif Mountains, Chefchaouen': 'Montagnes du Rif, Chefchaouen',
  'La Marina, Casablanca': 'La Marina, Casablanca',
  'Marsham, Tanger': 'Marsham, Tanger',
  'Fes El Bali, Fes': 'Fès el Bali, Fès'
};

// Map of standard amenities to French equivalents
export const AMENITY_TRANSLATIONS: Record<string, string> = {
  'Pool': 'Piscine',
  'Gym': 'Salle de sport',
  'Smart Home': 'Maison intelligente',
  'Solar Grid': 'Réseau solaire',
  'Security System': 'Système de sécurité',
  'Wine Cellar': 'Cave à vin',
  'High Speed Wifi': 'Fibre haut débit',
  'Wooden Sauna': 'Sauna en bois',
  'Hot Tub': 'Bain à remous',
  'Fireplace': 'Cheminée',
  'Concierge Service': 'Service de conciergerie',
  'Rainwater Harvesting': 'Récupérateur d\'eau',
  'Minimalist Patio': 'Patio minimaliste',
  'Covered Parking': 'Parking couvert'
};

// Fixed listing-level translations for standard properties
export const LISTING_SPECIFIC_TRANSLATIONS: Record<string, { title: string; description: string; location: string }> = {
  'prop-1': {
    title: 'Le Pavillon de Verre Monolithique',
    description: "Ce chef-d'œuvre architectural fusionne des piliers en béton brut avec de dramatiques cloisons en verre trempé du sol au plafond. Comporte des parquets en chêne blanc huilé à larges lames, des panneaux acoustiques cachés haute fidélité et des robinets en cuivre coulés à la main. Positionné parfaitement sur une colline privée pour maximiser la vue sur les couchers de soleil du désert de Marrakech.",
    location: 'La Palmeraie, Marrakech'
  },
  'prop-2': {
    title: 'Loft Brutaliste Minimaliste',
    description: "Un design industriel saisissant doté de plafonds à triple hauteur et de poutres en acier brut. Niché au cœur du secteur créatif de Guéliz. L'unité s'étend sur deux niveaux ouverts reliés par un escalier métallique flottant, offrant un mélange parfait d'architecture commerciale structurée et de confort résidentiel ultra-premium.",
    location: 'Guéliz, Marrakech'
  },
  'prop-3': {
    title: 'Sanctuaire Forestier Scandinave',
    description: "Construite à partir de bois de l'Atlas provenant de sources locales, cette oasis de montagne présente une acoustique organique immaculée, un grand foyer au bois en pierre et des gardes-vues panoramiques surplombant les vallées. Dispose d'un chauffage par le sol radiant haut de gamme et d'un bassin de baignade privé en cèdre alimenté par une source naturelle.",
    location: 'Montagnes du Rif, Chefchaouen'
  },
  'prop-4': {
    title: 'Penthouse Aura au Bord de l\'Eau',
    description: "Suspendu au 42e étage de l'emblématique Marina Tower, cette résidence hyper-moderne comprend deux ascenseurs privés, un système de traitement de micro-filtration d'eau et un carrelage en terrazzo fait sur mesure. De vastes baies vitrées offrent une vue complètement dégagée sur le littoral de Casablanca.",
    location: 'La Marina, Casablanca'
  },
  'prop-5': {
    title: 'La Maison Éco-Bento avec Cour',
    description: "Une maison passive certifiée zéro-carbone s'organisant autour d'un jardin intérieur paisible en bambou. Conçue entièrement avec des argiles de terre non toxiques, une charpente en bois de construction et des rideaux d'ombrage dynamiques automatisés. Comprend deux superchargeurs de véhicule électrique de niveau 2 et des batteries de secours domestiques complètes.",
    location: 'Marsham, Tanger'
  },
  'prop-6': {
    title: 'Studio Brutaliste en Béton Brut',
    description: "Un abri brutaliste au style impeccable, doté de séparations modulables en chêne et de murs sablés en dalles sombres. Idéal pour les créateurs hautement concentrés à la recherche d'un espace de travail urbain épuré, équipé de commodités de cuisine complètes et de placards intelligents dissimulés.",
    location: 'Fès el Bali, Fès'
  }
};

/**
 * Main translation function pulling keys from DICTIONARY.
 * Supports string interpolation for placeholders like {count}, {rate}, {converted}, {currency}, {name}.
 */
export function t(key: keyof typeof DICTIONARY.en, lang: 'en' | 'fr', interpolations?: Record<string, string | number>): string {
  const dict = lang === 'fr' ? DICTIONARY.fr : DICTIONARY.en;
  let text = (dict[key] || DICTIONARY.en[key] || String(key)) as string;

  if (interpolations) {
    Object.entries(interpolations).forEach(([k, val]) => {
      text = text.replace(new RegExp(`{${k}}`, 'g'), String(val));
    });
  }
  return text;
}

/**
 * Translates a Listing dynamically depending on language selection.
 */
export function translateListing(listing: Listing, lang: 'en' | 'fr'): Listing {
  if (lang === 'en') return listing;
  
  const overrides = LISTING_SPECIFIC_TRANSLATIONS[listing.id];
  const translatedAmenities = listing.amenities.map(name => AMENITY_TRANSLATIONS[name] || name);
  const translatedLocation = LOCATION_TRANSLATIONS[listing.location] || listing.location;

  return {
    ...listing,
    title: overrides?.title || listing.title,
    description: overrides?.description || listing.description,
    location: overrides?.location || translatedLocation,
    amenities: translatedAmenities
  };
}

/**
 * Translates a single location string.
 */
export function translateLocation(location: string, lang: 'en' | 'fr'): string {
  if (lang === 'en') return location;
  return LOCATION_TRANSLATIONS[location] || location;
}

/**
 * Translates a single amenity string.
 */
export function translateAmenity(amenity: string, lang: 'en' | 'fr'): string {
  if (lang === 'en') return amenity;
  return AMENITY_TRANSLATIONS[amenity] || amenity;
}
