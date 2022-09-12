import { format } from 'date-fns'

export default function DateView({
  date,
  isActive,
  setActiveDate
}: {
  date: Date,
  isActive: boolean,
  setActiveDate: Function,
}) {
  let className = 'p-2 text-center cursor-pointer h-full rounded-md text-gray-800 '
  className += isActive ? 'bg-blue-400' : 'bg-blue-600'

  return (
    <div className={className} onClick={() => setActiveDate(date)}>
      <strong className="w-full block text-sm">{format(date, 'iiii')}</strong>
      <span className="text-xs block whitespace-nowrap">{format(date, 'd MMMM')}</span>
    </div>
  )
}
