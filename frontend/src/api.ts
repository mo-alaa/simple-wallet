import { CurrentUser, Register, SigninUser, Transaction, ApiResponse } from './models'
import { endpoint, prodEndpoint } from './config'

const backendUri =
  process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint

export async function getCurrentUser (): Promise<ApiResponse | undefined> {
  const url = `${backendUri}/user/current`
  try {
    const response = await fetch(url, { credentials: 'include' })
    const json = await response.json()
   
    const apiResponse : ApiResponse= {
      currentUser: json.data,
      message: json.message
    } 
    return apiResponse
    // if (response.ok) {
    //   console.log(json.message)
    //   const apiResponse = json as ApiResponse
    //   return apiResponse
    //   // const currentUser = json.data as CurrentUser
    //   // return currentUser
    // }
    // else console.log(json.message)
  } catch (error) {
    console.log(error)
  }

  return undefined
}

export async function sendMoney (
  transaction: Transaction
): Promise<ApiResponse | undefined> {
  const url = `${backendUri}/transaction/sendMoney`

  try {
    const response = await fetch(url, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    })

    const json = await response.json()
    const apiResponse : ApiResponse= {
      currentUser: json.data,
      message: json.message
    } 
    return apiResponse
    // if (response.ok) {
    //   console.log(json.message)
    //   const currentUser = json.data as CurrentUser
    //   return currentUser
    // }
    // else console.log(json.message)
  } catch (error) {
    console.log(error)
  }

  return undefined
}

export async function signIn (
  values: SigninUser
): Promise<ApiResponse | undefined> {
  const url = `${backendUri}/user/signin`

  const response = await fetch(url, {
    method: 'post',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(values)
  })
  try {
    const json = await response.json()
    const apiResponse : ApiResponse= {
      currentUser: json.data,
      message: json.message
    } 
    return apiResponse
    // if (response.ok) {
    //   const currentUser = json.data as CurrentUser
    //   return currentUser
    // }
    // else console.log(json.message)
  } catch (error) {
    console.log(error)
  }
  return undefined
}

export async function signUp (
  registerUser: Register
): Promise<ApiResponse | undefined> {
  const url = `${backendUri}/user/signup`

  try {
    const response = await fetch(url, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerUser)
    })

    const json = await response.json()

    const apiResponse : ApiResponse= {
      currentUser: json.data,
      message: json.message
    } 
    return apiResponse
    
    // if (response.ok) {
    //   console.log(json.message)
    //   const currentUser = json.data as CurrentUser
    //   return currentUser
    // }
    // else console.log(json.message)
  } catch (error) {
    console.log(error)
  }

  return undefined
}

export async function signOut (): Promise<void> {
  const url = `${backendUri}/user/signout`
  
  try {
    const response = await fetch(url, {
      method: 'post',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
    const json = await response.json()
    console.log(json.message)
  } catch (error) {
    console.log(error)
  }
}
