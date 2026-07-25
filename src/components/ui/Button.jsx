export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'chinese-btn-primary',
    gold: 'chinese-btn-gold',
    outline: 'chinese-btn-outline',
  }

  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
