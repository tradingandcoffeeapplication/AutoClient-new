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
import axios from 'axios';


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

const RiskManagmentModal = ({ currentAccount, open, setOpen, userEmail }) => {
    const classes = useStyles();
    const [positions, setPositions] = React.useState([]);
    const [positionsToClose, setPositionsToClose] = React.useState([]);

    const handleClose = () => {
        setOpen(false);
        alertify.error('Changes canceled')
    };

    const confirmAndClose = () => {
        setOpen(false);
        positionsToClose.map((position) => {
            axios.post('http://localhost:4455/positions/closeSpecificPosition', {
                user: userEmail, 
                IB_ID: position.IB_ID
            })
        })
        alertify.success(`Closing the chosen positions`);
    };

    const addOrRemovePositions = (IB_ID) => {
        const filter = positionsToClose.find((position) => position.IB_ID === IB_ID);
        if (!filter) {
            setPositionsToClose([...positionsToClose, {IB_ID}]);
        } else {
            setPositionsToClose(positionsToClose.filter((position) => position.IB_ID !== IB_ID));
        }
    }

    useEffect(async () => {
        if (userEmail.length > 0 && open === true) {
            const { data } = await axios.get(`/positions/getUserActivePositions/${userEmail}`); // API שמביא את הפוזיציות של המשתמש
            setPositions(data);
            // OLD CODE
            // const stocks = data[0].stocks.filter((position) => position.active === true).map(({ id }) => id);
            // const bonds = data[0].bonds.filter((position) => position.active === true).map(({ id }) => id);
            // const comodity = data[0].comodity.filter((position) => position.active === true).map(({ id }) => id);
            // const currencyPairs = data[0].currencyPairs.filter((position) => position.active === true).map(({ id }) => id);
            // const indexes = data[0].indexes.filter((position) => position.active === true).map(({ id }) => id);
            // const activePositions = [];
            // for (let i = 0; i < stocks.length; i++) {
            //     let stocksPositions = await axios.get(`/positions/getstock/${stocks[i]}`);
            //     stocksPositions.data[0].positionType = 'stocks'
            //     activePositions.push(stocksPositions.data[0]);
            // }
            // for (let i = 0; i < bonds.length; i++) {
            //     let bondsPositions = await axios.get(`/positions/getbond/${bonds[i]}`);
            //     bondsPositions.data[0].positionType = 'bonds'
            //     activePositions.push(bondsPositions.data[0]);
            // }
            // for (let i = 0; i < comodity.length; i++) {
            //     let comodityPositions = await axios.get(`/positions/getcomodity/${comodity[i]}`);
            //     comodityPositions.data[0].positionType = 'comodity'
            //     activePositions.push(comodityPositions.data[0]);
            // }
            // for (let i = 0; i < currencyPairs.length; i++) {
            //     let currencyPairsPositions = await axios.get(`/positions/getCurrencyPair/${currencyPairs[i]}`);
            //     currencyPairsPositions.data[0].positionType = 'pairs'
            //     activePositions.push(currencyPairsPositions.data[0]);
            // }
            // for (let i = 0; i < indexes.length; i++) {
            //     let indexesPositions = await axios.get(`/positions/getrest/${indexes[i]}`);
            //     indexesPositions.data[0].positionType = 'indexes'
            //     activePositions.push(indexesPositions.data[0]);
            // }
        }
    }, [open]);



    return (
        <div id="modalsContainer">
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle><h3 style={{ textAlign: 'center' }}> Close specific positions </h3></DialogTitle>
                <DialogContent style={{ textAlign: 'center' }}>
                    <h3>choose the symbols you would like to stop trading on and click "close positions" to exit them</h3>
                    {positions && positions.map((position) => {
                        return <p style={{ fontSize: '20px' }}>
                            symbol: {position.symbol} technology: {position.technologies} price: {position.startPrice}$ operation: {position.operation}
                            <Checkbox
                                //   checked={state.useSystemStopLoss}
                                onClick={(event) => addOrRemovePositions(event.target.name)}
                                name={position.IB_ID}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        </p>
                    })}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button color="primary"
                        onClick={() => confirmAndClose()}
                    >
                        Exit Positions
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );


}

export default RiskManagmentModal;