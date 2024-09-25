import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SearchBar from "material-ui-search-bar";
import axios from 'axios';
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, stocks, options, contract, optionOnContract) {
  return { name, stocks, options, contract, optionOnContract };
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  table: {
    minWidth: 300,
  },
}));

const ChooseSymbolsModal = ({ currentAccount, userEmail, setUserSymbols, financialTech, unSavedChangesFlag }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [searched, setSearched] = useState("");
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const confirmChanges = () => {
    setUserSymbols(rows);
    unSavedChangesFlag(true)
    setOpen(false);
  }

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const stockChanged = (symbol, value) => {
    const newRows = rows;
    newRows.map((row) => {
      if (row.name === symbol) {
        row.stocks = value;
      }
    })
    if (newRows.length > 0) {
      setRows(newRows);
    }
  }

  const optionChanged = (symbol, value) => {
    const newRows = rows;
    newRows.map((row) => {
      if (row.name === symbol) {
        row.options = value;
      }
    })
    if (newRows.length > 0) {
      setRows(newRows);
    }
  }

  const contractChanged = (symbol, value) => {
    const newRows = rows;
    newRows.map((row) => {
      if (row.name === symbol) {
        row.contract = value;
      }
    })
    if (newRows.length > 0) {
      setRows(newRows);
    }
  }

  const optionOnContractChanged = (symbol, value) => {
    const newRows = rows;
    newRows.map((row) => {
      if (row.name === symbol) {
        row.optionOnContract = value;
      }
    })
    if (newRows.length > 0) {
      setRows(newRows);
    }
  };

  const requestSearch = (searchedVal) => {
    // let filteredRows = originalRows.filter((row) => {
    //   return row.name.toLowerCase().startsWith(searchedVal.toLowerCase());
    // });
    // if (searchedVal.length === 0) {
    //   const emptyData = createData('name', 'stocks', 'options', 'contract', 'optionOnContract')
    //   setRows([emptyData]);
    // } else {
    //   setRows(filteredRows);
    // }
  };

  useEffect(async () => {
    if (userEmail.length > 0) {
      // const { data } = await axios.get(`/usersSymbols/getSymbols/${userEmail}`);
      const data = [{ stocks: ["_E.ON"], comodity: ["_E.ON"],  indexes: ["_E.ON"] }]
      let dataRows = []
      console.log(currentAccount, data[0])
      const accountData = data[0][currentAccount]
      accountData.map((row) => {
        console.log(Object.values(row))
        dataRows.push(createData(Object.values(row)[0], Object.values(row)[1], Object.values(row)[2], Object.values(row)[3], Object.values(row)[4]))
      });
      setOriginalRows(dataRows);
      setRows(dataRows)
      console.log(dataRows)
    }
  }, [userEmail, currentAccount])


  return (
    <div id="modalsContainer">
      <Button id="changeBalanceModal" variant="contained" color="primary" style={{ position: 'relative', center: '10px', width: '300px', top: '20px' }}
        onClick={handleClickOpen}
      >
        Choose {currentAccount} symbols
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ textAlign: 'center' }}
        ><h3>
            Choose {currentAccount} symbols
          </h3></DialogTitle>
        <DialogContent>
          <p style={{ fontSize: '20px' }}>
            You can search for specific symbols you would like to find
          </p>

          <br />
          <SearchBar
            value={searched}
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
          />
          <TableContainer component={Paper} style={{ width: '540px' }}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Symbols</StyledTableCell>
                  {financialTech.Stocks && <StyledTableCell align="center">Stocks</StyledTableCell>}
                  {financialTech.Options && <StyledTableCell align="center">Options</StyledTableCell>}
                  {financialTech.FutureContract && <StyledTableCell align="center">Future contracts</StyledTableCell>}
                  {financialTech.FutureContractOptions && <StyledTableCell align="center">Options on futre contracts </StyledTableCell>}
                  <StyledTableCell align="center">Margin</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    {financialTech.Stocks && <StyledTableCell align="center">
                      <input
                        type="checkbox"
                        defaultChecked={row.stocks}
                        name={row.name}
                        onClick={({ target }) => stockChanged(target.name, target.checked)} />
                    </StyledTableCell>}
                    {financialTech.Options && <StyledTableCell align="center">
                      <input
                        type="checkbox"
                        defaultChecked={row.options}
                        name={row.name}
                        onClick={({ target }) => optionChanged(target.name, target.checked)} />
                    </StyledTableCell>}
                    {financialTech.FutureContract && <StyledTableCell align="center">
                      <input
                        type="checkbox"
                        defaultChecked={row.contract}
                        name={row.name}
                        onClick={({ target }) => contractChanged(target.name, target.checked)} />
                    </StyledTableCell>}
                    {financialTech.FutureContractOptions && <StyledTableCell align="center">
                      <input
                        type="checkbox"
                        defaultChecked={row.optionOnContract}
                        name={row.name}
                        onClick={({ target }) => optionOnContractChanged(target.name, target.checked)} />
                    </StyledTableCell>}
                    <StyledTableCell align="center">0</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmChanges} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );


}

export default ChooseSymbolsModal;