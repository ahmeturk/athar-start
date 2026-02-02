import clsx from 'clsx';

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-3',
};

export default function Spinner({ size = 'md', className }) {
  return (
    <div
      role="status"
      aria-label="جاري التحميل"
      className={clsx(
        'rounded-full border-green-500 border-t-transparent animate-spin',
        sizeClasses[size],
        className
      )}
    />
  );
}
