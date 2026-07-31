import { User, Listing } from './types';

// The one and only super admin email — hardcoded for security
export const SUPER_ADMIN_EMAIL = 'yassinesadik0@gmail.com';

export const DEFAULT_SUPER_ADMIN: User = {
  id: 'superadmin-yassine',
  name: 'Yassine Sadik',
  email: 'yassinesadik0@gmail.com',
  phone: '+212 661-987654',
  avatar: '',
  role: 'superadmin'
};

export const ALL_CITIES = [
  'Agadir',
  'Al Hoceima',
  'Asilah',
  'Azrou',
  'Beni Mellal',
  'Berkane',
  'Bouznika',
  'Casablanca',
  'Chefchaouen',
  'Dakhla',
  'El Jadida',
  'Errachidia',
  'Essaouira',
  'Fes',
  'Ifrane',
  'Kenitra',
  'Khenifra',
  'Khouribga',
  'Ksar El Kebir',
  'Laayoune',
  'Larache',
  'Marrakech',
  'Meknes',
  'Mohammedia',
  'Nador',
  'Ouarzazate',
  'Oujda',
  'Rabat',
  'Safi',
  'Salé',
  'Sidi Ifni',
  'Sidi Kacem',
  'Sidi Slimane',
  'Tanger',
  'Tantan',
  'Taroudant',
  'Taza',
  'Tetouan',
  'Tiznit'
];

export const ALL_LOCATIONS = ALL_CITIES;

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

export const INITIAL_LISTINGS: Listing[] = [];
