import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Input from '@material-ui/core/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import { isForInStatement } from 'typescript';
import {useHistory } from 'react-router-dom'
import { sendMoney, getCurrentUser,signOut } from '../api'
import { User } from '../models'

const theme = createTheme();


export function MyData() {
  const history = useHistory();

  const [username, setUsername] = React.useState<string>('');
  const [currentBalance, setCurrentBalance] = React.useState<number>(0);
  const [receiverPhone, setReceiverPhone] = React.useState<string>('');
  const [transferAmount, setTransferAmount] = React.useState<number>(0);
  const [errorTransferAmount, setErrorTransfereAmount] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function getMyData() {
      const user = await getCurrentUser();
      if (user) {
        setCurrentBalance(user.amount);
        setUsername(user.name);
      }
    }
    getMyData();
  },[]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user: User | undefined = await sendMoney(receiverPhone, transferAmount);

    if(!user) return
    setCurrentBalance(user.amount)
    setTransferAmount(0)
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    const value = parseInt(onlyNums)
    if (typeof value !== 'number') return;
    setReceiverPhone(onlyNums);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorTransfereAmount(false)
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    const value = parseInt(onlyNums)

    if (typeof value !== 'number') return;
    if (Number.isNaN(value)) setTransferAmount(0);
    else {
      if (value > currentBalance) setErrorTransfereAmount(true);
      setTransferAmount(value);
    }
  }

  const signOutClicked = async (e: React.MouseEvent<HTMLElement>) => {
    await signOut()
    history.push('/signin')

  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" >
        <CssBaseline />
        <Box sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'row-reverse',
        }}>

          <Button variant="contained" onClick={signOutClicked}>SignOut</Button>
        </Box>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Hi {username}
          </Typography>
          <Typography component="h2" variant="h5" sx={{ m: 2 }}>
            Your Current Balance is: {currentBalance} LE
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="receiverPhone"
                  label="Send To"
                  name="receiverPhone"
                  onChange={handlePhoneChange}
                  value={receiverPhone}
                />
              </Grid>
              <Grid item xs={12}>

                <TextField
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]d' }}
                  required
                  fullWidth
                  id="amount"
                  label="Amount To Transfer"
                  name="amount"
                  onChange={handleChange}
                  value={transferAmount}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">LE</InputAdornment>,
                  }}
                  helperText={errorTransferAmount && "Transfer amount cannot be greater than your balance"}
                  error={errorTransferAmount}
                />

              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={errorTransferAmount || transferAmount === 0 || receiverPhone.length === 0}
            >
              Transfer
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
