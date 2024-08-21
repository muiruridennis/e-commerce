import type {  BeforeChangeHook } from 'payload/dist/collections/config/types';

export const updatePromotionStatusBasedOnDate: BeforeChangeHook = async ({ data }) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const now = new Date();

  if (now >= startDate && now <= endDate) {
    data.status = 'active';
  } else if (now > endDate) {
    data.status = 'expired';
  } else {
    data.status = 'inactive';
  }

  return data;
};
