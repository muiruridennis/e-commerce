import { PRODUCT } from './products'
import { META } from './meta'
import { MEDIA } from './media'


export const PROMOTIONS = `
  query Promotions {
    Promotions(limit: 300) {
      docs {
        id
        title
        startDate
        endDate
        promotionType
        details
        product {
          id
          slug
          price
          ${META}

        }
      }
    }
  }
`;


export const PROMOTION = `
  query Promotion($id: ID!) {
    Promotion(id: $id) {
      id
      startDate
      endDate
      promotionType
      details
      product {
        id
        slug
        price
        ${META}

      }
    }
  }
`;


export const ACTIVE_PROMOTION = `
  query ActivePromotion {
    Promotions( where: {status: {equals:active}},  limit: 10) {
      docs {
        id
        startDate
        title
        endDate
        promotionType
        bannerImage {
          alt
          width
          height
          url
        }
        details
        discount{
          value
        }
        product {
            id
            slug
            price
            title
            ${META}
    
          }
      }
    }
  }
`;

