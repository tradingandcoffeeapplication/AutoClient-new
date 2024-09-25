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

const RiskManagmentModal = ({ currentAccount, setStopLoss, defaults, unSavedChangesFlag }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(defaults);


  useEffect( ()=> {
    setState(defaults);
  }, [defaults]);


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
    setStopLoss(state);
    setOpen(false);
    unSavedChangesFlag(true);
    alertify.success(`Changes set. click on save changes to save them`);
  };

  const useSystemStopLoss = state.useSystemStopLoss
    ? null
    : 
    <p>
    if not please set your own stop loss by precentage (%)
    <input type="number"
      name="userStoploss"
      value={state.userStopLoss}
      onChange={({ target }) => setState({ ...state, userStopLoss: Number(target.value) })}
    />
  </p>;

  return (
    <div id="modalsContainer">

      <Button id="changeBalanceModal" variant="contained" color="primary" 
      style={{ position: 'relative', left: '440px', bottom: '220px', width: '300px' }}
        onClick={handleClickOpen}
      >
        Set Stop Loss
      </Button>       
       <Dialog open={open} onClose={handleClose}>
        <DialogTitle><h3 style={{ textAlign: 'center' }}>Set Your {currentAccount} stop loss</h3></DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '20px' }}>
            Would You like to use our stop loss system?
            <Checkbox
              checked={state.useSystemStopLoss}
              name="useSystemStopLoss"
              onChange={handleChange}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </p>
          {useSystemStopLoss}
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

export default RiskManagmentModal;