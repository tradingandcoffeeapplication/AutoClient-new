import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { useHistory } from "react-router-dom";
import './HomePage.css';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AccountDetailsTable from './AccountDetailsTable';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import ChooseSymbolsModal from './ChooseSymbolsModal';
import ChooseFinancialModal from './ChooseFinancialModal';
import RiskManagmentModal from './RiskManagmentModal';
import SetTimeModal from './SetTimeModal';
import SetStopLossModal from './SetStopLossModal';
import SetTakeProfitModal from './setTakeProfitModal'
import ExitPositionsModal from './ExitPositionsModal';
import _ from 'lodash';
import SetDoubleTheTrade from './SetDoubleTheTrade';
import socketIOClient from 'socket.io-client';
import { Accessibility } from 'accessibility';

// פונקציה שמוצאת ברייק פוינטס רספונסיביים ומחלקת אותם לקטגוריות לפי גודל המסך
function getBreakPoint(windowWidth) {
  if (windowWidth) {
    if (windowWidth < 600) {
      return "xs";
    } else if (windowWidth < 960) {
      return "sm";
    } else if (windowWidth < 1280) {
      return "md";
    } else if (windowWidth < 1920) {
      return "lg"
    } else {
      return "xl";
    }
  } else {
    return undefined;
  }
}


function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


//סטיילינג - הוקס
const useStyles = makeStyles((theme) => ({ //שימוש בסטיילינג לפי קלאסים
  root: { //סטייל לרוט דיב
    flexGrow: 1,
    height: '100%'
  },
  Button: { //סטייל לכפתורים
    flexGrow: 0.1,
  },
  title: { //סטייל לכותרות בנאב באר
    flexGrow: 0.12,
    color: 'black'
  },
  tabsRoot: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 1000,
    width: '15%',
    float: 'left'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: '100%',
    alignItems: 'center'
  },
}));

const HomePage = () => { //פונקציה דף ראשי
  const classes = useStyles(); //שימוש בסטיילינג לקלאסים
  const history = useHistory(); // ריאקט הוקס - ראוטר
  const [activeTradingStatus, setactiveTradingStatus] = useState();
  const [value, setValue] = React.useState(0);
  const [currentAccount, setCurrentAccount] = useState('stocks')
  const [activeAccount, setActiveAccount] = useState(false);
  const [sellPositions, setSellPositions] = useState(false);
  const [buyPositions, setBuyPositions] = useState(false);
  const [financialTech, setFinancialTech] = useState({});
  const [riskManagment, setRiskManagment] = useState({});
  const [times, setTimes] = useState({});
  const [stopLoss, setStopLoss] = useState({});
  const [takeProfit, setTakeProfit] = useState({});
  const [symbols, setSymbols] = useState([]);
  const [tradesPerDay, setTradesPerDay] = useState(0);
  const [stocksRates, setStocksRates] = useState({});
  const [optionsRates, setOptionsRates] = useState({});
  const [futureContractsRates, setFutureContractsRatesRates] = useState({});
  const [futureContractsOptionsRates, setFutureContractsOptionsRatesRates] = useState({});
  const [userFirstName, setUserFirstName] = useState('Guest'); //סטייט של שם המשתמש
  const [userPremission, setUserPremission] = useState(''); //סטייט של הראשות משתמש
  const [userCredits, setUserCredits] = useState(0); //סטייט של קרדיט שיש למשתמש
  const [userEmail, setUserEmail] = useState(''); //סטייט אימייל של המשתמש
  const [doubleTheTradeValues, setDoubleTheTradeValues] = useState({ Stocks: false, Options: false });
  const isWindowClient = typeof window === "object";
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [windowSize, setWindowSize] = useState(
    isWindowClient
      ? getBreakPoint(window.innerWidth) //👈
      : undefined
  );
  const [openExitModal, setOpenExitModal] = React.useState(false);
  const [data, setData] = useState('');
  const [startingAmount, setStartingAmount] = useState(0);


  const changeStartingAmount = async (newAmount) => {
      setStartingAmount(newAmount);
      await axios.post('http://localhost:4455/positions/extractPositionsDetails', {
        user: userEmail
    });
  }
  

  const getReportDetails = async (value) => {
    setStartingAmount(value);
    await changeStartingAmount(value);
    await axios.post('http://localhost:4455/positions/extractPositionsDetails', {
        user: userEmail
    });
}

  const sendReport = async (positions, amount) => {
    console.log(positions)
    let tempPositions = [
        {
            exchange:"GLOBEX",
            operation:"BUY",
            positionType:"futureContract",
            symbol:"ES",
            startDate:"2022-09-13 11:54",
            endDate:"2022-09-13 11:55",
            startPrice:4159.0,
            endPrice:4154.25,
            succeeded:false,
            pipsed:-4.75,
            quantity:10,
            currentAccountBalance: 5145,
            stopLoss:4157.375,
            takeProfit:[
              {
                date:"2022-09-13 11:55",
                marketPrice:4154.25,
                quantity:10
              }
            ],
            stoplossUsed:false,
            totalBrokerFee:0
          },
          {
            exchange:"GLOBEX",
            operation:"SELL",
            positionType:"futureContract",
            symbol:"XL",
            startDate:"2022-09-13 12:54",
            endDate:"2022-09-13 15:55",
            startPrice:2342.0,
            endPrice:2555.25,
            succeeded:true,
            pipsed: 4.75,
            quantity:15,
            currentAccountBalance: 5245,
            stopLoss:4157.375,
            takeProfit:[
              {
                date:"2022-09-13 11:55",
                marketPrice:4154.25,
                quantity:15
              },
              {
                date:"2022-09-13 11:55",
                marketPrice:4154.25,
                quantity:25
              },
              {
                date:"2022-09-13 11:55",
                marketPrice:4154.25,
                quantity:35
              }
            ],
            stoplossUsed:true,
            totalBrokerFee: 0
          },
          {
            exchange:"GLOBEX",
            operation:"BUY",
            positionType:"futureContract",
            symbol:"ES",
            startDate:"2022-09-13 11:54",
            endDate:"2022-09-13 11:55",
            startPrice:4159.0,
            endPrice:4154.25,
            succeeded:false,
            pipsed:-4.75,
            quantity:10,
            currentAccountBalance:"None",
            stopLoss:4157.375,
            takeProfit:[
              {
                date:"2022-09-13 11:55",
                marketPrice:4154.25,
                quantity:10
              }
            ],
            stoplossUsed:false,
            totalBrokerFee:0
          },
      ];
    alertify.success(`a report was sent to ${userEmail}. the proccess might take a few minutes`);
    await axios.post(`/reports/createReport`, {
        positions: positions,
        userEmail: userEmail,
        amount: amount
    });
}

  useEffect(() => {
    const socket = socketIOClient('http://localhost:3007',
      {
        cors: {
          origin: "http://localhost:3007",
          methods: ["GET", "POST"]
        },
        query: {
          email: userEmail
        }
      });
      
    socket.on("message", data => {
      console.log(data);
      setData(data);
    });
    socket.on("SendUserPositions", data => {
      console.log({positions:data});
      sendReport(data, startingAmount);
    });
    socket.on("CloseAllPositionFailed", data => {
      alertify.alert("failed to close all the active positions. please try again.")
    })
    socket.on("PositionCloseFailed", data => {
      alertify.alert("failed to close the position. plese try again.")
    })
  }, [userEmail, startingAmount])

  useEffect(() => {
    //הנדלר שנקרא ברגע שיש שינוי בגודל המסך
    function setSize() {
      setWindowSize(getBreakPoint(window.innerWidth)); //👈
    }
    window.addEventListener('load', function() { new Accessibility(); }, false);
    if (isWindowClient) {
      //register the window resize listener
      window.addEventListener("resize", setSize);

      //unregister the listerner on destroy of the hook
      return () => window.removeEventListener("resize", setSize);
    }
  }, [isWindowClient, setWindowSize]);

  const HandleLogout = async (e) => { //פונקציה שמנתקת את המשתמש
    await axios.get('/auth/logout'); // API שמנתק את המשתמש
    window.location.reload() //רענון של הדף
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAccountChange = (value) => {
    if (userFirstName !== 'Guest') {
      setCurrentAccount(value)
    } else {
      alertify.alert('Unsigned User', 'login to change account');
    }
  }


  const handleactiveAccount = (event) => {
    if (event.target.checked) {
      setActiveAccount(true);
      alertify.success(`Changes set. click on save changes to save them`);
    }
    else {
      setActiveAccount(false);
      alertify.success(`Changes set. click on save changes to save them`);

    }
  };

  const handleGetSellPositions = (event) => {
    if (event.target.checked) {
      setSellPositions(true);
      alertify.success(`Changes set. click on save changes to save them`);
    }
    else {
      setSellPositions(false);
      alertify.success(`Changes set. click on save changes to save them`);
    }
  };

  const handleGetBuyPositions = (event) => {
    if (event.target.checked) {
      setBuyPositions(true);
      alertify.success(`Changes set. click on save changes to save them`);

    }
    else {
      setBuyPositions(false);
      alertify.success(`Changes set. click on save changes to save them`);
    }
  };

  const handleTradePerDayChange = (value) => {
    setTradesPerDay(Number(value));
    alertify.success(`Changes set. click on save changes to save them`);
  }

  const handleSetRates = (values) => {
    setStocksRates(values[0]);
    setOptionsRates(values[1]);
    setFutureContractsRatesRates(values[2]);
    setFutureContractsOptionsRatesRates(values[3]);
  }

  const handlePaymentRoute = () => {
    if (userFirstName === 'Guest') {
      alertify.alert('Unsigned User', 'Login to use this button');
    } else {
      history.push('/payment')
    }
  }

  const saveChanges = async () => {
    try {
      if (userFirstName !== 'Guest') {
        const rates = {
          stocks: stocksRates,
          options: optionsRates,
          futureContracts: futureContractsRates,
          futureContractOptions: futureContractsOptionsRates
        }
        await axios.post('/usersSetup/setSetup', {
          userEmail,
          currentAccount,
          activeAccount,
          sellPositions,
          buyPositions,
          financialTechnology: financialTech,
          stopLoss,
          riskManagment,
          times,
          symbols,
          rates,
          takeProfit,
          tradesPerDay,
          doubleTheTradeValues
        }).then(() => {
          alertify.alert('Your changes has been saved successfully');
        });
      } else {
        alertify.alert('Unsigned User', 'Login to use this button');
      }
    } catch (err) {
      console.log(err);
    };
  };

  const ChangeactiveTradingStatus = async (tradingStatus) => {
    try {
      setactiveTradingStatus(tradingStatus);
      axios.post('/usersSetup/changeTradingStatus', {
        userEmail: userEmail,
        tradingStatus: !tradingStatus
      })

    } catch (err) {
      console.log(err);
      alertify.alert('Something went wrong', 'Something went wrong while trying to change trading status')
    }
  }

  const unSavedChangesFlag = async (flag) => {
    setUnsavedChanges(flag);
    console.log(unsavedChanges)

  }

  const closeAllActivePositions = async () => {
    axios.post('http://localhost:4455/positions/closeAllPositions', {
        user: userEmail
    })
  }

  useEffect(async () => { //בעלייה הראשונה של הדף
    const userDetails = await axios.get('/auth/userDetails'); //בודק אם המשתמש מחובר ואם כן מביא את הפרטים שלו
    if (userDetails.data) { //אם המשתמש מחובר
      const userCredits = await axios.get(`/auth/getUserById/${userDetails.data._id}`); //בודק כמה קרדיטים יש למשתמש 
      setUserPremission(userDetails.data.isAdmin); //מציג את ההרשאות של המשתמש
      setUserCredits(userCredits.data.credits); //מציג את כמות הקרדיט של המשתמש לפי הדאטאבייס
      setUserEmail(userDetails.data.email); //מציג את האימייל של המשתמש
      setUserFirstName(userDetails.data.firstName); //מציג את השם הפרטי של המשתמש
    }
    if (userFirstName !== 'Guest') {
      const { data } = await axios.get(`/usersSetup/getSetup/${userDetails.data.email}`);
      setActiveAccount(data[currentAccount].activeAccount);
      setBuyPositions(data[currentAccount].buyPositions);
      setSellPositions(data[currentAccount].sellPositions);
      setFinancialTech(data[currentAccount].financialTechnology);
      setRiskManagment(data[currentAccount].riskManagment);
      setTimes(data[currentAccount].times);
      setStopLoss(data[currentAccount].stopLoss);
      setTakeProfit(data[currentAccount].takeProfit);
      setStocksRates(data[currentAccount].rates.stocks);
      setOptionsRates(data[currentAccount].rates.options);
      setFutureContractsRatesRates(data[currentAccount].rates.futureContracts);
      setFutureContractsOptionsRatesRates(data[currentAccount].rates.futureContractOptions);
      setTradesPerDay(data[currentAccount].tradesPerDay);
      setDoubleTheTradeValues(data.doubleTheTradeValues);
    }
  }, [userFirstName]);

  useEffect(async () => { //בעלייה הראשונה של הדף
    if (userEmail.length > 0) {
      const { data } = await axios.get(`/usersSetup/getSetup/${userEmail}`);
      setActiveAccount(data[currentAccount].activeAccount);
      setBuyPositions(data[currentAccount].buyPositions);
      setSellPositions(data[currentAccount].sellPositions);
      setFinancialTech(data[currentAccount].financialTechnology);
      setRiskManagment(data[currentAccount].riskManagment);
      setTimes(data[currentAccount].times);
      setStopLoss(data[currentAccount].stopLoss);
      setTakeProfit(data[currentAccount].takeProfit);
      setStocksRates(data[currentAccount].rates.stocks);
      setOptionsRates(data[currentAccount].rates.options);
      setFutureContractsRatesRates(data[currentAccount].rates.futureContracts);
      setFutureContractsOptionsRatesRates(data[currentAccount].rates.futureContractOptions);
      setTradesPerDay(data[currentAccount].tradesPerDay);
      setDoubleTheTradeValues(data.doubleTheTradeValues);
    }
  }, [currentAccount]);

  useEffect(async () => {
    const tradingStatus = await axios.get(`/usersSetup/getTradingStatus/${userEmail}`);
    setactiveTradingStatus(tradingStatus.data);
  }, [userEmail])

  return (
    <div className={classes.root}>
      <AppBar
        position="relative"
        style={{
          top: 0, height: '170px', margin: 'auto', paddingTop: '45px', backgroundImage: 'url("main-img.jpg")', zIndex: '10',
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover'
        }}
      >
        <Toolbar>
          <Grid container alignItems="center" justifyContent="flex-start" spacing={1}>

            {windowSize !== 'xs' && <Grid item xs={5} sm={2}>
              <img
                src={'/Logo.jpg'}
                style={{
                  width: '215px', position: 'relative', bottom: '21px', left: '10px'
                }}
              />
            </Grid>}

            {userFirstName === 'Guest' && windowSize !== 'xs' && <Grid item xs={5} sm={1}>
              <Typography variant="h5" className={classes.title} style={{ color: 'black', fontSize: '28px', position: 'relative', bottom: '20px', left: '40px' }}>
                Hello Guest
              </Typography>
            </Grid>}

            {userFirstName === 'Guest' && <Grid item xs={5} sm={1}>
              <Typography variant="h5" className={classes.title} style={{ color: 'black', fontSize: '28px' }}>
              </Typography>
            </Grid>}

            {userFirstName === 'Guest' && windowSize === 'xs' && <Grid item xs={5} sm={1}>
              <Typography variant="h5" className={classes.title} style={{ color: 'black', position: 'relative', bottom: '20px', left: '40px' }}>
                Hello Guest
              </Typography>
            </Grid>}

            {userFirstName !== 'Guest' && <Grid item xs={5} sm={2} style={{ position: 'relative', bottom: '20px', left: '40px' }} >
              <Typography variant="h5" className={classes.title} style={{ color: 'black', fontSize: '28px' }}>
                Hello {userFirstName}
              </Typography>
            </Grid>}

            <Paper square
              style={{ position: 'relative', right: '30px', opacity: '90%', bottom: '20px', width: '65%' }}
            >
              <Tabs
                variant="fullWidth"
                value={5}
                style={{ backgroundColor: 'lightgrey', height: '60px', color: 'black' }}
              >
                {activeTradingStatus === false && <Tab label="Start Trading"
                  style={{ height: '60px', backgroundColor: 'green', fontSize: '17px', color: 'white' }}
                  onClick={() => {
                    if (userFirstName !== 'Guest') {
                      if (unsavedChanges === false) {
                        ChangeactiveTradingStatus(true);
                      } else {
                        alertify.confirm('Unsaved Changes', 'You have unsaved changes, would you like to continue without saving?', function () {
                          alertify.success('Changes Saved');
                          saveChanges();
                        }
                          , function () {
                            alertify.error('Changes were not saved');
                          });
                        setUnsavedChanges(false);
                      }
                    }
                    else {
                      alertify.alert('Unsigned User', 'Login to use this button');
                    }
                  }}
                />}

                {activeTradingStatus === true && <Tab label="Stop Trading"
                  style={{ height: '60px', backgroundColor: 'red', fontSize: '17px', color: 'white' }}
                  onClick={() => ChangeactiveTradingStatus(false)}
                />}


                <Tab label="Close All positions"
                  onClick={() => userFirstName !== 'Guest' ? closeAllActivePositions() : alertify.alert('Unsigned User', 'Login to use this button')}
                  style={{ height: '60px', backgroundColor: 'white', color: 'black', fontSize: '17px', border: '1px solid black' }}
                />

                <Tab label="Close specific positions"
                  onClick={() => userFirstName !== 'Guest' ? setOpenExitModal(true) : alertify.alert('Unsigned User', 'Login to use this button')}
                  style={{ height: '60px', backgroundColor: 'white', color: 'black', fontSize: '14px', border: '1px solid black' }}
                />

                <Tab label="Buy more credits"
                  onClick={() => handlePaymentRoute()}

                  style={{ height: '60px', backgroundColor: 'white', color: 'black', fontSize: '17px', border: '1px solid black' }}
                />

                <Tab label="Contact us"
                  onClick={() => history.push('/contact')}

                  style={{ height: '60px', backgroundColor: 'white', color: 'black', fontSize: '17px', border: '1px solid black' }}
                />

                {userFirstName !== 'Guest' && <Tab label="Logout"
                  onClick={() => HandleLogout()}
                  style={{ height: '60px', backgroundColor: 'red', fontSize: '17px', color: 'white' }}
                />}
                {userFirstName === 'Guest' && <Tab label="Login"
                  onClick={() => history.push('/login')}
                  style={{ height: '60px', backgroundColor: 'green', fontSize: '17px', color: 'white' }}
                />}
                {userFirstName === 'Guest' && <Tab label="Register"
                  onClick={() => history.push('/register')}
                  style={{ height: '60px', backgroundColor: 'red', fontSize: '17px', color: 'white' }}
                />}

              </Tabs>
            </Paper>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.tabsRoot}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab onClick={() => handleAccountChange('stocks')} label="Stocks Account" {...a11yProps(0)} style={{ height: '100px', width: '100%', fontSize: '20px' }} />
          {/* <Tab onClick={() => handleAccountChange('bonds')} label="Bonds Account" {...a11yProps(1)} style={{ height: '100px', fontSize: '20px' }} /> */}
          <Tab onClick={() => handleAccountChange('comodity')} label="Commodity Account" {...a11yProps(2)} style={{ height: '100px', fontSize: '20px' }} />
          {/* <Tab onClick={() => handleAccountChange('currencyPairs')} label="Currency pairs Account" {...a11yProps(3)} style={{ height: '100px', fontSize: '20px' }} />
          <Tab onClick={() => handleAccountChange('crypto')} label="Crypto Account" {...a11yProps(4)} style={{ height: '100px', fontSize: '20px' }} /> */}
          <Tab onClick={() => handleAccountChange('indexes')} label="Indexes Account" {...a11yProps(5)} style={{ height: '100px', fontSize: '20px' }} />
          <Button variant="contained" color="secondary" style={{ height: '80px', fontSize: '20px' }}> Download Gateway</Button>
        </Tabs>
      </div>
      <div style={{ width: '85%', float: 'right', height: '78vh', alignItems: 'center', textAlign: 'center' }}>
        <h2 style={{ display: 'inline', position: 'relative', top: '80px', right: '30px' }}>
          Auto Trader Status:
          {activeTradingStatus === false && <span style={{ marginLeft: '10px', color: 'red' }}> Not Active
            {activeTradingStatus} <FiberManualRecordIcon style={{ color: 'red', position: 'relative', top: '7px' }} />
          </span>}
          {activeTradingStatus === true && <span style={{ marginLeft: '10px', color: 'green' }}> Active
            {activeTradingStatus} <FiberManualRecordIcon style={{ color: 'green', position: 'relative', top: '7px' }} />
          </span>}
        </h2>
        <AccountDetailsTable userEmail={userEmail} currentAccount={currentAccount} changeStartingAmount={changeStartingAmount}/>
        <div
          style={{
            height: '70%', position: 'relative', top: '200px', alignItems: 'center'
          }}>
          <span style={{ fontSize: '20px', position: 'relative', right: '200px' }}>
            Activate {currentAccount} account
            <Switch
              checked={activeAccount}
              onChange={handleactiveAccount}
              name="Activate"
              color="primary"
            />
          </span>
          <span style={{ fontSize: '20px', position: 'relative', right: '440px', top: '70px' }}>
            Get Sell Positions
            <Switch
              checked={sellPositions}
              onChange={handleGetSellPositions}
              name="SellPositions"
              color="primary"
            />
          </span>
          <span style={{ fontSize: '20px', position: 'relative', right: '650px', top: '140px' }}>
            Get Buy Positions
            <Switch
              checked={buyPositions}
              onChange={handleGetBuyPositions}
              name="BuyPositions"
              color="primary"
            />
          </span>
          <br />
          <br />
          <br />
          <ChooseSymbolsModal
            currentAccount={currentAccount}
            userEmail={userEmail}
            setUserSymbols={(symbols) => setSymbols(symbols)}
            financialTech={financialTech}
            unSavedChangesFlag={(flag) => unSavedChangesFlag(flag)}
          />
          <ChooseFinancialModal
            currentAccount={currentAccount}
            setFinancialTech={(values) => setFinancialTech(values)}
            setRates={(values) => handleSetRates(values)}
            defaults={financialTech}
            unSavedChangesFlag={(flag) => unSavedChangesFlag(flag)}
            defaultRates={[stocksRates, optionsRates, futureContractsRates, futureContractsOptionsRates]}
          />
          <RiskManagmentModal
            currentAccount={currentAccount}
            setRiskManagment={(values) => setRiskManagment(values)}
            defaults={riskManagment}
            unSavedChangesFlag={(flag) => unSavedChangesFlag(flag)}

          />
          <SetTimeModal
            currentAccount={currentAccount}
            setTimes={(values) => setTimes(values)}
            defaults={times}
            unSavedChangesFlag={(flag) => unSavedChangesFlag(flag)}

          />
          {/* <SetStopLossModal
            currentAccount={currentAccount}
            setStopLoss={(values) => setStopLoss(values)}
            defaults={stopLoss}
            unSavedChangesFlag={(flag) => unSavedChangesFlag(flag)}

          /> */}
          {/* <SetDoubleTheTrade
            currentAccount={currentAccount}
            unSavedChangesFlag={(flag) => unSavedChangesFlag(flag)}
            setDoubleTheTradeValues={(value) => setDoubleTheTradeValues(value)}
            defaults={doubleTheTradeValues}
          /> */}

          <ExitPositionsModal
            currentAccount={currentAccount}
            open={openExitModal}
            setOpen={(value) => setOpenExitModal(value)}
            userEmail={userEmail}
          />
          <SetTakeProfitModal
            currentAccount={currentAccount}
            setTakeProfit={(values) => setTakeProfit(values)}
            defaults={takeProfit}
            unSavedChangesFlag={(flag) => unSavedChangesFlag(flag)}

          />
          <br />
          <span style={{ fontSize: '20px', position: 'relative', right: '420px', bottom: '80px' }}>
            Amount of trades per day (1-20)
            <input type="number" style={{ width: '50px' }} min="0" max="20"
              value={tradesPerDay}
              onChange={({ target }) => handleTradePerDayChange(target.value)}
            />
          </span>
          <br />

          <Button variant="contained" color="secondary" style={{ position: 'relative', bottom: '110px', width: '300px' }}
            onClick={() => saveChanges()}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )

}

export default HomePage;
