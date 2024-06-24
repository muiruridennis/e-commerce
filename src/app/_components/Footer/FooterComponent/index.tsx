'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Footer, Media } from '../../../../payload/payload-types'
import { inclusions, noHeaderFooterUrls } from '../../../constants'
import { Button } from '../../Button'
import { Gutter } from '../../Gutter'

import classes from './index.module.scss'

const FooterComponent = ({ footer }: { footer: Footer }) => {
  const pathname = usePathname()
  const navItems = footer?.navItems || []

  return (
    <footer className={noHeaderFooterUrls.includes(pathname) ? classes.hide : ''}>
      <Gutter>
        <ul className={classes.inclusions}>
          {inclusions.map(inclusion => (
            <li key={inclusion.title}>
              <Image
                src={inclusion.icon}
                alt={inclusion.title}
                width={36}
                height={36}
                className={classes.icon}
              />
              <h5 className={classes.title}>{inclusion.title}</h5>
              <p>{inclusion.description}</p>
            </li>
          ))}
        </ul>
      </Gutter>

      <div className={classes.footer}>
        <Gutter>
          <div className={classes.wrap}>
            <div>
            <Link href="/">
              <Image src="/logo-white.svg" alt="logo" width={170} height={50} className={classes.logo} />
            </Link>
            <p>{footer?.copyright}</p>

            </div>

            <div className={classes.links}>
              <div>
                <h5>Contact Us</h5>
                <p>1234 Street Name, City, State, 12345</p>
                <p>Phone: (123) 456-7890</p>
                <p>Email: support@example.com</p>
              </div>
              <div>
                <h5>Customer Service</h5>
                <ul>
                  <li><Link href="/help-center">Help Center</Link></li>
                  <li><Link href="/returns">Returns & Refunds</Link></li>
                  <li><Link href="/shipping">Shipping Information</Link></li>
                  <li><Link href="/track-order">Order Tracking</Link></li>
                </ul>
              </div>
              <div>
                <h5>My Account</h5>
                <ul>
                  <li><Link href="/login">Login/Register</Link></li>
                  <li><Link href="/account">My Account</Link></li>
                  <li><Link href="/account/orders">Order History</Link></li>
                  <li><Link href="/account/wishlist">Wishlist</Link></li>
                </ul>
              </div>
              <div>
                <h5>Company</h5>
                <ul>
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/careers">Careers</Link></li>
                  <li><Link href="/blog">Blog</Link></li>
                  <li><Link href="/press">Press</Link></li>
                </ul>
              </div>
              <div>
                <h5>Policies</h5>
                <ul>
                  <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link href="/terms-of-service">Terms of Service</Link></li>
                  <li><Link href="/cookie-policy">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>

            <div className={classes.socialLinks}>
              {navItems.map(item => {
                const icon = item?.link?.icon as Media
                return (
                  <Button
                    key={item.link.label}
                    el="link"
                    href={item.link.url}
                    newTab={true}
                    className={classes.socialLinkItem}
                  >
                    <Image
                      src={icon?.url}
                      alt={item.link.label}
                      width={24}
                      height={24}
                      className={classes.socialIcon}
                    />
                  </Button>
                )
              })}
            </div>
          </div>
        </Gutter>
      </div>
    </footer>
  )
}

export default FooterComponent
