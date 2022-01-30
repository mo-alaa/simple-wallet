import { useState, ChangeEvent, FC } from 'react'
import { Button, TextField, Box, InputAdornment, Container } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { sendMoney } from '../api'
import { Transaction, CurrentUser, ApiResponse, INotification } from '../models'
import { Notification } from './Notification'

interface UserProps {
  currentUser: CurrentUser
  setCurrentUser: Function
}

export const SendMoney: FC<UserProps> = (props: UserProps) => {
  //special handler for money because mui doesn't have an out of the box textfield for positive digits only
  //and we want user to write only digits
  const [transferAmount, setTransferAmount] = useState<number>(0)
  const [errorTransferAmount, setErrorTransfereAmount] = useState<boolean>(false)

  const [notification, setNotification] = useState<INotification>({ visible: false, message: '', severity: 'success' })
  const formik = useFormik({
    initialValues: {
      receiverPhone: '',
      amount: ''
    },
    validationSchema: Yup.object({
      receiverPhone: Yup
        .string()
        .length(11, 'Please enter a valid phone number')
        .required('Phone number is required')
        .notOneOf([props.currentUser.phone], 'This is your phone number, you have to write the receiver\'s phone number')
        .matches(/^[0-9]{11}$/g, 'Please enter a valid phone number'),
      amount: Yup
        .string()
        .required('Amount is required')
        .matches(/^[0-9]/g, 'Please enter a valid amount')
    }),

    onSubmit: async (values) => {
      const { receiverPhone } = values
      const transaction: Transaction = {
        receiverPhone,
        amount: transferAmount
      }
      await handleSubmit(transaction)
    }
  })

  const handleSubmit = async (transaction: Transaction): Promise<void> => {
    if (transaction.amount === 0) return
    const response: ApiResponse | undefined = await sendMoney(transaction)
    // check for the return, if error show error, if not show sucess and make tamount = 0
    if (response === undefined) return
    const { currentUser } = response
    if (currentUser === undefined) {
      const notification: INotification = {
        visible: true,
        message: 'Error occured',
        severity: 'error'
      }
      setNotification(notification)
    }
    else {
      props.setCurrentUser(currentUser)
      setTransferAmount(0)
      const notification: INotification = {
        visible: true,
        message: 'Sent Successfuly',
        severity: 'success'
      }
      setNotification(notification)
    }

  }

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setErrorTransfereAmount(false)
    const onlyNums = e.target.value.replace(/[^0-9]/g, '')
    const value = parseInt(onlyNums)

    if (typeof value !== 'number') return
    if (Number.isNaN(value)) setTransferAmount(0)
    else {
      if (value > props.currentUser.amount) setErrorTransfereAmount(true)
      setTransferAmount(value)
      formik.handleChange(e)
    }
  }

  const notificationClosed = () => {
    setNotification({ ...notification, visible: false })
  }

  return (
    <>
      <Box
        component='main'
        maxWidth='xs'
      >

        <Container maxWidth='xs'>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              error={Boolean(formik.touched.receiverPhone) && Boolean(formik.errors.receiverPhone)}
              fullWidth
              helperText={formik.touched.receiverPhone && formik.errors.receiverPhone}
              label='Phone Number'
              margin='dense'
              name='receiverPhone'
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.receiverPhone}
              variant='outlined'
            />

            <TextField
              error={errorTransferAmount || (Boolean(formik.touched.amount) && Boolean(formik.errors.amount))}
              fullWidth
              helperText={formik.touched.amount && formik.errors.amount}
              label='Amount to transfer'
              margin='dense'
              name='amount'
              onBlur={formik.handleBlur}
              onChange={handleAmountChange}
              value={transferAmount}
              variant='outlined'
              InputProps={{
                sx: {
                  boxSizing: 'border-box'
                },
                endAdornment: <InputAdornment position='end'>LE</InputAdornment>
              }}
            />

            <Box sx={{ py: 2 }}>
              <Button
                color='primary'
                // disabled={formik.isSubmitting}
                fullWidth
                size='large'
                type='submit'
                variant='contained'
                disabled={errorTransferAmount || Boolean(formik.isSubmitting)}
              >
                Transfer
              </Button>
            </Box>

          </form>
        </Container>
      </Box>
      <Notification notification={notification} notificationClosed={notificationClosed} />
    </>
  )
}
