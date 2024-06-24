'use client'

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '../../../_components/Button'
import { Input } from '../../../_components/Input'
import { Message } from '../../../_components/Message'

import classes from './index.module.scss'
import { Textarea } from '../../../_components/Textarea'


type FormData = {
  name: string
  email: string
  subject: string
  message: string,
  phoneNumber: string
}

const ContactForm: React.FC = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/form-submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (response.ok) {
          setSuccess('Your message has been sent successfully!')
          setError(null)
          reset()
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to send message')
        }
      } catch (err) {
        setError(err.message || 'There was an error sending your message. Please try again.')
        setSuccess(null)
      }
    },
    [router],
  )
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <h2>Send Us a Message</h2>

      <Message error={error} success={success} className={classes.message} />
      <Input
        name="name"
        label="Your Name"
        required
        register={register}
        error={errors.name}
      />
      <Input
        name="email"
        label="Your Email"
        required
        type="email"
        register={register}
        error={errors.email}
      />
      <Input
        name="phoneNumber"
        label="Your Phone Number"
        register={register}
        error={errors.phoneNumber}
      />
      <Input
        name="subject"
        label="Subject"
        required
        register={register}
        error={errors.subject}
      />
      <Textarea
        name="message"
        label="Your Message"
        required
        register={register}
        error={errors.message}
      />
      <Button
        type="submit"
        appearance="primary"
        label={isSubmitting ? 'Sending...' : 'Send Message'}
        disabled={isSubmitting}
        className={classes.submit}
      />
    </form>
  )
}

export default ContactForm
