'use client'
import React from "react";
import Slider from "react-slick";
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import classes from './index.module.scss';
import { AddToCartButton } from "../AddToCartButton";
import { AddToWishlistButton } from "../AddToWishlistButton";

type Product = {
  id: string
  title: string;
  url: string;
  description: string;
  offerPercentage: number;
  price: number;
  updatedAt:string,
  createdAt: string

}[];

const ProductSlider = (props) => {
  const {isExpired} = props;

  const products: Product = [
    {
      id:"ytytyyty",
      title: 'Apple Watch Series',
      url: "/assets/products/AppleWatchSeries.jpg",
      description: "Stay connected and healthy with the latest Apple Watch Series.",
      price: 399,
      offerPercentage: 20,
      updatedAt: " upcoming",
      createdAt: " January"
    },
    {
      id:"ytyyty",
      title: 'Apple Watch Series 7',
      url: "/assets/products/AppleWatchSeries7.jpg",
      description: "Immerse yourself in your gameplay with a curved gaming monitor for a wider viewing experience.",
      price: 499,
      offerPercentage: 15,
      updatedAt: " upcoming",
      createdAt: " January"
    },
    {
      id:"ert455544 ",
      title: 'Xbox Series',
      url: "/assets/products/Xbox.jpg",
      description: "Keep your devices powered with this AC adapter.",
      price: 299,
      offerPercentage: 10,
      updatedAt: " upcoming",
      createdAt: " January"
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    pauseOnHover: true,
    autoplaySpeed: 8000,
    centerMode: false,
    variableWidth: false,
  };

  if (isExpired) {
    return (
      <div className={classes.expiredMessage}>
        <p  >Sorry, the deal has ended.</p>
      </div>

    )
  }
  return (
    <div className={classes.carousel}>
      <h3>Hot Deals Of Month</h3>
      <Slider {...sliderSettings}>
        {products.map((product ) => {
          const discountedPrice = product.price * (1 - product.offerPercentage / 100);
          return (
            <div key={product.title} className={classes.product}>
              <div className={classes.productContent}>
                <Image src={product.url} alt={product.title} width={300} height={250} className={classes.productImage} />
                <div className={classes.productDetails}>
                  <h4>{product.title}</h4>
                  <p>{product.description}</p>
                  <p className={classes.price}>${product.price.toFixed(2)}</p>
                  <p className={classes.discountedPrice}>${discountedPrice.toFixed(2)}</p>
                  <p className={classes.offer}>{product.offerPercentage}% off</p>
                  <div className={classes.actionButton}>
                    <AddToCartButton product={product} />
                    <AddToWishlistButton product={product} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

export default ProductSlider;
