import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { Product, User } from '../../../payload/payload-types'
import { useAuth } from '../Auth'
import { WishItem, wishlistReducer } from './reducer'

export type WishlistContext = {
  wishlist: User['wishlist']
  addItemToWishlist: (item: WishItem) => void
  deleteItemFromWishlist: (product: Product) => void
  wishlistIsEmpty: boolean | undefined
  clearWishlist: () => void
  isProductInWishlist: (product: Product) => boolean
  hasInitializedWishlist: boolean
}

const Context = createContext({} as WishlistContext)

export const useWishlist = () => useContext(Context)

const arrayHasItems = (array) => Array.isArray(array) && array.length > 0

export const WishlistProvider = (props) => {
  const { children } = props
  const { user, status: authStatus } = useAuth()
  const [wishlist, dispatchWishlist] = useReducer(wishlistReducer, { items: [] })
  const hasInitialized = useRef(false)
  const [hasInitializedWishlist, setHasInitialized] = useState(false)

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      const syncWishlistFromLocalStorage = async () => {
        const localWishlist = localStorage.getItem('wishlist')
        const parsedWishlist = JSON.parse(localWishlist || '[]')
        if (parsedWishlist?.items && parsedWishlist?.items?.length > 0) {
          const initialWishlist = await Promise.all(
            parsedWishlist.items.map(async ({ product }) => {
              const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${product}`)
              const data = await res.json()
              return { product: data }
            }),
          )
          dispatchWishlist({
            type: 'SET_WISHLIST',
            payload: { items: initialWishlist }
          })
        } else {
          dispatchWishlist({ type: 'SET_WISHLIST', payload: { items: [] } })
        }
      }
      syncWishlistFromLocalStorage()
    }
  }, [])

  useEffect(() => {
    if (!hasInitialized.current) return
    if (authStatus === 'loggedIn') {
      dispatchWishlist({
        type: 'MERGE_WISHLIST',
        payload: user?.wishlist
      })
    }
    if (authStatus === 'loggedOut') {
      dispatchWishlist({ type: 'CLEAR_WISHLIST' })
    }
  }, [user, authStatus])

  useEffect(() => {
    if (!hasInitialized.current || user === undefined) return
    const flattenedWishlist = {
      ...wishlist,
      items: wishlist?.items
        ?.map((item) => {
          if (!item?.product || typeof item?.product !== 'object') {
            return null
          }
          return { ...item, product: item?.product?.id }
        })
        .filter(Boolean) as WishItem[],
    }
    if (user) {
      try {
        const syncWishlistToPayload = async () => {
          const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify({ wishlist: flattenedWishlist }),
            headers: { 'Content-Type': 'application/json' },
          })
          if (req.ok) {
            localStorage.setItem('wishlist', '[]')
          }
        }
        syncWishlistToPayload()
      } catch (e) {
        console.error('Error while syncing wishlist to Payload.')
      }
    } else {
      localStorage.setItem('wishlist', JSON.stringify(flattenedWishlist))
    }
    setHasInitialized(true)
  }, [user, wishlist])

  const isProductInWishlist = useCallback((incomingProduct: Product): boolean => {
    let isInWishlist = false
    const { items: itemsInWishlist } = wishlist || {}
    if (Array.isArray(itemsInWishlist) && itemsInWishlist.length > 0) {
      isInWishlist = Boolean(
        itemsInWishlist.find(({ product }) =>
          typeof product === 'string'
            ? product === incomingProduct.id
            : product?.id === incomingProduct.id,
        ),
      )
    }
    return isInWishlist
  }, [wishlist])

  const addItemToWishlist = useCallback((incomingItem) => {
    dispatchWishlist({ type: 'ADD_ITEM', payload: incomingItem })
  }, [])

  const deleteItemFromWishlist = useCallback((incomingProduct: Product) => {
    dispatchWishlist({ type: 'DELETE_ITEM', payload: incomingProduct })
  }, [])

  const clearWishlist = useCallback(() => {
    dispatchWishlist({ type: 'CLEAR_WISHLIST' })
  }, [])

  return (
    <Context.Provider
      value={{
        wishlist,
        addItemToWishlist,
        deleteItemFromWishlist,
        wishlistIsEmpty: hasInitializedWishlist && !arrayHasItems(wishlist?.items),
        clearWishlist,
        isProductInWishlist,
        hasInitializedWishlist,
      }}
    >
      {children && children}
    </Context.Provider>
  )
}
