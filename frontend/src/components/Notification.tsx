import { FC, useEffect, useState } from 'react';
import { Snackbar, Alert} from '@mui/material';
import { INotification } from '../models'

interface Props {
  notification: INotification
  notificationClosed: Function
}

export const Notification: FC<Props> = (props: Props) => {
  const { message, severity, visible } = props.notification

  const [open, setOpen] = useState(visible);

  useEffect(() => {
    setOpen(visible)
  }, [visible])

  const handleClose = () => {
    setOpen(false);
    props.notificationClosed()
  };

  return (

    <Snackbar
      autoHideDuration={6000}
      open={open}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
