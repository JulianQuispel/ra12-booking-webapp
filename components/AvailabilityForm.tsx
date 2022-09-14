import { useEffect, useState } from 'react'
import { supabase } from '../lib/initSupabase'
import { Booking } from '../types'

export default function AvailabilityForm({ booking, isLoading, loadTables }: {
  booking: Booking,
  isLoading: boolean,
  loadTables: CallableFunction
}) {
  const upsertAvailability = async () => {
    console.log(booking.user_id)
    const { data } = await supabase
      .from('bookings')
      .upsert({
        id: availabilityForm.id || undefined,
        is_available: availabilityForm.is_available,
        is_by_car: availabilityForm.is_by_car,
        date: availabilityForm.date,
        user_id: booking.user_id,
      })

    if (!data) return

    setAvailabilityForm({
      ...availabilityForm,
      id: data[0].id,
    })
    loadTables(new Date())

    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  const [availabilityForm, setAvailabilityForm] = useState(booking)
  const [isSuccess, setSuccess] = useState(false)

  useEffect(() => {
    setAvailabilityForm(booking)
  }, [booking])

  return (
    <div className="m-2 bg-gray-100 rounded-md p-2">
      <form>

        <h1 className="text-3xl font-semibold mb-3">Beschikbaarheid opgeven</h1>

        <div>
          <label>
            <input
              type="checkbox"
              className="mr-2"
              checked={availabilityForm.is_available}
              disabled={isLoading}
              onChange={(event) => {
                setAvailabilityForm({
                  ...availabilityForm,
                  is_available: event.target.checked,
                })
              }}
            />
            Ik ga naar kantoor
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              className="mr-2"
              checked={availabilityForm.is_by_car}
              disabled={isLoading}
              onChange={(event) => {
                setAvailabilityForm({
                  ...availabilityForm,
                  is_by_car: event.target.checked,
                })
              }}
            />
            Ik kom met de auto
          </label>
        </div>

        <div className="mt-4">
          <button
            type="button"
            disabled={isLoading}
            className={'bg-blue-600 text-white font-semibold w-full rounded-md p-3 transition ease-in-out duration-150 ' +
              ((isLoading ? 'opacity-50' : 'hover:bg-blue-500'))}
            onClick={upsertAvailability}
          >
            {isLoading ? 'Laden...' : 'Opslaan'}
          </button>
          {isSuccess && <div className="bg-green-500 text-green-800 mt-2 rounded-md p-2">Beschikbaarheid opgeslagen</div>}
        </div>

      </form>
    </div>
  )
}
