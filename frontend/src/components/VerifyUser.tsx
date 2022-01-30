import { FC, useEffect, useState, ReactNode } from 'react'
import { ApiResponse, CurrentUser } from '../models'
import { getCurrentUser } from '../api'
import { useHistory } from 'react-router-dom'

interface Props {
  children: ReactNode
}

export const VerifyUser: FC<Props> = ({ children }): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>()
  const history = useHistory()

  useEffect(() => {
    async function checkIfLoggedIn() {
      const response: ApiResponse | undefined = await getCurrentUser()
      const user = response?.currentUser
      if (user !== undefined) setCurrentUser(user)
      else history.push('/signin')
    }

    checkIfLoggedIn()
  }, [])

  if (currentUser != null) {
    return <>{children}</>
  }

  return <div>Loading...</div>
}
