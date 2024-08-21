'use client'
import React from 'react';
import Image from 'next/image';
import classes from './index.module.scss';


const PromotionBanner = ({promotion}) => {

  return (
    <div className={classes.bannerContainer}>
      <Image
        src={promotion.bannerImage.url }
        alt="Promotion banner"
        height={400}
        width={500}      
      />
    </div>
  );
};

export default PromotionBanner;
