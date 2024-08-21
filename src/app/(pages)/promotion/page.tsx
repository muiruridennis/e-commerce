import React from 'react'
import { draftMode } from 'next/headers'

import { Promotion } from '../../../payload/payload-types'
import { fetchDocs } from '../../_api/fetchDocs'
import { Gutter } from '../../_components/Gutter'
import { HR } from '../../_components/HR'

import classes from './index.module.scss'
import { Card } from '../../_components/Card'

const PromotionPage = async () => {

  let promotions: Promotion[] | null = null

  try {
    promotions = await fetchDocs<Promotion>('promotions')

  } catch (error) {
    console.log(error)
  }
  return (
    <div className={classes.container}>
      <Gutter className={classes.products}>
        {promotions && promotions.length > 0 ? (
          promotions.map((promotion) => (
            <div key={promotion.id} className={classes.promotionContainer}>
              <div className={classes.promotionDetails}>
                <h2>{promotion.title}</h2>
                <p>{promotion.details}</p>
                <div className={classes.productList}>
                  {promotion.product.map((product) => {
                  const initialPrice = product.price;
                  const discountValue = promotion.discount.value;
                  const discountedPrice = initialPrice - (initialPrice * discountValue / 100);

                  return (
                    <Card
                      key={product.id}
                      doc={product}
                      discountedPrice={`Ksh ${discountedPrice.toFixed(2)}`}
                    />
                  );
                })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No promotions available at the moment.</p>
        )}
        <HR />
      </Gutter>
    </div>
  )
}

export default PromotionPage