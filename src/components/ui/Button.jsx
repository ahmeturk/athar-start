import clsx from 'clsx';
import { ArrowLeft, Loader2 } from 'lucide-react';

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const variantClasses = {
  primary:
    'bg-green-500 text-white rounded-full hover:shadow-button hover:bg-green-600 active:bg-green-700 disabled:bg-green-300',
  secondary:
    'bg-transparent border-2 border-navy-500 text-navy-500 rounded-full hover:bg-navy-500 hover:text-white active:bg-navy-600 disabled:border-navy-300 disabled:text-navy-300',
  ghost:
    'bg-transparent text-navy-500 rounded-lg hover:bg-gray-100 active:bg-gray-200 disabled:text-navy-300',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled = false,
  loading = false,
  icon,
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer',
        'disabled:cursor-not-allowed disabled:opacity-70',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
      {variant === 'primary' && !loading && (
        <ArrowLeft className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
      )}
    </button>
  );
}
