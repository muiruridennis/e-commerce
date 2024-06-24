import React from 'react'
import { draftMode } from 'next/headers'

import { Page, } from '../../../payload/payload-types'
import { fetchDoc } from '../../_api/fetchDoc'
import { Blocks } from '../../_components/Blocks'
import { Gutter } from '../../_components/Gutter'
import { Hero } from '../../_components/Hero'
import { notFound } from 'next/navigation'


import classes from './index.module.scss'

const About = async () => {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null


  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug: 'about',
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
    <div >
      <Hero {...hero} />
      <Gutter className={classes.about}>
        <Blocks blocks={page?.layout} disableTopPadding={true} />
      </Gutter>
    </div>
  )
}

export default About