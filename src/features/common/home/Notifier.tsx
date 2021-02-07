import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { getNotifications, removeNotification } from './appSlice';

function Notifier() {

  const dispatch = useDispatch();
  const notifications = useSelector(getNotifications);
  const { enqueueSnackbar } = useSnackbar();
  
  useEffect(() => {
    notifications.forEach(notification => {
      enqueueSnackbar(notification.message, {
        key: notification.key,
        variant: notification.variant,
      });
      dispatch(removeNotification(notification.key))
    })
  }, [dispatch, notifications, enqueueSnackbar])

  return null;
}

export default Notifier
