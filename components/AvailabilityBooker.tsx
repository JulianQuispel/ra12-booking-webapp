import { addDays, isSameDay } from 'date-fns'
import { useState, useEffect } from 'react'
import DateView from '../components/Date'
import AvailabilityForm from '../components/AvailabilityForm'
import { supabase } from '../lib/initSupabase'
import { User } from '@supabase/supabase-js'
import { Booking, Employee } from '../types'
import { getBookingsByDate, getEmployeeByUserId } from '../lib/database'

export default function AvailabilityBooker({ user }: { user: User }) {
  const [activeDate, setActiveDate] = useState<Date>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [employee, setEmployee] = useState<Employee>()
  const [isLoading, setLoading] = useState<boolean>(false)

  const otherBookings = bookings.filter((booking) =>
    booking.user_id != employee?.id &&
    booking.is_available
  )
  const myBooking = bookings.find((booking) => booking.user_id === employee?.id) || {
    id: null,
    date: activeDate,
    is_available: false,
    is_by_car: false,
    user_id: employee?.id,
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

  async function loadEmployee(user: User) {
    const employee = await getEmployeeByUserId(user.id)

    if (employee) {
      setEmployee(employee)
    }
  }

  useEffect(() => {
    const today = new Date()
    setActiveDate(today)

    loadEmployee(user)
    loadTable(today)
  }, [user])

  return (
    <div>
      <div className="flex justify-between overflow-x-scroll">
        {[...Array(5).keys()].map((days) => {
          const date = addDays(new Date(), days)

          return (
            <div className="m-2 w-full" key={date.getTime()}>
              <DateView date={date} isActive={isSameDay(date, activeDate)} setActiveDate={(date) => {
                setActiveDate(date)
                loadTable(date)
              }} />
            </div>
          )

        })}
      </div>

      <AvailabilityForm booking={myBooking} isLoading={isLoading} />

      {otherBookings.length > 0 && <div className="border-t border-gray-200 p-2">
        <h2 className="text-2xl">Wie komen er nog meer?</h2>

        {
          otherBookings.map((booking) => <div key={booking.id}>{booking.users.name} {booking.is_by_car ? '(met de auto)' : ''}</div>)
        }
      </div>
      }



      <div className="p-2 border-t border-gray-200">
        {employee && <span className="block mb-2">Ingelogd als {employee.name}</span>}

        <button
          className="bg-red-700 w-full hover:bg-red-600 rounded-md p-3 font-bold text-white transition ease-in-out duration-150"
          onClick={() => supabase.auth.signOut()}
        >
          Uitloggen
        </button>
      </div>
    </div>
  )
}
