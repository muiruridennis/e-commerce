import type { CollectionConfig } from 'payload/types'

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'brands',
      type: 'relationship',
      relationTo: 'brands',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

export default Categories
