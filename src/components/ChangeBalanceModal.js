import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import alerfity from 'alertifyjs';



const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const ChangeBalanceModal = ({ currentAccount }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [addCredits, setAddCredits] = useState(0);
  const [addDollars, setAddDollars] = useState(0)


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDollarsChange = (value) => {
    setAddDollars(Number(value))
  }

  const handleCreditsChange = (value) => {
    setAddCredits(Number(value))
  }

  const confirmChanges = () => {
    alerfity.success(`You have successfully changed your credits balance to ${addCredits}  and dollars balance to ${addDollars}$ `);
    setAddDollars(0);
    setAddCredits(0);
    setOpen(false);
  }

  return (
    <div id="modalsContainer">
      <Button id="changeBalanceModal" variant="contained" color="primary"
        style={{ position: 'relative', right: '420px', top: '35px', width: '300px'  }}
        onClick={handleClickOpen}
      >
        change {currentAccount} balance
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle><h3>Change your Credits and Dollars Balance</h3></DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '20px' }}>
            your current {currentAccount} credits balance is: 0
          </p>
          <br />
          <span style={{ fontSize: '20px', marginLeft: '20px'}}>
            change {currentAccount} credits balance to:
          </span>
          <Input
            id="standard-number"
            label="Number"
            InputProps={{
              inputProps: {
                type: 'number',
                min: 0
              },
            }}
            defaultValue="0"
            minValue="0"
            value={addCredits}
            onChange={({ target }) => handleCreditsChange(target.value)}
            style={{
              width: '70px',
              paddingLeft: '20px'
            }}
          />
          <br />
          <br />
          <br />
          <br />
          <p style={{ fontSize: '20px'}}>
            your current {currentAccount} dollars balance is: 0
          </p>
          <br />
          <span style={{ fontSize: '20px', marginLeft: '20px'}}>
            change your {currentAccount} dollars balance
          </span>
          <Input
            id="standard-number"
            label="Number"
            InputProps={{
              inputProps: {
                type: 'number',
                min: 0
              },
            }} defaultValue="0"
            min="0"
            value={addDollars}
            onChange={({ target }) => handleDollarsChange(target.value)}
            style={{
              width: '70px',
              paddingLeft: '20px'
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmChanges} color="primary">
            Change
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );


}

export default ChangeBalanceModal;