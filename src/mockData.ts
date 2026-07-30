import { User, Listing } from './types';

export const DEMO_OWNER: User = {
  id: 'owner-lucas',
  name: 'Lucas Vance',
  email: 'lucas.vance@example.com',
  phone: '+1 (555) 728-1920',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
  role: 'owner'
};

export const DEMO_ADMIN: User = {
  id: 'admin-marcus',
  name: 'Marcus Sterling (Official Broker)',
  email: 'marcus.sterling@primeestates.com',
  phone: '+1 (555) 900-2026',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
  role: 'admin'
};

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'prop-1',
    title: 'The Monolithic Glass Pavilion',
    description: 'This architectural masterpiece blends absolute raw concrete core pillars with dramatic floor-to-ceiling tempered glass partitions. Features wide-plank oiled white oak floors, high-fidelity hidden acoustic panels, and custom hand-cast copper bathroom fixtures. Positioned perfectly on a private hillside to maximize Marrakech desert sunset vistas.',
    type: 'buy',
    price: 1850000,
    location: 'Palmerie, Marrakech',
    bedrooms: 3,
    bathrooms: 3.5,
    squareMeters: 620,
    amenities: ['Pool', 'Gym', 'Smart Home', 'Solar Grid', 'Security System', 'Wine Cellar'],
    status: 'approved',
    ownerId: 'owner-lucas',
    approvedByAdminId: 'admin-marcus',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&h=500&q=80',
    personalOwnerInfo: {
      name: 'Lucas Vance',
      email: 'lucas.vance@example.com',
      phone: '+1 (555) 728-1920'
    },
    createdAt: '2026-06-15T12:00:00Z'
  },
  {
    id: 'prop-2',
    title: 'Minimalist Brutalist Loft',
    description: 'A striking industrial design boasting triple-height ceilings and raw steel beams. Nestled in the heart of the creative Gueliz sector. The unit spans two open levels joined by a floating metal staircase, presenting a perfect blend of commercial grid architecture and ultra-premium residential comfort.',
    type: 'rent',
    price: 3400,
    location: 'Gueliz, Marrakech',
    bedrooms: 1,
    bathrooms: 1.5,
    squareMeters: 145,
    amenities: ['Gym', 'High Speed Wifi', 'Minimalist Patio', 'Smart Home', 'Covered Parking'],
    status: 'approved',
    ownerId: 'owner-lucas',
    approvedByAdminId: 'admin-marcus',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&h=500&q=80',
    personalOwnerInfo: {
      name: 'Lucas Vance',
      email: 'lucas.vance@example.com',
      phone: '+1 (555) 728-1920'
    },
    createdAt: '2026-06-16T14:30:00Z'
  },
  {
    id: 'prop-3',
    title: 'Scandinavian Forest Sanctuary',
    description: 'Constructed from locally sourced Atlas timbers, this mountain oasis features pristine organic acoustics, a massive stone wood-burning hearth, and panoramic view-guards overlooking the valleys. Features premium radiant under-floor heating and a private spring-fed cedar plunge pool.',
    type: 'buy',
    price: 940000,
    location: 'Rif Mountains, Chefchaouen',
    bedrooms: 4,
    bathrooms: 3,
    squareMeters: 380,
    amenities: ['Wooden Sauna', 'Hot Tub', 'Fireplace', 'Solar Grid', 'High Speed Wifi'],
    status: 'approved',
    ownerId: 'owner-lucas',
    approvedByAdminId: 'admin-marcus',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&h=500&q=80',
    personalOwnerInfo: {
      name: 'Lucas Vance',
      email: 'lucas.vance@example.com',
      phone: '+1 (555) 728-1920'
    },
    createdAt: '2026-06-17T09:15:00Z'
  },
  {
    id: 'prop-4',
    title: 'Aura Waterfront Penthouse',
    description: 'Hovering on the 42nd story of the iconic Marina Tower, this hyper-modern residence features dual private elevators, an engineered micro-water filtration structure, and custom terrazzo tiling. Expansive floor-to-ceiling windows deliver a fully unobstructed ocean view of the Casablanca coastline.',
    type: 'rent',
    price: 5900,
    location: 'La Marina, Casablanca',
    bedrooms: 2,
    bathrooms: 2,
    squareMeters: 220,
    amenities: ['Pool', 'Gym', 'Concierge Service', 'Smart Home', 'High Speed Wifi', 'Wine Cellar'],
    status: 'approved',
    ownerId: 'admin-marcus', // Listed directly by admin
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&h=500&q=80',
    personalOwnerInfo: {
      name: 'Marcus Sterling',
      email: 'marcus.sterling@primeestates.com',
      phone: '+1 (555) 900-2026'
    },
    createdAt: '2026-06-18T10:00:00Z'
  },
  {
    id: 'prop-5',
    title: 'The Eco-Bento Courtyard Home',
    description: 'A certified net-zero passive home centering around an inner bamboo tranquil garden. Crafted entirely with non-toxic earth clays, structural timber framework, and automated dynamic shading curtains. Includes dual level-2 EV superchargers and full grid battery backup vaults.',
    type: 'buy',
    price: 1120000,
    location: 'Marsham, Tanger',
    bedrooms: 3,
    bathrooms: 2.5,
    squareMeters: 295,
    amenities: ['Solar Grid', 'Smart Home', 'Rainwater Harvesting', 'Fireplace', 'Security System'],
    status: 'approved',
    ownerId: 'owner-lucas',
    approvedByAdminId: 'admin-marcus',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&h=500&q=80',
    personalOwnerInfo: {
      name: 'Lucas Vance',
      email: 'lucas.vance@example.com',
      phone: '+1 (555) 728-1920'
    },
    createdAt: '2026-06-19T11:20:00Z'
  },
  {
    id: 'prop-6',
    title: 'Raw Concrete Studio Nest',
    description: 'An eye-safe, incredibly styled brutalist shelter featuring modular oak dividers and sandblasted dark slab walls. Perfect for high-focused creators looking for a streamlined urban workspace integrated with full home kitchen utilities and concealed smart closets.',
    type: 'rent',
    price: 1950,
    location: 'Fes El Bali, Fes',
    bedrooms: 1,
    bathrooms: 1,
    squareMeters: 85,
    amenities: ['Smart Home', 'High Speed Wifi', 'Gym'],
    status: 'approved',
    ownerId: 'owner-lucas',
    approvedByAdminId: 'admin-marcus',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&h=500&q=80',
    personalOwnerInfo: {
      name: 'Lucas Vance',
      email: 'lucas.vance@example.com',
      phone: '+1 (555) 728-1920'
    },
    createdAt: '2026-06-20T16:45:00Z'
  }
];

export const ALL_AMENITIES = [
  'Pool',
  'Gym',
  'Smart Home',
  'Solar Grid',
  'Security System',
  'Wine Cellar',
  'High Speed Wifi',
  'Wooden Sauna',
  'Hot Tub',
  'Fireplace',
  'Concierge Service',
  'Rainwater Harvesting',
  'Minimalist Patio',
  'Covered Parking'
];

export const ALL_LOCATIONS = [
  'Palmerie, Marrakech',
  'Gueliz, Marrakech',
  'Rif Mountains, Chefchaouen',
  'La Marina, Casablanca',
  'Marsham, Tanger',
  'Fes El Bali, Fes'
];
