import { META } from './meta'

export const CART = `cart {
  items {
    product {
      id
      slug
      price
      discountedPrice
      ${META}
    }
    quantity
  }
}`
