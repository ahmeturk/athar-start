import clsx from 'clsx';

export default function ProgressBar({
  value = 0,
  label,
  showPercent = false,
  className,
}) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={clsx('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-2 text-sm text-navy-500">
          {label && <span className="font-medium">{label}</span>}
          {showPercent && <span>{clamped}%</span>}
        </div>
      )}
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-l from-green-400 to-green-600 transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
