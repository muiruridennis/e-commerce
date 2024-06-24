import React from 'react'
import { FieldValues, UseFormRegister, Validate } from 'react-hook-form'
import classes from './index.module.scss'

type Props = {
  name: string
  label: string
  register: UseFormRegister<FieldValues & any>
  required?: boolean
  error: any
  validate?: (value: string) => boolean | string
  disabled?: boolean
}

export const Textarea: React.FC<Props> = ({
  name,
  label,
  required,
  register,
  error,
  validate,
  disabled,
}) => {
  return (
    <div className={classes.textareaWrap}>
      <label htmlFor={name} className={classes.label}>
        {label}
        {required ? <span className={classes.asterisk}>&nbsp;*</span> : ''}
      </label>
      <textarea
        className={[classes.textarea, error && classes.error].filter(Boolean).join(' ')}
        {...register(name, {
          required,
          validate,
        })}
        disabled={disabled}
      />
      {error && (
        <div className={classes.errorMessage}>
          {!error?.message && error?.type === 'required'
            ? 'This field is required'
            : error?.message}
        </div>
      )}
    </div>
  )
}
