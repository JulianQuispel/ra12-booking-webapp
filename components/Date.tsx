import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

export default function DateView({
  date,
  isActive,
  setActiveDate
}: {
  date: Date,
  isActive: boolean,
  setActiveDate: Function,
}) {
  let className = 'p-2 text-center cursor-pointer h-full rounded-md text-gray-800 border-2 '
  className += isActive ? 'bg-blue-200 border-blue-400' : 'bg-gray-200'

  return (
    <div className={className} onClick={() => setActiveDate(date)}>
      <strong className="w-full block text-sm">{format(date, 'iiii', { locale: nl })}</strong>
      <span className="text-xs block whitespace-nowrap">{format(date, 'd MMMM', { locale: nl })}</span>
    </div>
  )
}
