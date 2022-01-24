import { FC, useEffect, useState,ReactNode } from 'react'
import { User } from '../models'
import { getCurrentUser } from '../api';
import { useHistory } from "react-router-dom";

interface Props {
  children: ReactNode
}

export const VerifyUser: FC<Props> = ({children}): JSX.Element => {

  const [currentUser, setCurrentUser] = useState<User>();
  const history = useHistory();
  
  useEffect(() => {

    async function checkIfLoggedIn() {
      const user = await getCurrentUser();
      console.log('user@verify', {user});
      if (user) setCurrentUser(user);
      else history.push('/signin')
    }

    checkIfLoggedIn();
  },[]);

  if(currentUser) {
    console.log('logged currentUser data',currentUser);
    return <>{children}</>
  }
  
  return <div>Loading...</div>

}