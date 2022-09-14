import { useState } from 'react'
import { getEmployeeByEmail } from '../lib/database'
import { LoginFormData } from '../types'

export default function LoginForm({ setUser }: { setUser: CallableFunction }) {
  const [form, setForm] = useState<LoginFormData>({
    emailAddress: '',
  })
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  async function signIn(e) {
    e.preventDefault()

    setLoading(true)

    const user = await getEmployeeByEmail(form.emailAddress)

    if (!error) setError('Er is geen gebruiker gevonden met dit e-mailadres')

    if (user) setUser(user)

    setLoading(false)
  }

  return (
    <div className="p-4">

      <h1 className="text-3xl font-semibold text-center pt-4 pb-12">
        Login met uw account
      </h1>

      <form method="post" onSubmit={signIn}>

        <div>
          <label htmlFor="email" className="font-semibold">E-mailadres</label>
          <input
            id="email"
            type="email"
            placeholder="test@ra12.nl"
            value={form.emailAddress}
            disabled={isLoading}
            className="border border-gray-300 rounded-md w-full p-2 outline-blue-400"
            onChange={(event) => setForm({ emailAddress: event.target.value })}
          />
          {error && <span className="text-red-500">{error}</span>}
        </div>

        <button
          disabled={isLoading}
          className={
            'mt-3 w-full text-center font-semibold p-3 rounded-md text-white bg-blue-600 transition ease-in-out duration-150 ' +
            (isLoading ? 'opacity-50' : 'hover:bg-blue-500')
          }
        >
          {isLoading ? 'Aan het inloggen...' : 'Login'}
        </button>
      </form>
    </div >
  )
}
