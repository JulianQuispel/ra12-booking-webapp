export interface LoginFormData {
  emailAddress: string
}

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

export interface Employee {
  id: number
  name: string
  email: string
}
