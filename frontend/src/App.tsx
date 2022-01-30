import { FC } from 'react'
import { Switch, Route } from 'react-router-dom'
import { SignIn } from './components/SignIn'
import { SignUp } from './components/SignUp'
import { UserComponent } from './components/UserComponent'
import { VerifyUser } from './components/VerifyUser'
import './App.css'

export const App: FC = () => {
  return (
    <Switch>

      <Route path='/signup'>
        <SignUp />
      </Route>

      <Route path='/signin'>
        <SignIn />
      </Route>

      <Route path='/'>
        <VerifyUser>
          <UserComponent />
        </VerifyUser>
      </Route>
    </Switch>
  )
}
