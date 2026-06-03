// components/common/Button.jsx
import React from 'react'

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon: Icon,
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 transition-all duration-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 focus:ring-pink-300',
    secondary: 'bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100 disabled:opacity-50 focus:ring-pink-200',
    ghost: 'text-pink-600 hover:bg-pink-50 disabled:opacity-50 focus:ring-pink-200',
    outline: 'border-1.5 border-pink-100 text-pink-600 hover:bg-pink-50 disabled:opacity-50 focus:ring-pink-200',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />}
      {children}
    </button>
  )
}
