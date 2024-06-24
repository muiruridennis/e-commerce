"use client"

import React, { Fragment, useState, useEffect } from 'react';

import { Category, Product, Inventory } from '../../../payload/payload-types';
import { AddToCartButton } from '../../_components/AddToCartButton';
import { Gutter } from '../../_components/Gutter';
import { Media } from '../../_components/Media';
import { Price } from '../../_components/Price';
import { useAuth } from '../../_providers/Auth';

import classes from './index.module.scss';
import { AddToWishlistButton } from '../../_components/AddToWishlistButton';

const isInventory = (inventory: string | Inventory): inventory is Inventory => {
  return (inventory as Inventory).stockStatus !== undefined;
};

export const ProductHero: React.FC<{ product: Product }> = ({ product }) => {
  const { user } = useAuth();

  const { title, categories, meta: { image: metaImage, description } = {}, inventory } = product;
  const [stockStatus, setStockStatus] = useState<'inStock' | 'lowStock' | 'outOfStock' | null>(null);
  const [email, setEmail] = useState<string>('');
  const [notificationSent, setNotificationSent] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkIfEmailAndProductExists = async (email: string, productId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/back-in-stock-notifications?email=${email}&product=${productId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const { docs } = await response.json();
      return docs.length > 0;
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      return false;
    }
  };

  const handleNotifyMe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const exists = await checkIfEmailAndProductExists(email, product.id);
      if (exists) {
        setError('You have already requested a notification for this product.');
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/back-in-stock-notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, product: product.id }),
        });

        if (response.ok) {
          setNotificationSent(true);
        } else {
          const errorData = await response.json();
          setError(errorData.error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (inventory) {
      if (isInventory(inventory)) {
        setStockStatus(inventory.stockStatus);
      }
    }
    if (user) {
      setEmail(user.email);
    }
  }, [inventory, user]);

  return (
    <Gutter className={classes.productHero}>
      <div className={classes.mediaWrapper}>
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media imgClassName={classes.image} resource={metaImage} fill />
        )}
      </div>

      <div className={classes.details}>
        <h3 className={classes.title}>{title}</h3>

        <div className={classes.categoryWrapper}>
          <div className={classes.categories}>
            {categories?.map((category, index) => {
              const { title: categoryTitle } = category as Category;

              const titleToUse = categoryTitle || 'Generic';
              const isLast = index === categories.length - 1;

              return (
                <p key={index} className={classes.category}>
                  {titleToUse} {!isLast && <Fragment>, &nbsp;</Fragment>}
                  <span className={classes.separator}>|</span>
                </p>
              );
            })}
          </div>
          {stockStatus && (
            <p className={classes.stock}>
              {stockStatus === 'inStock' ? 'In Stock' : stockStatus === 'lowStock' ? 'Low Stock' : 'Out of Stock'}
            </p>
          )}
        </div>

        <Price product={product} button={false} />

        <div className={classes.description}>
          <h6>Description</h6>
          <p>{description}</p>
        </div>
        <div className={classes.actionbuttons}>
          <AddToCartButton product={product} className={classes.addToCartButton} stockStatus={stockStatus} />
          <AddToWishlistButton product={product} className={classes.addToWishlistButton} />
        </div>
        {stockStatus === 'outOfStock' && (
          <div className={classes.notificationWrapper}>
            {!notificationSent ? (
              <form onSubmit={handleNotifyMe}>
                <p className={classes.outOfStockMessage}>
                  We're sorry, this product is currently unavailable.
                  In the meantime, you can browse similar products:
                  We'll send you an email notification as soon as this product is back in stock.
                </p>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder='Please enter your email address'
                />
                <button type="submit" disabled={isSubmitting || notificationSent}>
                  {isSubmitting ? 'Submitting...' : 'Notify Me'}
                </button>
                {error && <p className={classes.error}>{error}</p>}
              </form>
            ) : (
              <p className={classes.successMessage}>Thank you! You will be notified when the product is back in stock.</p>
            )}
          </div>
        )}
      </div>
    </Gutter>
  );
};
