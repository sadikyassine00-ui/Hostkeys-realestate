import { User, Listing, AdvisoryAgent } from './types';

// The one and only super admin email — hardcoded for security
export const SUPER_ADMIN_EMAIL = 'yassinesadik0@gmail.com';

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

// 3 Assigned Hostkeys Advisory Agents (Admins & Super Admins)
export const HOSTKEYS_AGENTS: AdvisoryAgent[] = [
  {
    id: 'agent-yassine',
    firstName: 'Yassine',
    fullName: 'Yassine Sadik',
    title: 'Super Admin & Managing Director',
    email: 'yassinesadik0@gmail.com',
    phone: '+212 661-987654',
    languages: ['FR', 'EN', 'AR'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    role: 'superadmin'
  },
  {
    id: 'agent-sarah',
    firstName: 'Sarah',
    fullName: 'Sarah Benali',
    title: 'Senior Property Advisor',
    email: 'sarah.benali@hostkeys.ma',
    phone: '+212 522-443322',
    languages: ['FR', 'EN', 'ES'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    role: 'admin'
  },
  {
    id: 'agent-karim',
    firstName: 'Karim',
    fullName: 'Karim El Amrani',
    title: 'Valuation & Legal Partner',
    email: 'karim.elamrani@hostkeys.ma',
    phone: '+212 662-110099',
    languages: ['FR', 'AR', 'EN'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    role: 'admin'
  }
];

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
