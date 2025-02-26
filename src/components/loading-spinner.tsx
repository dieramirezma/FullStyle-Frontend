import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'secondary' | 'ghost'
  className?: string
  text?: string
  fullScreen?: boolean
}

export default function LoadingSpinner ({
  size = 'md',
  variant = 'primary',
  className,
  text,
  fullScreen = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-24 w-24'
  }

  const variantClasses = {
    default: 'text-gray-500',
    primary: 'text-primary',
    secondary: 'text-secondary',
    ghost: 'text-gray-300'
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center'

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2
          className={cn(
            'animate-spin',
            sizeClasses[size],
            variantClasses[variant]
          )}
        />
        {text && (
          <p className={cn(
            'text-sm font-medium',
            variantClasses[variant]
          )}>
            {text}
          </p>
        )}
      </div>
    </div>
  )
}
