'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Order } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { Message } from '../../../_components/Message'
import { useCart } from '../../../_providers/Cart'
import classes from './index.module.scss'
import Image from 'next/image'
import { HR } from '../../../_components/HR'


export const CheckoutForm: React.FC<{}> = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [polling, setPolling] = useState(false)
  const router = useRouter()
  const { cart, cartTotal } = useCart()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()
      setIsLoading(true)
      setError(null)
      setAttempts(0)

      try {
        // Create the order first
        const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            total: cartTotal.raw,
            paymentMethod,
            items: (cart?.items || []).map(({ product, quantity }) => ({
              product: typeof product === 'string' ? product : product.id,
              quantity,
              price: typeof product === 'object' ? product.price : undefined,
            })),
          }),
        })

        if (!orderResponse.ok) throw new Error(orderResponse.statusText || 'Something went wrong.')

        const {
          error: orderError,
          doc: order,
        }: {
          message?: string
          error?: string
          doc: Order
        } = await orderResponse.json()

        if (orderError) throw new Error(orderError)

        const newOrderId = order.id
        setOrderId(newOrderId)

        if (paymentMethod === 'Mpesa') {
          // Initiate STK push with the orderId
          const stkResponse = await fetch('/api/mpesa/stkpush', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: cartTotal.raw,
              phoneNumber,
              orderId: newOrderId,
            }),
          })

          const stkData = await stkResponse.json()
          if (!stkResponse.ok || stkData.ResponseCode !== '0') {
            throw new Error(stkData.CustomerMessage || 'Failed to initiate checkout')
          }

          console.log(`STK Push initiated successfully for Order ID: ${newOrderId}`)
          setPolling(true) // Start polling
        } else if (paymentMethod === 'CashOnDelivery') {
          handleOrderConfirmation(newOrderId, "CashOnDelivery")
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong.'
        console.error(`Error while submitting payment: ${msg}`)
        setError(`Error while submitting payment: ${msg}`)
        setIsLoading(false)
      }
    },
    [cart, cartTotal, phoneNumber, paymentMethod],
  )

  useEffect(() => {
    if (orderId && polling && attempts < 18) { // Maximum 18 attempts
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/mpesa/orders/${orderId}`)
          const data = await response.json()
          console.log("Response while polling order:", data)

          if (response.ok && data.payment) {
            const { payment } = data
            if (payment.status === 'completed') {
              clearInterval(interval)
              handleOrderConfirmation(orderId, 'Mpesa')
            }
          }
        } catch (error) {
          console.error('Error checking payment status:', error)
        }

        setAttempts(prevAttempts => prevAttempts + 1)
        if (attempts >= 17) { // Stop polling after 17 attempts
          clearInterval(interval)
          setError('Payment status check timed out')
          setIsLoading(false)
        }
      }, 5000) // Poll every 5 seconds
      return () => clearInterval(interval)
    }
  }, [orderId, polling, attempts])
  const updateInventory = async (cartItems) => {
    for (const { product, quantity } of cartItems) {
      const productId = typeof product === 'string' ? product : product.id;
      const inventoryId = typeof product === 'object' && product.inventory ? product.inventory.id : '';

      if (!inventoryId) {
        console.error(`Inventory ID not found for product ${productId}`);
        continue; // Skip to the next product if inventory ID is not available
      }

      const stockQuantity = typeof product === 'object' && product.inventory ? product.inventory.stockQuantity || 0 : 0;

      try {
        const updateInventoryResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/inventory/${inventoryId}`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              stockQuantity: stockQuantity - quantity,
            }),
          }
        );

        if (!updateInventoryResponse.ok) {
          throw new Error(updateInventoryResponse.statusText || 'Inventory update failed');
        }
      } catch (err) {
        console.error(`Error updating inventory for product ${productId}: ${err.message}`);
      }
    }
  };

  const handleOrderConfirmation = useCallback(async (orderId, paymentMethod) => {
    const cartItems = cart?.items || [];

    if (paymentMethod === 'CashOnDelivery') {
      try {
        // Update the order status to 'completed'
        const updateOrderResponse = await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'completed',
          }),
        });

        if (!updateOrderResponse.ok) {
          throw new Error('Failed to update the order status');
        }

        console.log("Order status updated to completed for Cash on Delivery");

        await updateInventory(cartItems);

        // Redirect to order confirmation page
        router.push(`/order-confirmation?order_id=${orderId}`);
      } catch (err) {
        console.error('Error confirming order:', err.message);
        setError('Failed to confirm the order');
        setIsLoading(false);
        router.push(`/order-confirmation?error=${encodeURIComponent(err.message)}`);
      }
    } else if (paymentMethod === 'Mpesa') {
      try {
        const response = await fetch(`/api/mpesa/orders/${orderId}`);
        const data = await response.json();
        if (response.ok) {
          console.log("Order confirmed and completed:", data);

          // Update inventory
          await updateInventory(cartItems);

          // Clear the cart only after successful order confirmation
          router.push(`/order-confirmation?order_id=${orderId}`);
        } else {
          console.error("Failed to confirm the order:", data);
          setError('Failed to confirm the order');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error confirming order:', err.message);
        setError('Failed to confirm the order');
        setIsLoading(false);
        router.push(`/order-confirmation?error=${encodeURIComponent(err.message)}`);
      }
    }
  }, [router, cart?.items]);



  return (
    <>
      <h6 className={classes.question}>How would you like to pay?</h6>
      <form onSubmit={handleSubmit} className={classes.form}>
        {error && <Message error={error} />}
        <div className={classes.formGroup}>
          <div className={classes.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={paymentMethod === 'Mpesa'}
                onChange={() => setPaymentMethod('Mpesa')}
              />
              Mpesa
            </label>
            <HR className={classes.hr} />
            <label>
              <input
                type="checkbox"
                checked={paymentMethod === 'CashOnDelivery'}
                onChange={() => setPaymentMethod('CashOnDelivery')}
              />
              Cash on Delivery
            </label>
          </div>
        </div>
        {paymentMethod === 'Mpesa' && (
          <div className={classes.formGroup}>
            <Image
              src="/assets/lipanampesa.png"
              alt="lipa na mpesa"
              height={150}
              width={200}
            />
            <label htmlFor="phoneNumber" className={classes.label}>Phone Number</label>
            <input
              placeholder="Enter phone number"
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className={classes.input}
            />
          </div>
        )}
        <div className={classes.actions}>
          <Button label="Back to cart" href="/cart" appearance="secondary" />
          <Button
            label={isLoading ? 'Loading...' : 'Checkout'}
            type="submit"
            appearance="primary"
            disabled={isLoading}
          />
        </div>
      </form>
    </>

  )
}

export default CheckoutForm
