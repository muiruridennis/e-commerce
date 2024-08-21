'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { Product } from '../../../payload/payload-types'
import { Media } from '../Media'
import { Price } from '../Price'

import classes from './index.module.scss'

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  relationTo?: 'products'
  doc?: Product
  initialPrice?: string
  discountedPrice?: string
}> = props => {
  const {
    title: titleFromProps,
    doc,
    doc: { slug, title, meta } = {},
    className,
    discountedPrice,
  } = props

  const { description, image: metaImage } = meta || {}

  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/products/${slug}`

 
  return (
    <Link href={href} className={[classes.card, className].filter(Boolean).join(' ')}>
      <div className={classes.mediaWrapper}>
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media imgClassName={classes.image} resource={metaImage} fill />
        )}
      </div>

      <div className={classes.content}>
        {titleToUse && <h4 className={classes.title}>{titleToUse}</h4>}
        {description && (
          <div className={classes.body}>
            {description && <p className={classes.description}>{sanitizedDescription}</p>}
          </div>
        )}
        {discountedPrice ? (
          <>
            <span className={classes.initialPrice}>
              {doc && <Price product={doc} />}
            </span>
            <span className={classes.discountedPrice}>{discountedPrice}</span>
          </>
        ) : (
          <span className={classes.price}>
            {doc && <Price product={doc} />}
          </span>
        )}

      </div>
    </Link>
  )
}
