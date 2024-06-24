'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Product } from '../../../payload/payload-types'
import { useCart } from '../../_providers/Cart'
import { Button, Props } from '../Button'

import classes from './index.module.scss'

export const AddToCartButton: React.FC<{
  product: Product
  quantity?: number
  className?: string
  appearance?: Props['appearance']
  stockStatus?: 'inStock' | 'lowStock' | 'outOfStock' | null
}> = props => {
  const { product, quantity = 1, className, appearance = 'primary', stockStatus } = props

  const { cart, addItemToCart, isProductInCart, hasInitializedCart } = useCart()

  const [isInCart, setIsInCart] = useState<boolean>()
  const router = useRouter()

  useEffect(() => {
    setIsInCart(isProductInCart(product))
  }, [isProductInCart, product, cart])

  return (
    <Button
      href={isInCart ? '/cart' : undefined}
      type={!isInCart ? 'button' : undefined}
      label={
        stockStatus === 'outOfStock'
          ? 'Sold Out'
          : isInCart
            ? `✓ View in cart`
            : `Add to cart`
      }
      el={isInCart ? 'link' : undefined}
      appearance={appearance}
      disabled={ stockStatus === 'outOfStock'}
      className={[
        className,
        classes.addToCartButton,
        ( stockStatus === 'outOfStock') ? classes.disabled : "",
        appearance === 'default' && isInCart && classes.green,
        !hasInitializedCart && classes.hidden,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={
        !isInCart && stockStatus !== 'outOfStock'
          ? () => {
            addItemToCart({
              product,
              quantity,
            })

            router.push('/cart')
          }
          : undefined
      }
    />
  )
}
