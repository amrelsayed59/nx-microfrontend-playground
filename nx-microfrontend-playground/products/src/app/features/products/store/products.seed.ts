import type { Product } from '@org/shared-models';

/**
 * Seed catalog used to initialise the products slice. In production this is
 * replaced by data fetched from the catalog API (see the README "connecting
 * to a real API" notes).
 */
export const PRODUCTS_SEED: Product[] = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    description: 'M4 Pro chip, 24GB unified memory, 512GB SSD.',
    price: 2499,
  },
  {
    id: 2,
    name: 'iPhone 17 Pro',
    description: '6.3" display, A19 Pro, titanium frame.',
    price: 1199,
  },
  {
    id: 3,
    name: 'AirPods Pro 3',
    description: 'Active noise cancellation with adaptive audio.',
    price: 249,
  },
  {
    id: 4,
    name: 'iPad Pro 13"',
    description: 'M4 chip, Ultra Retina XDR display, 256GB.',
    price: 1299,
  },
  {
    id: 5,
    name: 'Apple Watch Ultra 3',
    description: 'Rugged titanium case, precision dual-band GPS.',
    price: 799,
  },
];
