import React from 'react'
import Image from 'next/image'

import { Product } from '../../../payload/payload-types'
import { useWishlist } from '../../_providers/Wishlist'

import classes from './index.module.scss'

export const RemoveFromWishButton: React.FC<{
  className?: string
  product: Product
}> = props => {
  const { className, product } = props

  const { deleteItemFromWishlist, isProductInWishlist } = useWishlist()

  const productIsInwishlist = isProductInWishlist(product)

  if (!productIsInwishlist) {
    return <div>Item is not in the wishlist</div>
  }

  return (
    <button
      type="button"
      onClick={() => {
        deleteItemFromWishlist(product)
      }}
      className={[className, classes.removeFromCartButton].filter(Boolean).join(' ')}
    >
      <Image
        src="/assets/icons/delete.svg"
        alt="delete"
        width={24}
        height={24}
        className={classes.qtnBt}
      />
    </button>
  )
}