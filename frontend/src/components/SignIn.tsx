import { FC, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { signIn, getCurrentUser } from '../api'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { SigninUser, CurrentUser, ApiResponse } from '../models'

interface LocationState {
  from: {
    pathname: string
  }
}

export const SignIn: FC = () => {
  const history = useHistory()

  const location = useLocation<LocationState>()
  const { from } = location.state || { from: { pathname: '/' } }

  useEffect(() => {
    async function checkIfLoggedIn(): Promise<void> {
      const response = await getCurrentUser()
      if(response === undefined) return
      const {currentUser, message} = response

      if (currentUser !== undefined) history.push('/')
    }
    void checkIfLoggedIn()
  }, [])

  const formik = useFormik({
    initialValues: {
      phone: '',
      password: ''
    },
    validationSchema: Yup.object({
      phone: Yup
        .string()
        .length(11, 'Please enter a valid phone number')
        .required('Phone number is required')
        .matches(/^[0-9]{11}$/g, 'Please enter a valid phone number'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')

    }),

    onSubmit: async (values: SigninUser) => {
      await handleSubmit(values)
    }
  })

  const handleSubmit = async (values: SigninUser): Promise<void> => {
    if (values) {
      const response: ApiResponse | undefined = await signIn(values)
      if (response === undefined) return
      const { currentUser, message } = response
      if (currentUser === null) return

      history.push({
        pathname: from.pathname
      })
    }
  }

  return (
    <Box
      component='main'
      maxWidth='xs'
    >
      <CssBaseline />
      <Container maxWidth='xs'>

        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              color='textPrimary'
              variant='h4'
            >
              Sign In
            </Typography>
          </Box>

          <TextField
            error={Boolean(formik.touched.phone) && Boolean(formik.errors.phone)}
            fullWidth
            helperText={formik.touched.phone && formik.errors.phone}
            label='Phone Number'
            margin='dense'
            name='phone'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.phone}
            variant='outlined'
          />

          <TextField
            error={Boolean(formik.touched.password) && Boolean(formik.errors.password)}
            fullWidth
            helperText={formik.touched.password && formik.errors.password}
            label='Password'
            margin='dense'
            name='password'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type='password'
            value={formik.values.password}
            variant='outlined'
          />

          <Box sx={{ py: 2 }}>
            <Button
              color='primary'
              disabled={formik.isSubmitting}
              fullWidth
              size='large'
              type='submit'
              variant='contained'
            >
              Sign In
            </Button>
          </Box>
          <Typography
            color='textSecondary'
            variant='body2'
          >
            Don't have an account?{' '}
            <Link href='/signup' variant='body2' underline='hover'>
              Register
            </Link>
          </Typography>
        </form>
      </Container>
    </Box>

  )
  // return (
  //   <ThemeProvider theme={theme}>
  //     <Container component="main" maxWidth="xs">
  //       <CssBaseline />
  //       <Box
  //         sx={{
  //           marginTop: 8,
  //           display: 'flex',
  //           flexDirection: 'column',
  //           alignItems: 'center',
  //         }}
  //       >
  //         <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
  //           <LockOutlinedIcon />
  //         </Avatar>
  //         <Typography component="h1" variant="h5">
  //           Sign in
  //         </Typography>

  //         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
  //           <TextField
  //             margin="normal"
  //             required
  //             fullWidth
  //             id="phone"
  //             label="Phone Number"
  //             name="phone"
  //             autoFocus
  //           />
  //           <TextField
  //             margin="normal"
  //             required
  //             fullWidth
  //             name="password"
  //             label="Password"
  //             type="password"
  //             id="password"
  //             autoComplete="current-password"
  //           />
  //           <Button
  //             type="submit"
  //             fullWidth
  //             variant="contained"
  //             sx={{ mt: 3, mb: 2 }}
  //           >
  //             Sign In
  //           </Button>
  //           <Grid container>
  //             <Grid item>
  //               <Link href="/signup" variant="body2">
  //                 {"Don't have an account? Register"}
  //               </Link>
  //             </Grid>
  //           </Grid>
  //         </Box>
  //       </Box>
  //     </Container>
  //   </ThemeProvider>
  // );
}
