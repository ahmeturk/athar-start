import clsx from 'clsx';

export default function Toggle({ checked = false, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <button
        role="switch"
        type="button"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        className={clsx(
          'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 cursor-pointer',
          checked ? 'bg-green-500' : 'bg-gray-300'
        )}
      >
        <span
          className={clsx(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-navy-500">{label}</span>
      )}
    </label>
  );
}
