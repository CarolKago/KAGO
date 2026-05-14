import styles from './Button.module.css'

export default function Button({
  children,
  variant = 'primary',
  as: Tag = 'button',
  className = '',
  ...props
}) {
  return (
    <Tag className={`${styles.btn} ${styles[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
