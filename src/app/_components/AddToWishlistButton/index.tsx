// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Product } from '../../../payload/payload-types'
// import { useWishlist } from '../../_providers/Wishlist'
// import { Button, Props } from '../Button'
// import classes from './index.module.scss'

// export const AddToWishlistButton: React.FC<{
//   product: Product
//   className?: string
//   appearance?: Props['appearance']
// }> = props => {
//   const { product, className, appearance = 'secondary' } = props
//   const { wishlist, addItemToWishlist, isProductInWishlist, hasInitializedWishlist } = useWishlist()
//   const [isInWishlist, setIsInWishlist] = useState<boolean>()
//   const router = useRouter()

//   useEffect(() => {
//     setIsInWishlist(isProductInWishlist(product))
//   }, [isProductInWishlist, product, wishlist])

//   return (
//     <Button
//       href={isInWishlist ? '/account/wishlists' : undefined}
//       type={!isInWishlist ? 'button' : undefined}
//       className={`${classes.addToWishlistButton} ${className}`}
//       label={isInWishlist ? 'View Wishlist' : 'Add to Wishlist'}
//       appearance={appearance}
//       onClick={() => {
//         if (!isInWishlist) {
//           addItemToWishlist({ product })
//         }
//         else router.push('/account/wishlists')
//       }}
//     />
      
//   )
// }
'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '../../../payload/payload-types'
import { useWishlist } from '../../_providers/Wishlist'
import { Button, Props } from '../Button'
import classes from './index.module.scss'

export const AddToWishlistButton: React.FC<{
  product: Product
  className?: string
  appearance?: Props['appearance']
}> = ({ product, className = '', appearance = 'pink' }) => {
  const { wishlist, addItemToWishlist, isProductInWishlist, hasInitializedWishlist } = useWishlist()
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false)
  const router = useRouter()

  const checkIsInWishlist = useCallback(() => {
    setIsInWishlist(isProductInWishlist(product))
  }, [isProductInWishlist, product])

  useEffect(() => {
    if (hasInitializedWishlist) {
      checkIsInWishlist()
    }
  }, [hasInitializedWishlist, wishlist, checkIsInWishlist])

  const handleClick = () => {
    if (!isInWishlist) {
      addItemToWishlist({ product })
    } else {
      router.push('/account/wishlist')
    }
  }

  return (
    <Button
      href={isInWishlist ? '/account/wishlist' : undefined}
      type={!isInWishlist ? 'button' : undefined}
      className={`${classes.addToWishlistButton} ${className}`}
      label={isInWishlist ? 'View Wishlist' : 'Add to Wishlist'}
      appearance={appearance}
      onClick={handleClick}
    />
  )
}
