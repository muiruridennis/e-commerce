import React from 'react'
import { getMeUser } from '../../../_utilities/getMeUser'
import WishlistItems from './WishlistItems/index'

export default async function WishlistPage() {
  const { user } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to access your account.',
    )}&redirect=${encodeURIComponent('/account/wishlist')}`,
  })

  return <WishlistItems user={user} />
}
