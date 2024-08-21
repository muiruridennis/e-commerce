import { CollectionConfig } from 'payload/types';
import { admins } from '../../access/admins';
import { updatePromotionStatusBasedOnDate } from './hooks/updatePromotionStatusBasedOnDate';
import { updateProductsInPromotion } from './hooks/updateProductsInPromotion';



const Promotions: CollectionConfig = {
  slug: 'promotions',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: admins,
    update: admins,
    delete: admins,
  },
  hooks: {
    beforeChange: [updatePromotionStatusBasedOnDate],
    afterChange: [updateProductsInPromotion],

  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Expired', value: 'expired' },
      ],
      defaultValue: 'inactive',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
    },
    {
      name: 'bannerImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'promotionType',
      type: 'select',
      options: [
        {
          label: 'Discount',
          value: 'discount',
        },
        {
          label: 'Buy One Get One Free',
          value: 'bogo',
        },
        {
          label: 'Free Shipping',
          value: 'freeShipping',
        },
        {
          label: 'Limited Time Offer',
          value: 'limitedTime',
        },
        {
          label: 'Bundle Deal',
          value: 'bundleDeal',
        },
        {
          label: 'Flash Sale',
          value: 'flashSale',
        },
        {
          label: 'Seasonal Sale',
          value: 'seasonalSale',
        },
        {
          label: 'Clearance',
          value: 'clearance',
        },
      ],
      required: true,
    },
    {
      name: 'discount',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Percentage', value: 'percentage' },
            { label: 'Fixed Amount', value: 'fixedAmount' },
          ],
          required: true,
        },
        {
          name: 'value',
          type: 'number',
          required: true,
        },
      ],
      admin: {
        condition: (data) => data.promotionType === 'discount',
      },
    },
    {
      name: 'promotionCode',
      type: 'text',
      label: 'Promotion Code',
    },
    {
      name: 'usageLimit',
      type: 'number',
      label: 'Usage Limit',
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        condition: (data) => data.promotionType === 'bundleDeal',
      },
    },
    {
      name: 'details',
      type: 'textarea',
    },
  ],
};

export default Promotions;
