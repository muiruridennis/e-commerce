'use client'
import React from 'react'
import Link from 'next/link'
import { Media } from '../../../../_components/Media'
import { Price } from '../../../../_components/Price'
import classes from './index.module.scss'
import { AddToCartButton } from '../../../../_components/AddToCartButton'
import { RemoveFromWishButton } from '../../../../_components/RemoveFromWishButton'
import { useWishlist } from '../../../../_providers/Wishlist'
import { LoadingShimmer } from '../../../../_components/LoadingShimmer'

export default function WishlistItems() {
  const { wishlist, hasInitializedWishlist, wishlistIsEmpty } = useWishlist()

  return (
    <div>
      <h5>Your wishlist items</h5>
      {!hasInitializedWishlist ? (
        <div className={classes.loading}>
          <LoadingShimmer />
        </div>
      ) : (
        <div>
          {!wishlistIsEmpty ? (
            <table className={classes.wishlistTable}>
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>PRODUCT NAME</th>
                  <th>UNIT PRICE</th>
                  <th>ADD TO CART</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {wishlist?.items?.map((wishlistItem, index) => {
                  if (typeof wishlistItem === 'string') {
                    return (
                      <tr key={index}>
                        <td colSpan={5} className={classes.placeholder}>{wishlistItem}</td>
                      </tr>
                    )
                  } else {
                    const product = wishlistItem?.product
                    const productTitle = product?.title ?? 'Unknown Product'
                    const productSlug = product?.slug
                    const productImage = product?.meta?.image
                    const productPrice = product?.price ?? 0

                    return (
                      <tr key={index} className={classes.wishlistItem}>
                        <td>
                          <div className={classes.mediaWrapper}>
                            {!productImage && <div className={classes.placeholder}>No image</div>}
                            {productImage && typeof productImage !== 'string' && (
                              <Media imgClassName={classes.image} resource={productImage} />
                            )}
                          </div>
                        </td>
                        <td>
                          {productSlug ? (
                            <Link href={`/products/${productSlug}`} className={classes.item}>
                              <span>{productTitle}</span>
                            </Link>
                          ) : (
                            <span>{productTitle}</span>
                          )}
                        </td>
                        <td>
                          <Price product={product} />
                        </td>
                        <td>
                          <AddToCartButton product={product} />
                        </td>
                        <td>
                          <RemoveFromWishButton product={product} />
                        </td>
                      </tr>
                    )
                  }
                })}
              </tbody>
            </table>
          ) : (
            <div className={classes.noWishlist}>No products added to the wishlist</div>
          )}
        </div>
      )}
    </div>
  )
}

