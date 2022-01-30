import { FC, useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import { useHistory } from 'react-router-dom'
import { signUp, getCurrentUser } from '../api'
import { Register, CurrentUser, ApiResponse } from '../models'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export const SignUp: FC = () => {
  const history = useHistory()

  useEffect(() => {
    async function checkIfLoggedIn(): Promise<void> {
      const response: ApiResponse | undefined = await getCurrentUser()
      if (response === undefined) return
      const { currentUser, message } = response
      if (currentUser !== null) history.push('/')
    }
    void checkIfLoggedIn()
  }, [])

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      password: '',
      passwordConfirmation: ''
    },
    validationSchema: Yup.object({
      phone: Yup
        .string()
        .length(11, 'Please enter a valid phone number')
        .required('Phone number is required')
        .matches(/^[0-9]{11}$/g, 'Please enter a valid phone number'),
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required'),
      passwordConfirmation: Yup
        .string()
        .max(255)
        .oneOf(
          [Yup.ref('password')],
          'Passwords must match'
        )
        .required('This field is required')
    }),

    onSubmit: async (values: Register) => {
      await handleSubmit(values)
    }
  })

  const handleSubmit = async (values: Register) => {
    if (values) {
      const response: ApiResponse | undefined = await signUp(values)
      if (response === undefined) return
      const { currentUser, message } = response
      if (currentUser !== undefined) {
        history.push({
          pathname: '/'
        })
      }
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
              Create a new account
            </Typography>
            <Typography
              color='textSecondary'
              gutterBottom
              variant='body2'
            >
              Use your phone to create a new account
            </Typography>
          </Box>

          <TextField
            error={Boolean(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            label='Full Name'
            margin='dense'
            name='name'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
            variant='outlined'
          />

          <TextField
            error={Boolean(formik.touched.phone && formik.errors.phone)}
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
          <TextField
            error={Boolean(formik.touched.passwordConfirmation) && Boolean(formik.errors.passwordConfirmation)}
            fullWidth
            helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
            label='Confirm Password'
            margin='dense'
            name='passwordConfirmation'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type='password'
            value={formik.values.passwordConfirmation}
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
              Sign Up Now
            </Button>
          </Box>
          <Typography
            color='textSecondary'
            variant='body2'
          >
            Already have an account?{' '}
            <Link href='/signin' variant='body2' underline='hover'>
              Signin
            </Link>

          </Typography>
        </form>
      </Container>
    </Box>

  )
}
