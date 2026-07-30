import { User, Listing } from './types';

export const DEMO_OWNER: User = {
  id: 'owner-lucas',
  name: 'Property Owner',
  email: 'owner@example.com',
  phone: '+212 600 000000',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
  role: 'owner'
};

export const DEMO_ADMIN: User = {
  id: 'admin-hostkeys',
  name: 'Hostkeys Admin',
  email: 'admin@hostkeys.ma',
  phone: '+212 522 000000',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
  role: 'admin'
};

export const ALL_LOCATIONS = [
  'Palmerie, Marrakech',
  'Gueliz, Marrakech',
  'Rif Mountains, Chefchaouen',
  'La Marina, Casablanca',
  'Marsham, Tanger',
  'Fes El Bali, Fes'
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

// Start clean without demo listings so real users can sign in and add their own properties!
export const INITIAL_LISTINGS: Listing[] = [];
