import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import alertify from 'alertifyjs';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

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

const RiskManagmentModal = ({ currentAccount, setTakeProfit, defaults, unSavedChangesFlag }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(defaults);


  useEffect(() => {
    setState(defaults);
    console.log(defaults)
  }, [defaults]);


  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: Number(event.target.value) });
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    alertify.error('Changes canceled')
  };

  const confirmAndClose = () => {
    setTakeProfit(state);
    setOpen(false);
    unSavedChangesFlag(true);
    alertify.success(`Changes set. click on save changes to save them`);
  };



  return (
    <div id="modalsContainer">

      <Button id="changeBalanceModal" variant="contained" color="primary"
        style={{ position: 'relative', bottom: '220px', left: '440px', width: '300px' }}
        onClick={handleClickOpen}
      >
        Set Take Profit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle><h3 style={{ textAlign: 'center' }}>Set Your {currentAccount} Take profit</h3></DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '20px' }}>
            Choose your take profit plan
          </p>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">there are 4 main plans</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={defaults.takeProfitPercentage}
              name="takeProfitPercentage"
              onChange={handleChange}
            >
              <FormControlLabel value="100" control={<Radio />} label="100%" />
              <FormControlLabel value="50" control={<Radio />} label="50% x2" />
              <FormControlLabel value="25" control={<Radio />} label="25% x4" />
              <FormControlLabel value="10" control={<Radio />} label="10% / 20% / 20% / 50%" />
              <FormControlLabel value="123" control={<Radio />} label="System's Reccomendations" />
            </RadioGroup>
          </FormControl>
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