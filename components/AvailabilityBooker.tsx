import { addDays, format, isSameDay } from 'date-fns'
import { useState, useEffect, useMemo } from 'react'
import DateView from '../components/Date'
import AvailabilityForm from '../components/AvailabilityForm'
import { supabase } from '../lib/initSupabase'
import { User } from '@supabase/supabase-js'

export interface Booking {
  id?: number
  date: Date | string
  is_available: boolean
  is_by_car: boolean
  user_id: number
  users?: {
    name: string
  }
}

interface Employee {
  id: number
  name: string
  auth_id: string
}

export default function AvailabilityBooker({ user }: { user: User }) {
  const [activeDate, setActiveDate] = useState<Date>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [employee, setEmployee] = useState<Employee>()
  const [isLoading, setLoading] = useState<boolean>(false)

  const otherBookings = bookings.filter((booking) =>
    booking.user_id != employee.id &&
    booking.is_available
  )
  const myBooking = bookings.find((booking) => booking.user_id === employee.id) || {
    id: null,
    date: activeDate,
    is_available: false,
    is_by_car: false,
    user_id: null,
  }

  async function loadTable(date) {
    setLoading(true)
    setBookings([])

    const { data } = await supabase
      .from<Booking>('bookings')
      .select('id, date, is_available, is_by_car, user_id, users ( name )')
      .eq('date', format(date, 'yyyy-MM-dd'))

    setLoading(false)
    console.log(data)

    if (data.length > 0) {
      setBookings(data)
    }
  }

  async function loadEmployee(user: User) {
    const { data } = await supabase
      .from<Employee>('users')
      .select('id, name')
      .eq('auth_id', user.id)

    if (data.length > 0) {
      setEmployee(data[0])
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
      <div className="flex justify-between">
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
