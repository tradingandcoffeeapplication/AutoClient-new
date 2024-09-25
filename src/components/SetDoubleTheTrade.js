import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  root: {
    display: 'flex',
  },
}));

const SetDoubleTheTrade = ({
  currentAccount,
  unSavedChangesFlag,
  setDoubleTheTradeValues,
  defaults
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    Stocks: false,
    Options: true
  });

  useEffect(() => {
    setState(defaults)
  }, [defaults])

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    alertify.error('Changes canceled')
  };

  const confirmAndClose = () => {
    setDoubleTheTradeValues(state);
    unSavedChangesFlag(true);
    setOpen(false);
    alertify.success(`Changes set. click on save changes to save them`);
  };

  return (
    <div id="modalsContainer">
      <Button id="changeBalanceModal" variant="contained" color="primary" style={{ position: 'relative', top: '40px', left: '440px', width: '300px' }}
        onClick={handleClickOpen}
      >
        Set Double the trade
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <h2 style={{ textAlign: 'center' }}>Set Double the trade</h2></DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
        <h3 style={{ textAlign: 'center' }}>use the same signal to trade on both stocks and options</h3>
          {currentAccount === 'stocks' && <p style={{ fontSize: '20px' }}>
            Stocksּ
            <Checkbox
              checked={state.Stocks}
              name="Stocks"
              onChange={handleChange}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </p>}
          <p style={{ fontSize: '20px' }}>
            Options
            <Checkbox
              checked={state.Options}
              name="Options"
              onChange={handleChange}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button color="primary"
            onClick={() => confirmAndClose()}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );


}

export default SetDoubleTheTrade;