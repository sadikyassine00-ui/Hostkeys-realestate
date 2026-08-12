// Polyglot dictionary and translation utilities for Hostkeys Real Estate Portal (EN, FR, AR)
import { Listing } from './types';

export type Language = 'en' | 'fr' | 'ar';

export const DICTIONARY = {
  en: {
    // Header
    brandName: "HOSTKEYS",
    navBuyCatalog: "Buy Properties",
    navRentCatalog: "Rent Properties",
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
    brokerRepresentativeText: "Morocco's Premier Real Estate Portal",
    heroHeadingMain: "Find Your Dream Property",
    heroHeadingHighlight: "In Morocco",
    heroSubheading: "Discover verified luxury villas, modern apartments, and authentic riads for sale or rent across Marrakech, Casablanca, Tangier, Agadir, and Rabat.",

    // Main workspace search & filters
    searchPlaceholder: "Search villas, apartments, or cities (Marrakech, Casablanca, Tangier...)",
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
    filterNeighborhood: "City in Morocco",
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
    cardBedroom: "Bedroom",
    cardBedrooms: "Bedrooms",
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
    navBuyCatalog: "Acheter un bien",
    navRentCatalog: "Louer un bien",
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
    brokerRepresentativeText: "Le Premier Portail Immobilier au Maroc",
    heroHeadingMain: "Trouvez la Propriété Idéale",
    heroHeadingHighlight: "au Maroc",
    heroSubheading: "Découvrez des villas de luxe, appartements modernes et riads authentiques à vendre ou à louer à Marrakech, Casablanca, Tanger, Agadir et Rabat.",

    // Main workspace search & filters
    searchPlaceholder: "Rechercher des villas, appartements ou villes (Marrakech, Casablanca, Tanger...)",
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
    filterNeighborhood: "Ville au Maroc",
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
    cardBedroom: "Chambre",
    cardBedrooms: "Chambres",
    cardBed: "Lit",
    cardBeds: "Lits",
    cardBath: "SdB",
    cardBaths: "SdBs",
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
  },
  ar: {
    // Header
    brandName: "HOSTKEYS",
    navBuyCatalog: "شراء عقار",
    navRentCatalog: "كراء عقار",
    navDashboard: "لوحة التحكم",
    currencyMAD: "درهم مغربي",
    currencyUSD: "دولار $",
    currencyEUR: "أورو €",
    tooltipMAD: "عرض الأسعار بالدرهم المغربي (DH)",
    tooltipUSD: "عرض الأسعار بالدولار الأمريكي ($)",
    tooltipEUR: "عرض الأسعار بالأورو (€)",
    roleAdmin: "مشرف",
    roleOwner: "مالك العقار",
    activeCurrencyLabel: "عملة العرض",
    activeCurrencyMAD: "الدرهم المغربي (DH)",
    activeCurrencyUSD: "الدولار الأمريكي ($)",
    activeCurrencyEUR: "الأورو (€)",

    // Hero Section
    brokerRepresentativeText: "المنصة العقارية الأولى في المغرب",
    heroHeadingMain: "اعثر على عقار أحلامك",
    heroHeadingHighlight: "في المغرب",
    heroSubheading: "اكتشف فيلات فاخرة، شققاً حديثة، ورياضات تقليدية للبيع أو الكراء في مراكش، الدار البيضاء، طنجة، أكادير والرباط مع هوستكيز.",

    // Main workspace search & filters
    searchPlaceholder: "ابحث عن فيلات، شقق أو مدن (مراكش، الدار البيضاء، طنجة...)",
    searchClear: "مسح",
    filtersLabel: "تصفية",
    addListingBtn: "إضافة عقار",
    filteredCountSingular: "عقار واحد يطابق خيارات التصفية",
    filteredCountPlural: "{count} عقارات تطابق خيارات التصفية",
    noListingsFound: "لم يتم العثور على أي عقار يطابق خيارات البحث. يرجى تعديل معايير البحث.",
    allFilters: "الكل",
    anyOption: "الكل",
    applyFilters: "تطبيق التصفية",
    resetFilters: "إعادة ضبط",

    // Filter fields
    filterNeighborhood: "المدينة في المغرب",
    filterType: "نوع المعاملة",
    filterBedrooms: "عدد الغرف",
    filterMaxBudget: "الحد الأقصى للميزانية ({currency})",
    filterExchangeNotice: "* تحويل مباشر حسب سعر الصرف",
    buyOption: "شراء (للبيع)",
    rentOption: "كراء (شهري)",

    // Chat / AI Companion panel
    chatHeaderTitle: "المستشار الذكي هوستكيز",
    chatSubtitle: "مساعد الهندسة والعقارات بالمغرب",
    chatDisclaimer: "استفسر عن قوانين العقار المغربية، أسعار الأحياء، أو مواد البناء.",
    chatPlaceholder: "اسأل عن عقارات مراكش، الدار البيضاء، أو طنجة...",
    chatSend: "إرسال",
    chatSystemGreeting: "مرحباً بك في هوستكيز. يمكنني مساعدتك في تقييم العقارات، قوانين البناء، والرؤى العقارية عبر المملكة المغربية. ما الذي تبحث عنه؟",
    chatCalculating: "جاري تحليل الاستفسار...",

    // Property Card
    cardExclusiveLabel: "حصري لدى هوستكيز",
    cardVettedLabel: "عقار موثق",
    cardApprovedBy: "تم التدقيق بواسطة: {name}",
    cardPendingApproval: "قيد التدقيق والتحقق",
    cardRejected: "مرفوض",
    cardDetailsBtn: "تفاصيل العقار",
    cardBedroom: "غرفة",
    cardBedrooms: "غرف",
    cardBed: "سرير",
    cardBeds: "أسرة",
    cardBath: "حمام",
    cardBaths: "حمامات",
    cardContactBroker: "الاتصال بإدارة هوستكيز",
    cardContactOwner: "الاتصال بمالك العقار",
    cardForSale: "للبيع",
    cardForRent: "للكراء",
    cardYourSubmission: "عقارك المعروض",
    cardMore: "+{count} المزيد",
    cardAdvisoryPartner: "شريك هوستكيز",
    cardExpand: "التفاصيل",
    cardClose: "إغلاق",
    cardBroker: "وكيل",
    cardVettedAdvisoryNotice: "عقار مراجع وموثق من طرف هوستكيز. للاستفسارات اتصل بمركز خدمة العملاء.",

    // Property Detail Drawer
    drawerTitle: "مواصفات العقار",
    drawerEstValuation: "القيمة التقديرية",
    drawerEstRentalRate: "السوم الكرائي التقديري",
    drawerSpacialLayout: "التوزيع العمراني",
    drawerUnitCost: "تقييم التكلفة",
    drawerExclusiveCertifiedBadge: "عقار معتمد من هوستكيز",
    drawerAmenitiesTitle: "المرافق والتجهيزات",
    drawerBrokerContactHeader: "الاتصال المباشر",
    drawerBrokerName: "دعم هوستكيز",
    drawerBrokerTitle: "مستشار عقاري معتمد",
    drawerBrokerPlaceholder: "قمنا بمعاينة وتوثيق الوثائق القانونية والسلامة المعمارية لهذا العقار.",
    drawerBrokerCall: "اتصال آمن",
    drawerBrokerEmail: "بريد مباشر",
    drawerBrokerIdentityMask: "حماية هوية المالك مفعلة",
    drawerIdentityMaskExplanation: "بيانات التواصل مع المالك محمية. جميع المراسلات تمر عبر مستشاري هوستكيز.",
    drawerOwnerContactHeader: "التواصل المباشر مع المالك",
    drawerContactOwnerLabel: "ممثل مالك العقار",
    drawerContactButton: "فتح المحادثة",
    drawerCopyBtn: "نسخ الرابط",
    drawerCopiedBtn: "تم النسخ!",

    // Add Property Form Modal
    formHeadline: "إضافة عقارك",
    formSubheadline: "أدخل تفاصيل عقارك لنشره. يخضع كل عقار لمراجعة وتأكيد مديري هوستكيز.",
    formTitleLabel: "عنوان الإعلان",
    formTitlePlaceholder: "مثال: فيلا فاخرة بمسبح خاص في مراكش",
    formDescriptionLabel: "وصف العقار",
    formDescriptionPlaceholder: "مثال: فيلا واسعة تضم 3 غرف ونوافذ زجاجية كبيرة وجاردن ومساحات مشمسة...",
    formPriceLabel: "ثمن البيع ($ USD)",
    formPriceRentLabel: "واجب الكراء الشهري ($ USD)",
    formPricePlaceholder: "1,200,000",
    formPriceRentPlaceholder: "2,800",
    formConversionNotice: "التحويل التقديري: {converted}",
    formLocationLabel: "المدينة / الحي",
    formSizeLabel: "المساحة الإجمالية (م²)",
    formBedroomsLabel: "عدد الغرف",
    formBathroomsLabel: "عدد الحمامات",
    formAmenitiesGroup: "المرافق والتجهيزات",
    formImageLabel: "صورة العقار",
    formSubmitBtn: "نشر العقار",
    formCancelBtn: "إلغاء",
    formValidationError: "يرجى ملء جميع الحقول المطلوبة بشكل صحيح.",

    // Dashboard View - General
    dashSystemAnalytics: "إحصائيات هوستكيز والمحفظة العقارية",
    dashProfileTitle: "الملف الشخصي",
    dashVettedNetVal: "القيمة الإجمالية لمحفظتي",
    dashBrokeredVolCap: "القيمة الإجمالية للعقارات",
    dashContributors: "الشركاء المعتمدون",
    dashGlobalSubmissions: "العقارات المعتمدة",
    dashPendingSubmissionsCount: "طلبات قيد المراجعة",
    dashRejectedIssuesCount: "الإعلانات المرفوضة",

    dashProfileSubtitle: "قم بتحديث معلومات التواصل الخاصة بك لتلقي استفسارات العقارات",
    dashFullName: "الاسم الكامل",
    dashEmail: "البريد الإلكتروني",
    dashPhone: "رقم الهاتف",
    dashSaveProfileBtn: "حفظ التغييرات",
    dashIdentityVerifiedBadge: "حساب موثق",

    dashInboxTitle: "الرسائل والاستفسارات",
    dashInboxDesc: "محادثات مباشرة بين المالكين ومستشاري هوستكيز",
    dashInboxNoActiveChat: "اختر محادثة من القائمة الجانبية",
    dashInboxParticipantLabel: "المحادثة",
    dashInboxVettingAuditor: "مستشار هوستكيز",
    dashInboxMemberType: "الصفة",

    dashVettingQueueTitle: "قائمة مراجعة العقارات المعلقة",
    dashVettingQueueDesc: "مراجعة والموافقة على إعلانات العقارات الجديدة",
    dashAdminActions: "صلاحيات المشرف",
    dashApproveBtn: "الموافقة على العقار",
    dashRejectBtn: "رفض العقار",
    dashAuditActiveLabel: "صلاحية الإشراف مفعلة",

    dashMySubmissionsTitle: "عقاراتي المعروضة",
    dashMySubmissionsDesc: "إدارة ومتابعة عقاراتك المعروضة على المنصة",
    dashNoMySubmissions: "لم تقم بنشر أي عقار بعد. انقر على 'إضافة عقار' لنشر أول عقار لك!",
    dashStatusPending: "قيد التدقيق والتحقق",
    dashStatusApproved: "مقبول ومنشور",
    dashStatusRejected: "مرفوض",
    dashMarketPriceLabel: "سعر السوق",

    // Auth Dialog
    regTitle: "الدخول إلى الحساب",
    regSubtitle: "سجل دخولك لإدارة عقاراتك وتتبع الإعلانات",
    regOAuthLabel: "تسجيل دخول سريع بواسطة جوجل",
    regGoogleConnect: "المتابعة باستخدام جوجل",
    regGithubConnect: "المتابعة باستخدام جيت هاب",
    regCredentialsTitle: "أو الدخول بواسطة البريد الإلكتروني",
    regFullNameLabel: "الاسم الكامل",
    regEmailLabel: "البريد الإلكتروني",
    regPhoneLabel: "رقم الهاتف",
    regSystemRoleLabel: "نوع الحساب",
    regRoleOwnerMember: "مالك عقار",
    regRoleAdmin: "مشرف مبيعات",

    // Common words
    statusApprovedShort: "مقبول",
    statusPendingShort: "قيد المراجعة",
    statusRejectedShort: "مرفوض",
    cancel: "إلغاء",
    save: "حفظ"
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

// Map of geographical locations to Arabic equivalents
export const LOCATION_TRANSLATIONS_AR: Record<string, string> = {
  'Palmerie, Marrakech': 'النوخيل، مراكش',
  'Gueliz, Marrakech': 'جيليز، مراكش',
  'Rif Mountains, Chefchaouen': 'جبال الريف، شفشاون',
  'La Marina, Casablanca': 'المارينا، الدار البيضاء',
  'Marsham, Tanger': 'مارشان، طنجة',
  'Fes El Bali, Fes': 'فاس البالي، فاس',
  'Agadir': 'أكادير',
  'Al Hoceima': 'الحسيمة',
  'Asilah': 'أصيلة',
  'Azrou': 'أزرو',
  'Beni Mellal': 'بني ملال',
  'Berkane': 'بركان',
  'Bouznika': 'بوزنيقة',
  'Casablanca': 'الدار البيضاء',
  'Chefchaouen': 'شفشاون',
  'Dakhla': 'الداخلة',
  'El Jadida': 'الجديدة',
  'Errachidia': 'الرشيدية',
  'Essaouira': 'الصويرة',
  'Fes': 'فاس',
  'Ifrane': 'إفران',
  'Kenitra': 'القنيطرة',
  'Khenifra': 'خنيفرة',
  'Khouribga': 'خريبكة',
  'Ksar El Kebir': 'القصر الكبير',
  'Laayoune': 'العيون',
  'Larache': 'العرائش',
  'Marrakech': 'مراكش',
  'Meknes': 'مكناس',
  'Mohammedia': 'المحمدية',
  'Nador': 'الناظور',
  'Ouarzazate': 'ورزازات',
  'Oujda': 'وجدة',
  'Rabat': 'الرباط',
  'Safi': 'آسفي',
  'Salé': 'سلا',
  'Sidi Ifni': 'سيدي إفني',
  'Sidi Kacem': 'سيدي قاسم',
  'Sidi Slimane': 'سيدي سليمان',
  'Tanger': 'طنجة',
  'Tangier': 'طنجة',
  'Tantan': 'طنطان',
  'Taroudant': 'تارودانت',
  'Taza': 'تازة',
  'Tetouan': 'تطوان',
  'Tiznit': 'تزنيت'
};

// Map of standard amenities to French equivalents
export const AMENITY_TRANSLATIONS: Record<string, string> = {
  // Authentic Moroccan Amenities
  'Traditional Hammam': 'Hammam Traditionnel',
  'Central Courtyard Patio': 'Patio Central Arboré',
  'Zellige Tile Work': 'Revêtement en Zellige',
  'Rooftop Terrace': 'Terrasse Panoramique Sur Le Toit',
  'Swimming Pool': 'Piscine Privative',
  'Beldi Fireplace': 'Cheminée Beldi',
  'Sculpted Cedar Ceilings': 'Plafond en Bois de Cèdre Sculpté',
  'Atlas Mountain View': 'Vue Panoramique sur l\'Atlas',
  'Olive & Citrus Garden': 'Jardin d\'Oliviers & Agrumes',
  'Tadelakt Bathrooms': 'Salles de Bain en Tadelakt',
  'Traditional Salon (Bhou)': 'Salon Marocain Traditionnel (Bhou)',
  'Air Conditioning': 'Climatisation Réversible',
  'High-Speed Fiber Wifi': 'Fibre Optique Haut Débit',
  '24/7 Security & Concierge': 'Sécurité 24/7 & Conciergerie',
  'Private Garage & Parking': 'Garage Privé & Parking',
  'Solar Water Heater': 'Chauffe-eau Solaire',

  // Fallbacks for existing database listings
  'Pool': 'Piscine',
  'Gym': 'Salle de sport',
  'Smart Home': 'Maison intelligente',
  'Solar Grid': 'Réseau solaire',
  'Security System': 'Système de sécurité',
  'Wine Cellar': 'Cave à vin',
  'High Speed Wifi': 'Fibre haut débit',
  'Wooden Sauna': 'Sauna en bois',
  'Hot Tub': 'Bain à remous',
  'Fireplace': 'Cheminée Beldi',
  'Concierge Service': 'Service de conciergerie',
  'Rainwater Harvesting': 'Récupérateur d\'eau',
  'Minimalist Patio': 'Patio minimaliste',
  'Covered Parking': 'Parking couvert'
};

// Map of standard amenities to Arabic equivalents
export const AMENITY_TRANSLATIONS_AR: Record<string, string> = {
  'Traditional Hammam': 'حمام تقليدي',
  'Central Courtyard Patio': 'فناء وممر مشمس (باتيو)',
  'Zellige Tile Work': 'زليج تقليدي أصيل',
  'Rooftop Terrace': 'سطح بتراس بانورامي',
  'Swimming Pool': 'مسبح خاص',
  'Beldi Fireplace': 'مدفأة بلدي',
  'Sculpted Cedar Ceilings': 'سقف من خشب الأرز المنقوش',
  'Atlas Mountain View': 'إطلالة على جبال الأطلس',
  'Olive & Citrus Garden': 'حديقة زيتون وحوامض',
  'Tadelakt Bathrooms': 'حمامات بتدلاكت تقليدي',
  'Traditional Salon (Bhou)': 'صالون مغربي تقليدي ( البهو )',
  'Air Conditioning': 'مكيف هواء',
  'High-Speed Fiber Wifi': 'أنترنيت ألياف بصرية سريع',
  '24/7 Security & Concierge': 'حراسة واستقبال 24/7',
  'Private Garage & Parking': 'مرأب وموقف سيارات خاص',
  'Solar Water Heater': 'سخان ماء شمسي',

  // Fallbacks for legacy
  'Pool': 'مسبح',
  'Gym': 'قاعة رياضة',
  'Smart Home': 'منزل ذكي',
  'Solar Grid': 'طاقة شمسية',
  'Security System': 'نظام أمني',
  'Wine Cellar': 'قبو',
  'High Speed Wifi': 'أنترنيت سريع',
  'Wooden Sauna': 'ساونا خشبي',
  'Hot Tub': 'جاكوزي',
  'Fireplace': 'مدفأة بلدي',
  'Concierge Service': 'خدمة استقبال',
  'Rainwater Harvesting': 'تجميع مياه الأمطار',
  'Minimalist Patio': 'فناء هادئ',
  'Covered Parking': 'موقف مغطى'
};

export function t(key: keyof typeof DICTIONARY.en, lang: Language, interpolations?: Record<string, string | number>): string {
  const dict = DICTIONARY[lang] || DICTIONARY.en;
  let text = (dict[key] || DICTIONARY.en[key] || String(key)) as string;

  if (interpolations) {
    Object.entries(interpolations).forEach(([k, val]) => {
      text = text.replace(new RegExp(`{${k}}`, 'g'), String(val));
    });
  }
  return text;
}

export function translateListing(listing: Listing, lang: Language): Listing {
  if (lang === 'en') return listing;
  
  const translatedAmenities = listing.amenities.map(name => translateAmenity(name, lang));
  const translatedLocation = translateLocation(listing.location, lang);

  return {
    ...listing,
    location: translatedLocation,
    amenities: translatedAmenities
  };
}

export function translateLocation(location: string, lang: Language): string {
  if (lang === 'ar') return LOCATION_TRANSLATIONS_AR[location] || LOCATION_TRANSLATIONS[location] || location;
  if (lang === 'fr') return LOCATION_TRANSLATIONS[location] || location;
  return location;
}

export function translateAmenity(amenity: string, lang: Language): string {
  if (lang === 'ar') return AMENITY_TRANSLATIONS_AR[amenity] || AMENITY_TRANSLATIONS[amenity] || amenity;
  if (lang === 'fr') return AMENITY_TRANSLATIONS[amenity] || amenity;
  return amenity;
}
