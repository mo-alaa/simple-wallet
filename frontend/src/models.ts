import {AlertColor} from '@mui/material'
export interface User {
  name: string
  phone: string
}

export interface SigninUser {
  phone: string
  password: string
}
export interface CurrentUser extends User {
  amount: number
}
export interface Register extends User{
  password: string
}

export interface Transaction {
  receiverPhone: string
  amount: number
}

export interface ApiResponse {
  currentUser: CurrentUser
  message: string
} 

export interface INotification {
  visible: boolean
  message: string
  severity: AlertColor
}