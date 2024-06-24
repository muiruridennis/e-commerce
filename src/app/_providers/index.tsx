'use client';

import React from 'react';

import { AuthProvider } from '../_providers/Auth';
import { CartProvider } from '../_providers/Cart';
import { WishlistProvider } from '../_providers/Wishlist'; 
import { ThemeProvider } from './Theme';
import { FilterProvider } from './Filter';

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FilterProvider>
          <CartProvider>
            <WishlistProvider> 
              {children}
            </WishlistProvider>
          </CartProvider>
        </FilterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
