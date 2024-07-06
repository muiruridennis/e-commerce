'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '../../../payload/payload-types';
import classes from './index.module.scss';

type PriceProps = {
  product: Product;
  quantity?: number;
  button?: 'addToCart' | 'removeFromCart' | false;
};

export const Price: React.FC<PriceProps> = ({ product, quantity = 1, button = 'addToCart' }) => {
  const { price } = product;
  const [formattedPrice, setFormattedPrice] = useState<string>('');

  useEffect(() => {
    const calculatePrice = () => {
      const newFormattedPrice = (price * quantity).toLocaleString('en-US', {
        style: 'currency',
        currency: 'KSH', // Replace with the appropriate currency if needed
      });
      setFormattedPrice(newFormattedPrice);
    };

    calculatePrice();
  }, [price, quantity]);

  return (
    <div className={classes.actions}>
      <div className={classes.price}>
        <p>{formattedPrice}</p>
      </div>
    </div>
  );
};

