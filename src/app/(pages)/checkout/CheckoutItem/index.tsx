import Link from 'next/link'
import { Media } from '../../../_components/Media'
import { Price } from '../../../_components/Price'

import classes from './index.module.scss'

export const CheckoutItem = ({ product, title, metaImage, quantity, index }) => {
  return (
    <li className={classes.item} key={index}>
      <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
        {!metaImage && <span>No image</span>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media className={classes.media} imgClassName={classes.image} resource={metaImage} fill />
        )}
      </Link>

      <div className={classes.itemDetails}>
        <div className={classes.titleWrapper}>
          <h6>{title}</h6>
          <div className={classes.priceWrapper}>
            {product.discountedPrice ? (
              <>
                <span className={classes.originalPrice}>
                  <Price product={product} button={false} />
                </span>
                <span className={classes.discountPrice}>
                  <Price product={product} button={false} discountedPrice={product.discountedPrice} />
                </span>
              </>
            ) : (
              <Price product={product} button={false} />
            )}
          </div>
        </div>
        <p className={classes.quantity}>x{quantity}</p>
      </div>

      <div className={classes.subtotal}>
      {product.discountedPrice ? (
          <>
            <span className={classes.discountPrice}>
              <Price product={product} button={false} discountedPrice={product.discountedPrice} quantity={quantity} />
            </span>
          </>
        ) : (
          <Price product={product} button={false} quantity={quantity} />
        )}
      </div>
    </li>
  )
}