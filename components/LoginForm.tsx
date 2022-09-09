import { useState } from 'react'
import { supabase } from '../lib/initSupabase'

interface LoginForm {
  emailAddress: string
}

export default function LoginForm() {
  const [form, setForm] = useState<LoginForm>({
    emailAddress: '',
  })
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isSuccess, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  async function signIn(e) {
    e.preventDefault()

    setLoading(true)

    const { user, session, error } = await supabase.auth.signIn({
      email: form.emailAddress,
    })

    if (error) setError(error.message)

    if (!error) setSuccess(true)

    console.log(user, session, error)
    setLoading(false)
  }

  return (
    <div className="p-4">

      <h1 className="text-3xl font-semibold text-center pt-4 pb-12">
        Login met uw account
      </h1>

      {!isSuccess && <form method="post" onSubmit={signIn}>

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
      </form>}

      {isSuccess && <span>Wij hebben u een mailtje gestuurd met een code waarmee u kan inloggen</span>}
    </div >
  )
}
