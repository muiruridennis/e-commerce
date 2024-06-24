import React from 'react'
import ContactForm from './ContactForm'
import classes from './index.module.scss'
import { draftMode } from 'next/headers'

import { Page } from '../../../payload/payload-types'
import { fetchDoc } from '../../_api/fetchDoc'
import { Gutter } from '../../_components/Gutter'
import { notFound } from 'next/navigation'

const ContactPage = async () => {
    const { isEnabled: isDraftMode } = draftMode()
    let page: Page | null = null

    try {
        page = await fetchDoc<Page>({
            collection: 'pages',
            slug: 'contact',
            draft: isDraftMode,
        })
    } catch (error) {
        console.log(error)
    }

    if (!page) {
        return notFound()
    }

    const { hero } = page

    return (
        <Gutter>
            <div className={classes.contactPage}>
                <h4>Have a question? We're here to help! Contact us today.</h4>
                <div className={classes.moreInfo}>
                    <div className={classes.info}>
                        <div className={classes.semiInfo}>

                            <h5>Our Office</h5>
                            <p>123 Tech Street, Silicon Valley, CA, USA</p>
                        </div>
                        <div className={classes.semiInfo}>

                            <h5>Customer Support</h5>
                            <p>For immediate assistance, please call our customer support hotline.</p>
                            <p>Phone Number: +1 (800) 123-4567</p>
                        </div>
                        <div className={classes.semiInfo}>

                            <h5>Email Us</h5>
                            <p>You can also reach us via email at <a href="mailto:support@techheaven.com">support@techheaven.com</a>.</p>
                        </div>


                    </div>
                    <ContactForm />
                </div>
                <div className="googlemap">
                    <iframe
                        className="google-iframe"
                        title="Google Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.35721207169!2d126.9525508511284!3d37.49949233562292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca1d7daa43d7b%3A0x101547c9adb8137c!2z7ISc7Jq467O47LmY6rO8!5e0!3m2!1sko!2sus!4v1603125402556!5m2!1sko!2sus"
                        frameBorder="0"
                        style={{ border: 0 }}
                        allowFullScreen
                        aria-hidden="false"
                        tabIndex="0"
                    />
                </div>
            </div>
        </Gutter>

    )
}

export default ContactPage
