'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '../../../payload/payload-types';
import classes from './index.module.scss';

type PriceProps = {
  product: Product;
  quantity?: number;
  button?: 'addToCart' | 'removeFromCart' | false;
  price?: number; 
  discountedPrice?: number; 
};

export const Price: React.FC<PriceProps> = ({ product, quantity = 1, button = 'addToCart', price , discountedPrice}) => {

  const productPrice = discountedPrice !== undefined ? discountedPrice : (price !== undefined ? price : product.price); 
  const [formattedPrice, setFormattedPrice] = useState<string>('');

  useEffect(() => {
    const calculatePrice = () => {
      const newFormattedPrice = (productPrice * quantity).toLocaleString('en-US', {
        style: 'currency',
        currency: 'KSH', // Replace with the appropriate currency if needed
      });
      setFormattedPrice(newFormattedPrice);
    };

    calculatePrice();
  }, [productPrice, quantity]);

  return (
    <div className={classes.actions}>
      <div className={classes.price}>
        <p>{formattedPrice}</p>
      </div>
    </div>
  );
};

