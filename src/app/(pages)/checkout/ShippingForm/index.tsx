
import React, { useState, useEffect } from 'react';
import { useCart } from '../../../_providers/Cart';

import { useShipping } from '../context/ShippingContext';
import classes from "./index.module.scss";


const ShippingForm: React.FC<{ user: any }> = ({ user }) => {
  const { setDeliveryLocation, deliveryLocation, deliveryOption, setDeliveryOption } = useCart();

  const { shippingInfo, setShippingInfo, shippingErrors, clearError } = useShipping();
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    setPhoneNumber(user?.phoneNumber || '');
  }, [user]);



  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    clearError('phoneNumber');
  };
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, city: e.target.value })
    clearError('city');
  };
  const handleCountyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryLocation(e.target.value)    
    clearError('county');
  };
  useEffect(() => {
    setShippingInfo({
      ...shippingInfo,
      county: deliveryLocation,
      deliveryOrPickup: deliveryOption,
      phoneNumber
    });
  }, [deliveryLocation, deliveryOption, phoneNumber]);

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Shipping Information</h2>

      <fieldset className={classes.option}>
        <legend className={classes.fieldsetLegend}>Delivery or Pickup</legend>
        <label className={classes.label}>
          <input
            type="radio"
            value="delivery"
            checked={shippingInfo.deliveryOrPickup === 'delivery'}
            onChange={(e) => setDeliveryOption(e.target.value as 'delivery' | 'pickup')}
          />
          Delivery
        </label>
        <label className={classes.label}>
          <input
            type="radio"
            value="pickup"
            checked={shippingInfo.deliveryOrPickup === 'pickup'}
            onChange={(e) => setDeliveryOption(e.target.value as 'delivery' | 'pickup')}
          />
          Pickup
        </label>
      </fieldset>

      {shippingInfo.deliveryOrPickup === 'delivery' && (
        <fieldset className={classes.fieldset}>
          <legend className={classes.fieldsetLegend}>Shipping Address</legend>
          <label className={classes.label}>County:</label>
          <input
            type="text"
            className={classes.inputText}
            value={shippingInfo.county}
            onChange={handleCountyChange}
            required
          />
          {shippingErrors.county && <span className={classes.error}>{shippingErrors.county}</span>}

          <label className={classes.label}>City:</label>
          <input
            type="text"
            className={classes.inputText}
            value={shippingInfo.city}
            onChange={handleCityChange}
            required
          />
          {shippingErrors.city && <span className={classes.error}>{shippingErrors.city}</span>}
        </fieldset>
      )}

      <fieldset className={classes.fieldset}>
        <legend className={classes.fieldsetLegend}>Contact Information</legend>
        <label className={classes.label}>Phone Number:</label>
        <input
          type="text"
          className={classes.inputText}
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          required
        />
        {shippingErrors.phoneNumber && <span className={classes.error}>{shippingErrors.phoneNumber}</span>}
      </fieldset>
    </div>
  );
};

export default ShippingForm;
