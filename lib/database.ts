import format from 'date-fns/format'
import { Booking, Employee } from '../types'
import { supabase } from './initSupabase'

export const getBookingsByDate = async (date: Date) => {
  const { data } = await supabase
      .from<Booking>('bookings')
      .select('id, date, is_available, is_by_car, user_id, users ( name )')
      .eq('date', format(date, 'yyyy-MM-dd'))

  return data
}

export const getEmployeeByEmail = async (email: string) => {
  const { data } = await supabase
      .from<Employee>('users')
      .select('id, name')
      .eq('email', email)

  if(data.length > 0) {
    return data[0]
  }

  return null
}
