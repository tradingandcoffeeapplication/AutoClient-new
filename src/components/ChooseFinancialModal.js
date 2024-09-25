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

const ChooseFinancialModal = ({
  currentAccount,
  setFinancialTech,
  setRates,
  defaults,
  defaultRates,
  unSavedChangesFlag
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(defaults);
  const [stocksRates, setStocksRates] = React.useState(defaultRates[0])
  const [optionsRates, setOptionsRates] = React.useState(defaultRates[1])
  const [futureContractsRates, setFutureContractsRates] = React.useState(defaultRates[2])
  const [futureContractsOptionsRates, setFutureContractsOptionsRates] = React.useState(defaultRates[3])


  useEffect(() => {
    setStocksRates(defaultRates[0]);
    setOptionsRates(defaultRates[1]);
    setFutureContractsRates(defaultRates[2]);
    setFutureContractsOptionsRates(defaultRates[3]);
  }, [defaultRates])

  useEffect(() => {
    setState(defaults);
  }, [defaults]);



  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleStocksAmountChange = (event) => {
    setStocksRates({ ...stocksRates, [event.target.name]: Number(event.target.value) });
  };


  const handleOptionsAmountChange = (event) => {
    setOptionsRates({ ...optionsRates, [event.target.name]: Number(event.target.value) });
  };

  const handleContractAmountChange = (event) => {
    setFutureContractsRates({ ...futureContractsRates, [event.target.name]: Number(event.target.value) });
  };

  const handleOptionOnContractAmountChange = (event) => {
    setFutureContractsOptionsRates({ ...futureContractsOptionsRates, [event.target.name]: Number(event.target.value) });
  };


  const handleStocksRatesChange = (event) => {
    setStocksRates({ ...stocksRates, [event.target.name]: event.target.checked });
  };

  const handleOptionsRatesChange = (event) => {
    setOptionsRates({ ...optionsRates, [event.target.name]: event.target.checked });
  };

  const handleFutureContractsRatesChange = (event) => {
    setFutureContractsRates({ ...futureContractsRates, [event.target.name]: event.target.checked });
  };

  const handleCFutureContractsOptionsRatesChange = (event) => {
    setFutureContractsOptionsRates({ ...futureContractsOptionsRates, [event.target.name]: event.target.checked });
  };

  const handleAmountChange = () => {

  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    alertify.error('Changes canceled')
  };

  const confirmAndClose = () => {
    setFinancialTech(state);
    unSavedChangesFlag(true);
    setRates([stocksRates, optionsRates, futureContractsRates, futureContractsOptionsRates]);
    setOpen(false);
    alertify.success(`Changes set. click on save changes to save them`);
  };

  return (
    <div id="modalsContainer">

      <Button id="changeBalanceModal" variant="contained" color="primary" style={{ position: 'relative', bottom: '114px', width: '300px' }}
        onClick={handleClickOpen}
      >
        Choose Financial Technology
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <h3 style={{ textAlign: 'center' }}>Choose the type of financial technology you would like to use</h3></DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          {currentAccount === 'stocks' && <p style={{ fontSize: '20px' }}>
            Stocksּ
            <Checkbox
              checked={state.Stocks}
              name="Stocks"
              onChange={handleChange}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            {state.Stocks === true && <div>
              Stocks rates:
              <br />
              5-100$
              <Checkbox
                checked={stocksRates._5 || false}
                name="_5"
                onChange={handleStocksRatesChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              Stocks per trade:
              <input type="number" style={{ width: '50px' }}
                name="_5_amount"
                value={stocksRates._5_amount}
                onChange={handleStocksAmountChange}
              />
              <br />
              100-249$
              <Checkbox
                checked={stocksRates._100 || false}
                name="_100"
                onChange={handleStocksRatesChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              Stocks per trade:
              <input type="number" style={{ width: '50px' }}
                name="_100_amount"
                value={stocksRates._100_amount}
                onChange={handleStocksAmountChange}
              />
              <br />
              250-500$
              <Checkbox
                checked={stocksRates._250 || false}
                name="_250"
                onChange={handleStocksRatesChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              Stocks per trade:
              <input type="number" style={{ width: '50px' }}
                name="_250_amount"
                value={stocksRates._250_amount}
                onChange={handleStocksAmountChange}
              />
              <br />
              500-999$
              <Checkbox
                checked={stocksRates._500 || false}
                name="_500"
                onChange={handleStocksRatesChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              Stocks per trade:
              <input type="number" style={{ width: '50px' }}
                name="_500_amount"
                value={stocksRates._500_amount}
                onChange={handleStocksAmountChange}
              />
              <br />
              1000+
              <Checkbox
                checked={stocksRates._1000 || false}
                name="_1000"
                onChange={handleStocksRatesChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              Stocks per trade:
              <input type="number" style={{ width: '50px' }}
                name="_1000_amount"
                value={stocksRates._1000_amount}
                onChange={handleStocksAmountChange}
              />
              <br />
            </div>}
          </p>}
           {currentAccount === 'stocks' && <p style={{ fontSize: '20px' }}>
            Options
            <Checkbox
              checked={state.Options}
              name="Options"
              onChange={handleChange}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            {state.Options === true && <div>
              {currentAccount === 'stocks' && <div>
                Options rates:
                <br />
                5-100$
                <Checkbox
                  checked={optionsRates._5 || false}
                  name="_5"
                  onChange={handleOptionsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Options per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_5_amount"
                  value={optionsRates._5_amount}
                  onChange={handleOptionsAmountChange}
                />
                <br />
                100-249$
                <Checkbox
                  checked={optionsRates._100 || false}
                  name="_100"
                  onChange={handleOptionsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Options per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_100_amount"
                  value={optionsRates._100_amount}
                  onChange={handleOptionsAmountChange}
                />
                <br />
                250-500$
                <Checkbox
                  checked={optionsRates._250 || false}
                  name="_250"
                  onChange={handleOptionsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Options per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_250_amount"
                  value={optionsRates._250_amount}
                  onChange={handleOptionsAmountChange}
                />
                <br />
                500-999$
                <Checkbox
                  checked={optionsRates._500 || false}
                  name="_500"
                  onChange={handleOptionsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Options per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_500_amount"
                  value={optionsRates._500_amount}
                  onChange={handleOptionsAmountChange}
                />
                <br />
                1000+
                <Checkbox
                  checked={optionsRates._1000 || false}
                  name="_1000"
                  onChange={handleOptionsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Options per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_1000_amount"
                  value={optionsRates._1000_amount}
                  onChange={handleOptionsAmountChange}
                />
                <br />
              </div>}

              {currentAccount !== 'stocks' && <div>
                Options per trade:
                <input type="number" style={{ width: '50px' }}
                  name="optionsPerTrade"
                  value={optionsRates.optionsPerTrade}
                  onChange={handleOptionsAmountChange}
                />
              </div>}
            </div>}
          </p>}
          {currentAccount !== 'stocks' && <p style={{ fontSize: '20px' }}>
            Future contracts
            <Checkbox
              checked={state.FutureContract}
              name="FutureContract"
              onChange={handleChange}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            {state.FutureContract === true && <div>
              {currentAccount === 'stocks' && <div>
                Future Contracts rates:
                <br />
                <br />
                5-100$
                <Checkbox
                  checked={futureContractsRates._5 || false}
                  name="_5"
                  onChange={handleFutureContractsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Contracts per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_5_amount"
                  value={futureContractsRates._5_amount}
                  onChange={handleContractAmountChange}
                />
                <br />
                100-249$
                <Checkbox
                  checked={futureContractsRates._100 || false}
                  name="_100"
                  onChange={handleFutureContractsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Contracts per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_100_amount"
                  value={futureContractsRates._100_amount}
                  onChange={handleContractAmountChange}
                />
                <br />
                250-499$
                <Checkbox
                  checked={futureContractsRates._250 || false}
                  name="_250"
                  onChange={handleFutureContractsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Contracts per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_250_amount"
                  value={futureContractsRates._250_amount}
                  onChange={handleContractAmountChange}
                />
                <br />
                500-999$
                <Checkbox
                  checked={futureContractsRates._500 || false}
                  name="_500"
                  onChange={handleFutureContractsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Contracts per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_500_amount"
                  value={futureContractsRates._500_amount}
                  onChange={handleContractAmountChange}
                />
                <br />
                1000+
                <Checkbox
                  checked={futureContractsRates._1000 || false}
                  name="_1000"
                  onChange={handleFutureContractsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Contracts per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_1000_amount"
                  value={futureContractsRates._1000_amount}
                  onChange={handleContractAmountChange}
                />
              </div>}

              {currentAccount !== 'stocks' && <div>
                Contracts per trade:
                <input type="number" style={{ width: '50px' }}
                  name="amount"
                  value={futureContractsRates.amount}
                  onChange={handleContractAmountChange}
                />
              </div>}

            </div>}
          </p>}

          {currentAccount !== 'stocks' && <p style={{ fontSize: '20px' }}>
            Future contacts options
            <Checkbox
              checked={state.FutureContractOptions}
              name="FutureContractOptions"
              onChange={handleChange}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            {state.FutureContractOptions === true && <div>
              {currentAccount === 'stocks' && <div>
                Future contract options rates:
                <br />
                5-100$
                <Checkbox
                  checked={futureContractsOptionsRates._5 || false}
                  name="_5"
                  onChange={handleCFutureContractsOptionsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Options per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_5_amount"
                  value={futureContractsOptionsRates._5_amount}
                  onChange={handleOptionOnContractAmountChange}
                />
                <br />
                100-249$
                <Checkbox
                  checked={futureContractsOptionsRates._100 || false}
                  name="_100"
                  onChange={handleCFutureContractsOptionsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Options per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_100_amount"
                  value={futureContractsOptionsRates._100_amount}
                  onChange={handleOptionOnContractAmountChange}
                />
                <br />
                250-500$
                <Checkbox
                  checked={futureContractsOptionsRates._250 || false}
                  name="_250"
                  onChange={handleCFutureContractsOptionsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Options per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_250_amount"
                  value={futureContractsOptionsRates._250_amount}
                  onChange={handleOptionOnContractAmountChange}
                />
                <br />
                500-999$
                <Checkbox
                  checked={futureContractsOptionsRates._500 || false}
                  name="_500"
                  onChange={handleCFutureContractsOptionsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Options per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_500_amount"
                  value={futureContractsOptionsRates._500_amount}
                  onChange={handleOptionOnContractAmountChange}
                />
                <br />
                1000+
                <Checkbox
                  checked={futureContractsOptionsRates._1000 || false}
                  name="_1000"
                  onChange={handleCFutureContractsOptionsRatesChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                Options per trade:
                <input type="number" style={{ width: '50px' }}
                  name="_1000_amount"
                  value={futureContractsOptionsRates._1000_amount}
                  onChange={handleOptionOnContractAmountChange}
                />
                <br />
              </div>}

              {currentAccount !== 'stocks' && <div>
                Contract Options per trade:
                <input type="number" style={{ width: '50px' }}
                  name="amount"
                  value={futureContractsOptionsRates.amount}
                  onChange={handleOptionOnContractAmountChange}
                />
              </div>}


            </div>}
          </p>}
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

export default ChooseFinancialModal;