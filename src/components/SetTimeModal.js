import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    TimePicker
} from '@material-ui/pickers';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import _ from 'lodash'



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

const names = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, tradingDays, theme) {
    return {
        fontWeight:
            tradingDays.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}


const SetTimeModal = ({ currentAccount, setTimes, defaults, unSavedChangesFlag}) => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState(_.omit(defaults, ['TradingDays', 'TradingHours']));
    const [tradingDays, setTradingDays] = React.useState([]);
    const [selectFromHour, setSelectFromHour] = React.useState();
    const [selectUntilHour, setSelectUntilHour] = React.useState();

    useEffect(() => {
        setState(_.omit(defaults, ['TradingDays', 'TradingHours']));
        if (defaults.TradingDays) {
            setTradingDays(_.pick(defaults, ['TradingDays']).TradingDays);
        }
        if (defaults.TradingHours) {
            setSelectFromHour(_.pick(defaults, ['TradingHours']).TradingHours[0]);
            setSelectUntilHour(_.pick(defaults, ['TradingHours']).TradingHours[1]);
        }
    }, [defaults]);

    const handleFromHourChange = (date) => {
        setSelectFromHour(date);
    };

    const handleUntilHourChange = (date) => {
        setSelectUntilHour(date);
    };

    const handleDayChange = (event) => {
        setTradingDays(event.target.value);
    };

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
        setOpen(false);
        unSavedChangesFlag(true);
        if (!selectFromHour || !selectUntilHour) {
            setTimes({
                SpecificDays: state.SpecificDays,
                SpecificHours: state.SpecificHours,
                TradingDays: tradingDays,
                TradingHours: []
            });
            alertify.success(`Changes set. click on save changes to save them`);
        } else {
            setTimes({
                SpecificDays: state.SpecificDays,
                SpecificHours: state.SpecificHours,
                TradingDays: tradingDays,
                TradingHours: [selectFromHour, selectUntilHour]
            })
            alertify.success(`Changes set. click on save changes to save them`);
        };
    };
    //.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")

    const setDaysInput = state.SpecificHours
        ?
        null
        :
        <p>
            if not please choose on which specific days you would like to trade
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-chip-label">Weeksdays</InputLabel>
                <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    multiple
                    value={tradingDays}
                    onChange={handleDayChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={(selected) => (
                        <div className={classes.chips}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} className={classes.chip} />
                            ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                >
                    {names.map((name) => (
                        <MenuItem key={name} value={name} style={getStyles(name, tradingDays, theme)}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </p>;

    const setDollarsInput = state.SpecificDays
        ?
        null
        :
        <div>
            <p>
                If not, please select specific trading hours
            </p>
            <MuiPickersUtilsProvider utils={DateFnsUtils}
                format="HH:mm"
            >
                <TimePicker
                    margin="normal"
                    id="time-picker"
                    label="From"
                    value={selectFromHour}
                    onChange={(event) => handleFromHourChange(event)}
                    KeyboardButtonProps={{
                        'aria-label': 'change time',
                    }}
                />
                <TimePicker
                    margin="normal"
                    id="time-picker"
                    label="Until"
                    value={selectUntilHour}
                    onChange={(event) => handleUntilHourChange(event)}
                    style={{
                        position: 'relative',
                        left: '20px'
                    }}
                    KeyboardButtonProps={{
                        'aria-label': 'change time',
                    }}
                />
            </MuiPickersUtilsProvider>
        </div>
        ;

    return (
        <div id="modalsContainer">
            <Button id="changeBalanceModal" variant="contained" color="primary"
                style={{ position: 'relative', left: '440px', top: '15px', width: '300px'  }}
                onClick={handleClickOpen}
            >
                Set Trading days and hours
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle><h3 style={{ textAlign: 'center' }}>Set Your {currentAccount} Trading days and hours</h3></DialogTitle>
                <DialogContent style={{ textAlign: 'center' }}>
                    <h3 style={{ position: 'relative', bottom: '20px' }}>

                    </h3>
                    <p style={{ fontSize: '20px' }}>
                        Would You like to trade every day of the week?
                        <Checkbox
                            checked={state.SpecificHours}
                            name="SpecificHours"
                            onChange={handleChange}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </p>
                    {setDaysInput}
                    <p style={{ fontSize: '20px' }}>
                        Would You like to trade whenever the market is open?
                        <Checkbox
                            checked={state.SpecificDays}
                            name="SpecificDays"
                            onChange={handleChange}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </p>
                    {setDollarsInput}
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

export default SetTimeModal;