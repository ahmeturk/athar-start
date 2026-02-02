import clsx from 'clsx';

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className,
  hoverable = false,
  padding = 'md',
  ...rest
}) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-card transition-shadow duration-300',
        hoverable && 'hover:shadow-card-hover',
        paddingClasses[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
