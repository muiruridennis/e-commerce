import React, { Fragment } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Order, Payment } from '../../../../../payload/payload-types'
import { HR } from '../../../../_components/HR'
import { Media } from '../../../../_components/Media'
import { Price } from '../../../../_components/Price'
import { formatDateTime } from '../../../../_utilities/formatDateTime'
import { getMeUser } from '../../../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../../../_utilities/mergeOpenGraph'

import classes from './index.module.scss'

export default async function OrderPage({ params: { id } }) {
  const { token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to view this order.',
    )}&redirect=${encodeURIComponent(`/order/${id}`)}`,
  })

  let order: Order | null = null

  try {
    order = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
    })?.then(async res => {
      if (!res.ok) notFound()
      const json = await res.json()
      if ('error' in json && json.error) notFound()
      if ('errors' in json && json.errors) notFound()
      return json
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }
  let mpesaReceiptNumber: string | undefined;
  if (order.paymentMethod === "Mpesa" && order.payment && typeof order.payment !== 'string') {
    mpesaReceiptNumber = (order.payment as Payment).mpesaReceiptNumber;
  }
  if (!order) {
    notFound()
  }
  return (
    <div>
      <h5>
        {`Order`}
        <span className={classes.id}>{` ${order.id}`}</span>
      </h5>
      <div className={classes.itemMeta}>
        <p>{`ID: ${order.id}`}</p>
        <p>{`Payment Method : ${order.paymentMethod}`}</p>
        {order.paymentMethod === "Mpesa" && (<p>{`Mpesa Trans Number:  ${mpesaReceiptNumber}`}</p>)}
        <p>{`Status : ${order.status}`}</p>
        <p>{`Ordered On: ${formatDateTime(order.createdAt)}`}</p>
       
      </div>
      <div className={classes.summary}>
        <div className={classes.summaryrow}>
          <h6 className={classes.cartTotal}>Summary</h6>
        </div>

        <div className={classes.summaryrow}>
          <p className={classes.cartTotal}>Delivery Charge</p>
          <p className={classes.cartTotal}>{order.deliveryCharge} </p>
        </div>
        <div className={classes.summaryrow}>
          <p className={classes.cartTotal}>Discount</p>
          <p className={classes.cartTotal}>{order.totalDiscount}</p>
        </div>
        <div className={classes.summaryrow}>
          <p className={classes.cartTotal}>Estimated Taxes</p>
          <p className={classes.cartTotal}>{order.totalTax}</p>
        </div>
        <div className={classes.summaryrow}>
          <p className={classes.cartTotal}>Grand Total</p>
          <p className={classes.cartTotal}>{order.total}</p>
        </div>
      </div>



      <div className={classes.order}>
        {order.items?.map((item, index) => {
          if (typeof item.product === 'object') {
            const {
              quantity,
              product,
              product: { title, meta },
            } = item

            const metaImage = meta?.image

            return (
              <Fragment key={index}>
                <div className={classes.row}>
                  <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
                    {!metaImage && <span className={classes.placeholder}>No image</span>}
                    {metaImage && typeof metaImage !== 'string' && (
                      <Media
                        className={classes.media}
                        imgClassName={classes.image}
                        resource={metaImage}
                        fill
                      />
                    )}
                  </Link>
                  <div className={classes.rowContent}>

                    <h6 className={classes.title}>
                      <Link href={`/products/${product.slug}`} className={classes.titleLink}>
                        {title}
                      </Link>
                    </h6>
                    <p>{`Quantity: ${quantity}`}</p>
                    {/* <Price product={product} button={false} quantity={quantity} /> */}
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
                </div>
              </Fragment>
            )
          }

          return null
        })}
      </div>
      <HR className={classes.hr} />
    </div>
  )
}

export async function generateMetadata({ params: { id } }): Promise<Metadata> {
  return {
    title: `Order ${id}`,
    description: `Order details for order ${id}.`,
    openGraph: mergeOpenGraph({
      title: `Order ${id}`,
      url: `/orders/${id}`,
    }),
  }
}
