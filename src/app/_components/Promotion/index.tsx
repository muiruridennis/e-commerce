'use client'
import React, { useState, useEffect } from 'react';
import classes from './index.module.scss';
import Timer from './timer/timer';
import { Promotion } from '../../../payload/payload-types';
import { fetchDocs } from '../../_api/fetchDocs'
import Link from 'next/link';
import Image from 'next/image';
import PromotionBanner from '../Price/banner';

const PromotionComp = () => {
  const [isExpired, setIsExpired] = useState<Boolean>(false);
  const [promotion, setPromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    // Define an async function inside the useEffect hook
    const loadPromotions = async () => {
      try {
        const promotions: Promotion[] = await fetchDocs<Promotion>('promotions');
        if (promotions && promotions.length > 0) {
          // Assuming there's only one active promotion, get the first one
          const activePromotion = promotions[0];
          setPromotion(activePromotion);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadPromotions();
  }, []);
  if (!promotion) {
    return <div>No active promotions available.</div>;
  }
  return (
    <div className={classes.mainContainer}>
      <section className={classes.promotion}>
        <div className={classes.textBox}>
          <h5 className={classes.title}>{promotion.title}</h5>
          <p>
            {promotion.details || "Check out our amazing promotion!"}
          </p>
          <Timer endDate={promotion.endDate} startDate={promotion.startDate} setIsExpired={setIsExpired} />
          <Link href="/">
            <button className={classes.viewProductsButton}>
              View Products
              <Image
                src="/assets/icons/arrow-forward.svg"
                alt="logo"
                width={25}
                height={23}
                className={classes.logo}
              />
            </button>
          </Link>
        </div>
      </section>
      {isExpired ? (
        <div className={classes.expiredMessage}>
          <p>Sorry, the promotion has ended.</p>
          <p>Don't worry! We have more amazing deals. Check out our
            <Link href="/products" className={classes.promotionsLink}> products page</Link>!
          </p>

        </div>
      ) : (
        <PromotionBanner promotion={promotion} />
      )}
    </div>
  );
};

export default PromotionComp;
