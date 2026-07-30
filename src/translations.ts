// Bilingual dictionary and translation utilities for Hostkeys Real Estate Portal
import { Listing } from './types';

export const DICTIONARY = {
  en: {
    // Header
    brandName: "HOSTKEYS",
    navBuyCatalog: "Buy (Properties)",
    navRentCatalog: "Rent (Properties)",
    navDashboard: "Dashboard",
    currencyMAD: "MAD DH",
    currencyUSD: "USD $",
    currencyEUR: "EUR €",
    tooltipMAD: "Show pricing in Moroccan Dirham (DH MAD)",
    tooltipUSD: "Show pricing in US Dollars ($ USD)",
    tooltipEUR: "Show pricing in Euros (€ EUR)",
    roleAdmin: "Admin",
    roleOwner: "Owner",
    activeCurrencyLabel: "Active Unit Currency",
    activeCurrencyMAD: "Moroccan Dirham (DH)",
    activeCurrencyUSD: "Dollars ($ USD)",
    activeCurrencyEUR: "Euros (€ EUR)",

    // Hero Section
    brokerRepresentativeText: "Hostkeys Verified Real Estate Portal",
    heroHeadingMain: "Minimalist & Luxury Shelters",
    heroHeadingHighlight: "For Organic Living in Morocco",
    heroSubheading: "Browse certified properties or submit your luxury listing under direct identity protection. All entries are audited and verified by Hostkeys.",

    // Main workspace search & filters
    searchPlaceholder: "Search by neighborhood, city, architectural style, or keyword...",
    searchClear: "CLEAR",
    filtersLabel: "Filters",
    addListingBtn: "Add Property",
    filteredCountSingular: "{count} property matching filters",
    filteredCountPlural: "{count} properties matching filters",
    noListingsFound: "No properties found matching your criteria. Try adjusting your search filters.",
    allFilters: "All",
    anyOption: "Any",
    applyFilters: "Apply Filters",
    resetFilters: "Reset Filters",

    // Filter fields
    filterNeighborhood: "Neighborhood / Region",
    filterType: "Listing Type",
    filterBedrooms: "Bedrooms Count",
    filterMaxBudget: "Max Budget Limit ({currency})",
    filterExchangeNotice: "* Converted live from USD limits",
    buyOption: "Buy (For Sale)",
    rentOption: "Rent (For Lease)",

    // Chat / AI Companion panel
    chatHeaderTitle: "Hostkeys AI Advisor",
    chatSubtitle: "Architectural & Real Estate Assistant",
    chatDisclaimer: "Ask about Moroccan real estate laws, neighborhood valuations, or architectural materials.",
    chatPlaceholder: "Ask about Marrakech, Casablanca, or Tanger properties...",
    chatSend: "Query",
    chatSystemGreeting: "Welcome to Hostkeys. I can assist you with property valuations, building codes, clay soils, structural steel spans, and real estate insights across Morocco. What are you looking for?",
    chatCalculating: "Analyzing spatial query...",

    // Property Card
    cardExclusiveLabel: "Hostkeys Exclusive",
    cardVettedLabel: "Vetted",
    cardApprovedBy: "Approved by: {name}",
    cardPendingApproval: "Pending Team Verification",
    cardRejected: "Refused by Brokerage",
    cardDetailsBtn: "Structure Details",
    cardBed: "Bed",
    cardBeds: "Beds",
    cardBath: "Bath",
    cardBaths: "Baths",
    cardContactBroker: "Contact Hostkeys Admin",
    cardContactOwner: "Contact Owner",
    cardForSale: "For Sale",
    cardForRent: "For Rent",
    cardYourSubmission: "Your Property",
    cardMore: "+{count} more",
    cardAdvisoryPartner: "Hostkeys Advisory Partner",
    cardExpand: "Expand",
    cardClose: "Close",
    cardBroker: "Broker",
    cardVettedAdvisoryNotice: "Listing vetted & brokered on behalf of property owner. For queries, contact Hostkeys Client Advisory.",

    // Property Detail Drawer
    drawerTitle: "Property Details",
    drawerEstValuation: "Est. Valuation",
    drawerEstRentalRate: "Est. Rental Rate",
    drawerSpacialLayout: "Spacial Layout",
    drawerUnitCost: "Unit Cost Evaluation",
    drawerExclusiveCertifiedBadge: "Certified Hostkeys Property",
    drawerAmenitiesTitle: "Engineered Amenities",
    drawerBrokerContactHeader: "Direct Communications",
    drawerBrokerName: "Hostkeys Support",
    drawerBrokerTitle: "Principal Vetting Broker",
    drawerBrokerPlaceholder: "I have reviewed this property file and verified legal boundaries, solar grid logs, and structural integrity certificates.",
    drawerBrokerCall: "Secure Call",
    drawerBrokerEmail: "Direct Email",
    drawerBrokerIdentityMask: "Identity Mask Mode Active",
    drawerIdentityMaskExplanation: "The owner's contact info is encrypted. All messages route securely through Hostkeys advisory.",
    drawerOwnerContactHeader: "Direct Owner Communications",
    drawerContactOwnerLabel: "Owner Representative",
    drawerContactButton: "Open Communications",
    drawerCopyBtn: "Copy Link",
    drawerCopiedBtn: "Copied!",

    // Add Property Form Modal
    formHeadline: "List Your Property",
    formSubheadline: "Provide property details to publish your listing. All listings undergo verification by Hostkeys Administrators.",
    formTitleLabel: "Listing Title",
    formTitlePlaceholder: "e.g., Modern Luxury Villa with Private Pool",
    formDescriptionLabel: "Property Description",
    formDescriptionPlaceholder: "e.g., A spacious 3-bedroom villa in Palmerie featuring floor-to-ceiling windows, private garden, and solar panels...",
    formPriceLabel: "Listing Price ($ USD)",
    formPriceRentLabel: "Monthly Rent ($ USD)",
    formPricePlaceholder: "1,200,000",
    formPriceRentPlaceholder: "2,800",
    formConversionNotice: "Approximate conversion: {converted}",
    formLocationLabel: "City / Sector",
    formSizeLabel: "Interior Area (m²)",
    formBedroomsLabel: "Bedrooms",
    formBathroomsLabel: "Bathrooms",
    formAmenitiesGroup: "Amenities & Features",
    formImageLabel: "Select Property Image / Photo",
    formSubmitBtn: "Publish Property",
    formCancelBtn: "Dismiss",
    formValidationError: "Please fill all required fields with valid numbers.",

    // Dashboard View - General
    dashSystemAnalytics: "Hostkeys Analytics & Portfolio",
    dashProfileTitle: "My Identity Profile",
    dashVettedNetVal: "My Listed Portfolio Valuation",
    dashBrokeredVolCap: "Total Active Value",
    dashContributors: "Certified Partners",
    dashGlobalSubmissions: "Approved Properties",
    dashPendingSubmissionsCount: "Pending Reviews",
    dashRejectedIssuesCount: "Refused Listings",

    dashProfileSubtitle: "Update your contact information for real estate inquiries",
    dashFullName: "Full Name",
    dashEmail: "Email Address",
    dashPhone: "Phone Number",
    dashSaveProfileBtn: "Save Profile Changes",
    dashIdentityVerifiedBadge: "Verified Account",

    dashInboxTitle: "Inquiries & Messages",
    dashInboxDesc: "Direct messaging channels between property owners and Hostkeys advisors",
    dashInboxNoActiveChat: "Select a conversation from the left sidebar",
    dashInboxParticipantLabel: "Participant Channel",
    dashInboxVettingAuditor: "Hostkeys Advisor",
    dashInboxMemberType: "Participant Status",

    dashVettingQueueTitle: "Pending Property Verification Queue",
    dashVettingQueueDesc: "Review and approve newly submitted property listings",
    dashAdminActions: "Admin Controls",
    dashApproveBtn: "Approve Property",
    dashRejectBtn: "Refuse Property",
    dashAuditActiveLabel: "Admin Access Active",

    dashMySubmissionsTitle: "My Property Portfolio",
    dashMySubmissionsDesc: "Manage and track your active real estate listings",
    dashNoMySubmissions: "You have not listed any properties yet. Click 'Add Property' to publish one!",
    dashStatusPending: "PENDING VERIFICATION",
    dashStatusApproved: "APPROVED & LIVE",
    dashStatusRejected: "REFUSED",
    dashMarketPriceLabel: "Market Price",

    // Auth Dialog
    regTitle: "Account Access",
    regSubtitle: "Sign in to your Hostkeys account to manage properties",
    regOAuthLabel: "Quick Sign In with Google",
    regGoogleConnect: "Continue with Google",
    regGithubConnect: "Continue with GitHub",
    regCredentialsTitle: "Or Sign In with Email",
    regFullNameLabel: "Full Name",
    regEmailLabel: "Email Address",
    regPhoneLabel: "Phone Number",
    regSystemRoleLabel: "Account Role",
    regRoleOwnerMember: "Property Owner",
    regRoleAdmin: "Administrator",

    // Common words
    statusApprovedShort: "Approved",
    statusPendingShort: "Pending",
    statusRejectedShort: "Rejected",
    cancel: "Cancel",
    save: "Save"
  },
  fr: {
    // Header
    brandName: "HOSTKEYS",
    navBuyCatalog: "Acheter",
    navRentCatalog: "Louer",
    navDashboard: "Tableau de Bord",
    currencyMAD: "MAD DH",
    currencyUSD: "USD $",
    currencyEUR: "EUR €",
    tooltipMAD: "Afficher les prix en Dirhams Marocains (DH)",
    tooltipUSD: "Afficher les prix en Dollars ($ USD)",
    tooltipEUR: "Afficher les prix en Euros (€ EUR)",
    roleAdmin: "Administrateur",
    roleOwner: "Propriétaire",
    activeCurrencyLabel: "Devise d'affichage",
    activeCurrencyMAD: "Dirhams Marocains (DH)",
    activeCurrencyUSD: "Dollars ($ USD)",
    activeCurrencyEUR: "Euros (€ EUR)",

    // Hero Section
    brokerRepresentativeText: "Portail Immobilier Certifié Hostkeys",
    heroHeadingMain: "Propriétés d'Exception",
    heroHeadingHighlight: "Pour une Vie Moderne au Maroc",
    heroSubheading: "Parcourez des biens d'exception certifiés ou soumettez votre propriété sous protection d'identité. Tous les biens sont audités par Hostkeys.",

    // Main workspace search & filters
    searchPlaceholder: "Rechercher par ville, quartier, style, mot-clé...",
    searchClear: "EFFACER",
    filtersLabel: "Filtres",
    addListingBtn: "Publier un Bien",
    filteredCountSingular: "{count} propriété correspond à vos critères",
    filteredCountPlural: "{count} propriétés correspondent à vos critères",
    noListingsFound: "Aucune propriété ne correspond à vos filtres. Veuillez ajuster vos critères.",
    allFilters: "Tous",
    anyOption: "Tous",
    applyFilters: "Appliquer les Filtres",
    resetFilters: "Réinitialiser",

    // Filter fields
    filterNeighborhood: "Ville / Région",
    filterType: "Type de transaction",
    filterBedrooms: "Nombre de chambres",
    filterMaxBudget: "Budget maximum ({currency})",
    filterExchangeNotice: "* Converti en temps réel depuis l'USD",
    buyOption: "Achat (Vente)",
    rentOption: "Location (Mensuel)",

    // Chat / AI Companion panel
    chatHeaderTitle: "Conseiller IA Hostkeys",
    chatSubtitle: "Assistant Immobilier & Architectural",
    chatDisclaimer: "Posez vos questions sur l'immobilier marocain, les prix par quartier ou les matériaux.",
    chatPlaceholder: "Interrogez notre conseiller sur Marrakech, Casablanca ou Tanger...",
    chatSend: "Envoyer",
    chatSystemGreeting: "Bienvenue sur Hostkeys. Je peux vous renseigner sur les prix de l'immobilier, les réglementations de construction et le marché immobilier au Maroc. Que recherchez-vous ?",
    chatCalculating: "Analyse en cours...",

    // Property Card
    cardExclusiveLabel: "Exclusivité Hostkeys",
    cardVettedLabel: "Certifié conforme",
    cardApprovedBy: "Approuvé par: {name}",
    cardPendingApproval: "En cours de validation",
    cardRejected: "Refusé",
    cardDetailsBtn: "Détails de la Propriété",
    cardBed: "Chambre",
    cardBeds: "Chambres",
    cardBath: "SdB",
    cardBaths: "SdB",
    cardContactBroker: "Contacter Hostkeys Admin",
    cardContactOwner: "Contacter le Propriétaire",
    cardForSale: "En Vente",
    cardForRent: "En Location",
    cardYourSubmission: "Votre Propriété",
    cardMore: "+{count} de plus",
    cardAdvisoryPartner: "Partenaire Hostkeys",
    cardExpand: "Détails",
    cardClose: "Fermer",
    cardBroker: "Courtier",
    cardVettedAdvisoryNotice: "Annonce vérifiée et négociée par Hostkeys. Pour toute question, contactez notre équipe.",

    // Property Detail Drawer
    drawerTitle: "Caractéristiques de la Propriété",
    drawerEstValuation: "Évaluation estimative",
    drawerEstRentalRate: "Loyer mensuel estimé",
    drawerSpacialLayout: "Configuration Spatiale",
    drawerUnitCost: "Évaluation du coût unitaire",
    drawerExclusiveCertifiedBadge: "Propriété Certifiée Hostkeys",
    drawerAmenitiesTitle: "Équipements et Prestations",
    drawerBrokerContactHeader: "Communications Directes",
    drawerBrokerName: "Support Hostkeys",
    drawerBrokerTitle: "Courtier Certificateur",
    drawerBrokerPlaceholder: "J'ai personnellement inspecté cette propriété et validé l'ensemble des éléments juridiques et techniques.",
    drawerBrokerCall: "Appel Sécurisé",
    drawerBrokerEmail: "Email Direct",
    drawerBrokerIdentityMask: "Protection d'Identité Active",
    drawerIdentityMaskExplanation: "Les coordonnées du propriétaire sont protégées. Les échanges transitent par Hostkeys.",
    drawerOwnerContactHeader: "Communication Directe avec le Propriétaire",
    drawerContactOwnerLabel: "Représentant Propriétaire",
    drawerContactButton: "Ouvrir la Discussion",
    drawerCopyBtn: "Copier le Lien",
    drawerCopiedBtn: "Copié !",

    // Add Property Form Modal
    formHeadline: "Publier Votre Propriété",
    formSubheadline: "Renseignez les détails de votre bien. Toutes les soumissions sont vérifiées par les Administrateurs Hostkeys.",
    formTitleLabel: "Titre de l'Annonce",
    formTitlePlaceholder: "ex: Villa Moderne de Luxe avec Piscine Privée",
    formDescriptionLabel: "Description de la Propriété",
    formDescriptionPlaceholder: "ex: Spacieuse villa de 3 chambres à La Palmeraie avec jardin paysager, baie vitrée et panneaux solaires...",
    formPriceLabel: "Prix de Vente ($ USD)",
    formPriceRentLabel: "Loyer Mensuel ($ USD)",
    formPricePlaceholder: "1 200 000",
    formPriceRentPlaceholder: "2 800",
    formConversionNotice: "Conversion approximative: {converted}",
    formLocationLabel: "Ville / Secteur",
    formSizeLabel: "Surface Habitable (m²)",
    formBedroomsLabel: "Chambres",
    formBathroomsLabel: "Salles de Bain",
    formAmenitiesGroup: "Équipements & Prestations",
    formImageLabel: "Photo de la Propriété",
    formSubmitBtn: "Publier la Propriété",
    formCancelBtn: "Annuler",
    formValidationError: "Veuillez remplir correctement tous les champs obligatoires.",

    // Dashboard View - General
    dashSystemAnalytics: "Analyses Hostkeys & Portefeuille",
    dashProfileTitle: "Mon Profil",
    dashVettedNetVal: "Évaluation de mon Portefeuille",
    dashBrokeredVolCap: "Valeur Totale des Biens",
    dashContributors: "Partenaires Certifiés",
    dashGlobalSubmissions: "Propriétés Approuvées",
    dashPendingSubmissionsCount: "Audits en cours",
    dashRejectedIssuesCount: "Annonces Refusées",

    dashProfileSubtitle: "Mettez à jour vos informations de contact pour les demandes de renseignements",
    dashFullName: "Nom Complet",
    dashEmail: "Adresse Courriel",
    dashPhone: "Numéro de Téléphone",
    dashSaveProfileBtn: "Enregistrer le Profil",
    dashIdentityVerifiedBadge: "Compte Vérifié",

    dashInboxTitle: "Demandes & Messages",
    dashInboxDesc: "Messagerie directe entre propriétaires et conseillers Hostkeys",
    dashInboxNoActiveChat: "Sélectionnez une discussion dans la barre latérale",
    dashInboxParticipantLabel: "Discussion",
    dashInboxVettingAuditor: "Conseiller Hostkeys",
    dashInboxMemberType: "Statut",

    dashVettingQueueTitle: "File d'Attente de Validation des Propriétés",
    dashVettingQueueDesc: "Examiner et approuver les nouvelles annonces soumises",
    dashAdminActions: "Contrôles Administrateurs",
    dashApproveBtn: "Approuver la Propriété",
    dashRejectBtn: "Refuser la Propriété",
    dashAuditActiveLabel: "Accès Administrateur Actif",

    dashMySubmissionsTitle: "Mes Biens Immobiliers",
    dashMySubmissionsDesc: "Gérez vos annonces immobilières actives",
    dashNoMySubmissions: "Vous n'avez pas encore publié de propriété. Cliquez sur '+ Publier un Bien' pour en ajouter une !",
    dashStatusPending: "EN COURS DE VALIDATION",
    dashStatusApproved: "APPROUVÉ & EN LIGNE",
    dashStatusRejected: "REFUSÉ",
    dashMarketPriceLabel: "Prix du Marché",

    // Auth Dialog
    regTitle: "Accès au Compte",
    regSubtitle: "Connectez-vous à votre compte Hostkeys pour gérer vos biens",
    regOAuthLabel: "Connexion Rapide avec Google",
    regGoogleConnect: "Continuer avec Google",
    regGithubConnect: "Continuer avec GitHub",
    regCredentialsTitle: "Ou Connexion par Courriel",
    regFullNameLabel: "Nom Complet",
    regEmailLabel: "Adresse Courriel",
    regPhoneLabel: "Numéro de Téléphone",
    regSystemRoleLabel: "Rôle du Compte",
    regRoleOwnerMember: "Propriétaire",
    regRoleAdmin: "Administrateur",

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

export function translateListing(listing: Listing, lang: 'en' | 'fr'): Listing {
  if (lang === 'en') return listing;
  
  const translatedAmenities = listing.amenities.map(name => AMENITY_TRANSLATIONS[name] || name);
  const translatedLocation = LOCATION_TRANSLATIONS[listing.location] || listing.location;

  return {
    ...listing,
    location: translatedLocation,
    amenities: translatedAmenities
  };
}

export function translateLocation(location: string, lang: 'en' | 'fr'): string {
  if (lang === 'en') return location;
  return LOCATION_TRANSLATIONS[location] || location;
}

export function translateAmenity(amenity: string, lang: 'en' | 'fr'): string {
  if (lang === 'en') return amenity;
  return AMENITY_TRANSLATIONS[amenity] || amenity;
}
