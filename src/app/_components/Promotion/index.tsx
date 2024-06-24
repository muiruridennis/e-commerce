'use client'
import React, { useState } from 'react';
import classes from './index.module.scss';
import Timer from './timer';
import ProductSlider from './productSlider';

const Promotion = () => {
  const [isExpired, setIsExpired] = useState<Boolean>(false);

  return (
    <div className={classes.mainContainer} >
      <section className={classes.promotion}>
        <div className={classes.textBox}>
          <h3 className={classes.title}>Deals of the Month</h3>
          <p>
            Get ready for a shopping experience like never before with our Deals of the Month! Every
            purchase comes with exclusive perks and offers, making this month a celebration of savvy
            choices and amazing deals. Don't miss out! 🎁🛒
          </p>
          <Timer setIsExpired={setIsExpired} />
        </div>
      </section>
      <ProductSlider isExpired={isExpired} />

    </div>
  );
};

export default Promotion;
