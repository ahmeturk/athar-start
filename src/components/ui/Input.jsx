import clsx from 'clsx';

export default function Input({
  label,
  error,
  className,
  dir,
  id,
  ...rest
}) {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-navy-500 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        dir={dir}
        className={clsx(
          'w-full border-2 rounded-xl py-3 px-4 text-navy-500 placeholder-gray-400 transition-all duration-200 form-input',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-200',
          className
        )}
        {...rest}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
