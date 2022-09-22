import { addDays, isSameDay } from 'date-fns'
import { useState, useEffect } from 'react'
import DateView from '../components/Date'
import AvailabilityForm from '../components/AvailabilityForm'
import { Booking, Employee } from '../types'
import { getBookingsByDate } from '../lib/database'

export default function AvailabilityBooker({ user, setUser }: {
  user: Employee,
  setUser: CallableFunction
}) {
  const [activeDate, setActiveDate] = useState<Date>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)

  const allBookings = bookings.filter((booking) => booking.is_available)
  const myBooking = bookings.find((booking) => booking.user_id === user.id) || {
    id: null,
    date: activeDate,
    is_available: false,
    is_by_car: false,
    user_id: user.id,
  }

  async function loadTable(date) {
    setLoading(true)
    setBookings([])

    const data = await getBookingsByDate(date)

    setLoading(false)

    if (data.length > 0) {
      setBookings(data)
    }
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem('user')
  }

  useEffect(() => {
    const today = new Date()
    setActiveDate(today)

    loadTable(today)
  }, [user])

  return (
    <div>
      <div className="flex justify-between overflow-x-scroll">
        {[...Array(5).keys()].map((days) => {
          const date = addDays(new Date(), days)

          return (
            <div className="my-2 mx-1 w-full" key={date.getTime()}>
              <DateView date={date} isActive={isSameDay(date, activeDate)} setActiveDate={(date) => {
                setActiveDate(date)
                loadTable(date)
              }} />
            </div>
          )

        })}
      </div>

      <AvailabilityForm booking={myBooking} isLoading={isLoading} loadTables={() => loadTable(activeDate)} />

      {allBookings.length > 0 && <div className="border-t border-gray-200 p-2">
        <h2 className="text-2xl">Wie komen er?</h2>

        {
          allBookings.map((booking) => <div key={booking.id}>{booking.users.name} {booking.is_by_car ? '(met de auto)' : ''}</div>)
        }
      </div>
      }



      <div className="p-2 border-t border-gray-200">
        {user && <span className="block mb-2">Ingelogd als {user.name}</span>}

        <button
          className="bg-red-700 w-full hover:bg-red-600 rounded-md p-3 font-bold text-white transition ease-in-out duration-150"
          onClick={signOut}
        >
          Uitloggen
        </button>
      </div>
    </div>
  )
}
