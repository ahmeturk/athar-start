import clsx from 'clsx';

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return (parts[0] || '?')[0];
}

export default function Avatar({ name = '', size = 'md', className }) {
  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center rounded-full bg-gradient-to-br from-navy-500 to-green-500 text-white font-bold select-none shrink-0',
        sizeClasses[size],
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
