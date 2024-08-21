'use client'

import React, { Fragment, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Settings } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'
import { CheckoutItem } from '../CheckoutItem'
import ShippingForm from '../ShippingForm'
import CheckoutForm from '../CheckoutForm'

import classes from './index.module.scss'
import { ShippingProvider } from '../context/ShippingContext'

export const CheckoutPage: React.FC<{ settings: Settings }> = props => {
  const {
    settings: { productsPage },
  } = props

  const { user } = useAuth()
  const router = useRouter()
  const {
    cart,
    cartIsEmpty,
    cartTotal,
    deliveryCharge,
    totalDiscount,
    totalTax } = useCart()

  useEffect(() => {
    if (user !== null && cartIsEmpty) {
      router.push('/cart')
    }
  }, [router, user, cartIsEmpty])

  if (!user) return null

  return (
    <ShippingProvider>
      <Fragment>
        {cartIsEmpty && (
          <div>
            {'Your '}
            <Link href="/cart">cart</Link>
            {' is empty.'}
            {typeof productsPage === 'object' && productsPage?.slug && (
              <Fragment>
                {' '}
                <Link href={`/${productsPage.slug}`}>Continue shopping?</Link>
              </Fragment>
            )}
          </div>
        )}
        {!cartIsEmpty && (
          <div className={classes.container}>
            <div className={classes.leftColumn}>
              <ShippingForm user={user} />
            </div>
            <div className={classes.rightColumn}>
              <div className={classes.items}>
                <div className={classes.header}>
                  <p>Products</p>
                  <div className={classes.headerItemDetails}>
                    <p></p>
                    <p className={classes.quantity}>Quantity</p>
                  </div>
                  <p className={classes.subtotal}>Subtotal</p>
                </div>
                <ul>
                  {cart?.items?.map((item, index) => {
                    if (typeof item.product === 'object') {
                      const {
                        quantity,
                        product,
                        product: { title, meta },
                      } = item

                      if (!quantity) return null

                      const metaImage = meta?.image

                      return (
                        <Fragment key={index}>
                          <CheckoutItem
                            product={product}
                            title={title}
                            metaImage={metaImage}
                            quantity={quantity}
                            index={index}
                          />
                        </Fragment>
                      )
                    }
                    return null
                  })}
                  {/* <div className={classes.orderTotal}>
                  <p>Order Total</p>
                  <p>{cartTotal.formatted}</p>
                </div> */}
                  <div className={classes.summary}>
                    <div className={classes.row}>
                      <h6 className={classes.cartTotal}>Summary</h6>
                    </div>

                    <div className={classes.row}>
                      <p className={classes.cartTotal}>Delivery Charge</p>
                      <p className={classes.cartTotal}>{`KSH ${deliveryCharge}`} </p>
                    </div>
                    <div className={classes.row}>
                      <p className={classes.cartTotal}>Discount</p>
                      <p className={classes.cartTotal}>{totalDiscount}</p>
                    </div>
                    <div className={classes.row}>
                      <p className={classes.cartTotal}>Estimated Taxes</p>
                      <p className={classes.cartTotal}>{totalTax}</p>
                    </div>
                    <div className={classes.row}>
                      <p className={classes.cartTotal}>Grand Total</p>
                      <p className={classes.cartTotal}>{cartTotal.formatted}</p>
                    </div>
                  </div>
                </ul>
              </div>
              <CheckoutForm />
            </div>
          </div>
        )}
      </Fragment>
    </ShippingProvider>
  )
}
