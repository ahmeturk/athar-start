import clsx from 'clsx';

const variantClasses = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-600',
};

export default function Badge({ variant = 'neutral', children }) {
  return (
    <span
      className={clsx(
        'inline-block rounded-full px-3 py-1 text-xs font-medium',
        variantClasses[variant]
      )}
    >
      {children}
    </span>
  );
}
