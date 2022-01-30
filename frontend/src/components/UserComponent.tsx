import { useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { getCurrentUser } from '../api'
import { CurrentUser, ApiResponse } from '../models'
import { SignOut } from './SignOut'
import { SendMoney } from './SendMoney'

const theme = createTheme()

export function UserComponent() {
  const [currentUser, setCurrentUser] = useState<CurrentUser>()

  useEffect(() => {
    async function getMyData() {
      const response: ApiResponse | undefined = await getCurrentUser()
      if (response === undefined) return
      const user = response.currentUser
      if (user !== undefined) setCurrentUser(user)
    }
    getMyData()
  }, [])

  if (currentUser == null) return <div>Loading...</div>

  return (
    <ThemeProvider theme={theme}>
      <Container component='main'>
        <CssBaseline />
        <SignOut />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography component='h1' variant='h5'>
            Hi {currentUser.name}
          </Typography>
          <Typography component='h2' variant='h5' sx={{ m: 2 }}>
            Your Current Balance is: {currentUser.amount} LE
          </Typography>

          <SendMoney currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </Box>
      </Container>
    </ThemeProvider>
  )
}
