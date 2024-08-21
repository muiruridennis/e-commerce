import Link from 'next/link';
import Image from 'next/image';
import classes from './index.module.scss'; 

type WishlistNavItemProps = {
  itemCount: number;
};

const WishlistNavItem: React.FC<WishlistNavItemProps> = ({ itemCount }) => {
  return (
    <Link href="/account/wishlist" passHref className={classes.wishlistNavItem}>
        <div className={classes.wishlistIconContainer}>
          <Image
            src="/assets/icons/wish-list.svg"
            alt="wishlist"
            width={28}
            height={28}
            className={classes.wishlistIcon}
          />
          {itemCount > 0 && <div className={classes.itemCount}>{itemCount}</div>}
        </div>
        <span className={classes.navText}>Wishlist</span>
    </Link>
  );
};

export default WishlistNavItem;
