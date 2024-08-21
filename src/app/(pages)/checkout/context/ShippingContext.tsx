// import React, { createContext, useContext, useState, ReactNode } from 'react';

// type ShippingInfo = {
//   deliveryOrPickup: 'delivery' | 'pickup';
//   city: string;
//   county: string;
//   phoneNumber: string;
// };

// type ShippingErrors = {
//   county?: string;
//   city?: string;
//   phoneNumber?: string;
// };

// type ShippingContextType = {
//   shippingInfo: ShippingInfo;
//   setShippingInfo: React.Dispatch<React.SetStateAction<ShippingInfo>>;
//   shippingErrors: Partial<ShippingErrors>;
//   validateShippingInfo: () => boolean;
// };

// const defaultShippingContextValue: ShippingContextType = {
//   shippingInfo: {
//     deliveryOrPickup: 'delivery',
//     county: '',
//     city: '',
//     phoneNumber: '',
//   },
//   setShippingInfo: () => {},
//   shippingErrors: {},
//   validateShippingInfo: () => true,
// };

// const ShippingContext = createContext<ShippingContextType>(defaultShippingContextValue);

// type ShippingProviderProps = {
//   children: ReactNode;
// };

// export const ShippingProvider: React.FC<ShippingProviderProps> = ({ children }) => {
//   const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
//     deliveryOrPickup: 'delivery',
//     city: '',
//     county: '',
//     phoneNumber: '',
//   });
//   const [shippingErrors, setShippingErrors] = useState<Partial<ShippingErrors>>({});

//   const validateShippingInfo = (): boolean => {
//     const newErrors: Partial<ShippingErrors> = {};

//     if (shippingInfo.deliveryOrPickup === 'delivery' && !shippingInfo.county) {
//       newErrors.county = 'County is required for delivery.';
//     }
//     if (shippingInfo.deliveryOrPickup === 'delivery' && !shippingInfo.city) {
//       newErrors.city = 'City is required for delivery.';
//     }
//     if (!shippingInfo.phoneNumber) {
//       newErrors.phoneNumber = 'Phone number is required.';
//     }

//     setShippingErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   return (
//     <ShippingContext.Provider
//       value={{ shippingInfo, setShippingInfo, shippingErrors, validateShippingInfo }}
//     >
//       {children}
//     </ShippingContext.Provider>
//   );
// };

// export const useShipping = () => useContext(ShippingContext);
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ShippingInfo = {
  deliveryOrPickup: 'delivery' | 'pickup';
  city: string;
  county: string;
  phoneNumber: string;
};

type ShippingErrors = {
  county?: string;
  city?: string;
  phoneNumber?: string;
};

type ShippingContextType = {
  shippingInfo: ShippingInfo;
  setShippingInfo: React.Dispatch<React.SetStateAction<ShippingInfo>>;
  shippingErrors: Partial<ShippingErrors>;
  validateShippingInfo: () => boolean;
  clearError: (field: keyof ShippingErrors) => void; // New function
};

const defaultShippingContextValue: ShippingContextType = {
  shippingInfo: {
    deliveryOrPickup: 'delivery',
    county: '',
    city: '',
    phoneNumber: '',
  },
  setShippingInfo: () => {},
  shippingErrors: {},
  validateShippingInfo: () => true,
  clearError: () => {},
};

const ShippingContext = createContext<ShippingContextType>(defaultShippingContextValue);

type ShippingProviderProps = {
  children: ReactNode;
};

export const ShippingProvider: React.FC<ShippingProviderProps> = ({ children }) => {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    deliveryOrPickup: 'delivery',
    city: '',
    county: '',
    phoneNumber: '',
  });
  const [shippingErrors, setShippingErrors] = useState<Partial<ShippingErrors>>({});

  const validateShippingInfo = (): boolean => {
    const newErrors: Partial<ShippingErrors> = {};

    // Validate fields
    if (shippingInfo.deliveryOrPickup === 'delivery' && !shippingInfo.county) {
      newErrors.county = 'County is required for delivery.';
    }
    if (shippingInfo.deliveryOrPickup === 'delivery' && !shippingInfo.city) {
      newErrors.city = 'City is required for delivery.';
    }
    if (!shippingInfo.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required.';
    }

    setShippingErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear error for a specific field
  const clearError = (field: keyof ShippingErrors) => {
    setShippingErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));
  };

  return (
    <ShippingContext.Provider
      value={{ shippingInfo, setShippingInfo, shippingErrors, validateShippingInfo, clearError }}
    >
      {children}
    </ShippingContext.Provider>
  );
};

export const useShipping = () => useContext(ShippingContext);
