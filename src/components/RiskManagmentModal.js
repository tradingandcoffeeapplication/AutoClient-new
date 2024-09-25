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

const RiskManagmentModal = ({ currentAccount, setRiskManagment, defaults, unSavedChangesFlag }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(defaults);

  useEffect(() => {
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
    setRiskManagment(state);
    unSavedChangesFlag(true);
    setOpen(false);
    alertify.success(`Changes set. click on save changes to save them`);
  };

  const setPositionsInput = state.usePositionsRisk
    ? <p>
      Specify the maximum number of losing trades allowed per day.
      <input type="number"
        name="positionsRisk"
        value={state.positionsRisk}
        onChange={({ target }) => setState({ ...state, [target.name]: Number(target.value) })}
      />
      <br></br>
      <br></br>
      Please set your risk management by the amount of failed trades per day.
    </p>
    : null;

  const setDollarsInput = state.useDollarsRisk
    ? <p>
    Maximum $ value that will be lost per day.
    <br></br> 
    <br></br> 
      <input type="number"
        name="dollarsRisk"
        value={state.dollarsRisk}

        onChange={({ target }) => setState({ ...state, [target.name]: Number(target.value) })}
      />
      <br></br>      
      <br></br>
      Please set your Risk management by the amount of dollars lost per day.
    </p>
    : null;

  const setRatesInput = state.useRatesRisk
    ? <p>
    Maximum (%) of Account Balance that will be lost Per Day.
      <input type="number"
        name="ratesRisk"
        value={state.ratesRisk}

        onChange={({ target }) => setState({ ...state, [target.name]: Number(target.value) })}
      />
    </p>
    : null;

  return (
    <div id="modalsContainer">

      <Button id="changeBalanceModal" variant="contained" color="primary" style={{ position: 'relative', left: '440px', bottom: '50px', width: '300px' }}
        onClick={handleClickOpen}
      >
        Set Risk Management
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle><h3 style={{ textAlign: 'center' }}>Set Your {currentAccount} risk management</h3></DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          <h3 style={{ position: 'relative', bottom: '20px' }}>
            {/* We have two kinds of risk managment settings: {<br />}
            by amount of failed trades (per day) {<br />}
            and by amount of money lost. */}
            when the account will reach the risk limit it will stop trading at that day and will continue trading automatically on the next trading day

          </h3>
          <p style={{ fontSize: '20px' }}>
            Set Maximum Losing Trades Per Day
            <Checkbox
              checked={state.usePositionsRisk}
              name="usePositionsRisk"
              onChange={handleChange}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </p>
          {setPositionsInput}
          <p style={{ fontSize: '20px' }}>
            Set Maximum Loss Per Day
            <Checkbox
              checked={state.useDollarsRisk}
              name="useDollarsRisk"
              onChange={handleChange}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </p>
          {setDollarsInput}
          <p style={{ fontSize: '20px' }}>
            Set Maximum precentage of Account Balance that will be lost Per Day
            <Checkbox
              checked={state.useRatesRisk}
              name="useRatesRisk"
              onChange={handleChange}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </p>
          {setRatesInput}
          <p style={{ fontSize: '20px' }}>
            Maximum Margin Per Trade
            <input type="number"
              name="margin"
              value={state.margin}
              onChange={({ target }) => setState({ ...state, [target.name]: Number(target.value) })}
              style={{width: '15%', marginLeft: '10px'}}
            />
          </p>
          <p style={{ fontSize: '20px' }}>
          Maximum Number of Open Positions at same time
            <input type="number"
              name="sameTimeTrades"
              value={state.sameTimeTrades}
              onChange={({ target }) => setState({ ...state, [target.name]: Number(target.value) })}
              style={{width: '10%', marginLeft: '10px'}}
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

export default RiskManagmentModal;