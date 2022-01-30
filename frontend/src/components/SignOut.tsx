import { FC } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useHistory } from 'react-router-dom'
import { signOut } from '../api'

export const SignOut: FC = () => {
  const history = useHistory()

  const signOutClicked = async (e: React.MouseEvent<HTMLElement>): Promise<void> => {
    await signOut()
    history.push('/signin')
  }

  return (
    <Box sx={{
      marginTop: 2,
      display: 'flex',
      flexDirection: 'row-reverse'
    }}
    >

      <Button variant='contained' onClick={signOutClicked}>SignOut</Button>
    </Box>

  )
}
