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

export const getEmployeeByUserId = async (userId: string) => {
  const { data } = await supabase
      .from<Employee>('users')
      .select('id, name')
      .eq('auth_id', userId)

  if(data.length > 0) {
    return data[0]
  }

  return null
}
