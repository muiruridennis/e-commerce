export const GET_NOTIFICATIONS = `
  query GetNotifications($productId: ID!) {
    Notifications(where: { product: { equals: $productId }, notified: { equals: false } }) {
      docs {
        id
        email
      }
    }
  }
`;

export const UPDATE_NOTIFICATION = `
  mutation UpdateNotification($id: ID!, $notified: Boolean!) {
    updateNotification(id: $id, data: { notified: $notified }) {
      id
      notified
    }
  }
`;
