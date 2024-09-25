import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button'
import io from "socket.io-client";
import axios from 'axios';
import _ from 'lodash';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css'
import socketIOClient from 'socket.io-client';


const AccountDetailsTable = ({ currentAccount, userEmail, changeStartingAmount }) => {
    const [info, setInfo] = useState({
        investedBalance: { credits: 0, dollars: 0 },
        currentBalance: { credits: 0, dollars: 0 },
        profitLoss: { credits: 0, dollars: 0 },
        tradesAmount: { buy: 0, sell: 0 },
    });
    const [gatewayStatus, setGatewayStatus] = useState();
    const [TwsStatus, setTwsStatus] = useState();
    const [userType, setUserType] = useState();
    const [startingAmount, setStartingAmount] = useState();

    const handleTrackRecordChange = () => {
        alertify.prompt('Set your starting capital', 'What was your capital when you first started using the system signals? ($)', '0'
            , function (evt, value) { getReportDetails(value) }
            , function () { alertify.error('Cancel') });
    }

    const getReportDetails = async (value) => {
        setStartingAmount(value);
        changeStartingAmount(value);
    }

    const DeleteUserPositions = async () => {
        await axios.post('http://localhost:4455/positions/deletePositions', {
            user: userEmail
        });
        alertify.success('Positions deleted')
    }

    const handleDeletePositions = async () => {
        alertify.confirm('delete your positions track', 'Are you sure you want to delete the records of all your existing positions?', function () {DeleteUserPositions()}
            , function () { alertify.error('Canceled') });
    }

    useEffect(() => {
        const socket = socketIOClient('http://localhost:3007',
            {
                cors: {
                    origin: "http://localhost:3007",
                    methods: ["GET", "POST"]
                },
            });


        socket.on('mongoStream', (data) => {
            console.log(data)
            if (
                data.ns.coll === 'AutoUsersInfo' &&
                Object.keys(data.updateDescription.updatedFields)[0] === 'gatewayStatus'
            ) {
                setGatewayStatus(data.updateDescription.updatedFields.gatewayStatus);
            }
            if (
                data.ns.coll === 'AutoUsersInfo' &&
                Object.keys(data.updateDescription.updatedFields)[0] === 'twsStatus'
            ) {
                setTwsStatus(data.updateDescription.updatedFields.twsStatus);
            }
            if (
                data.ns.coll === 'AutoUsersInfo' &&
                Object.keys(data.updateDescription.updatedFields)[0] === 'userType'
            ) {
                setUserType(data.updateDescription.updatedFields.userType);
            }

            if (
                data.ns.coll === 'AutoUsersInfo' &&
                Object.keys(data.updateDescription.updatedFields)[0].includes(currentAccount)
            ) {
                console.log(data.fullDocument[currentAccount])
                setInfo(data.fullDocument[currentAccount]);
            }
        });
    }, [userEmail]);

    useEffect(async () => {
        if (userEmail.length > 0) {
            const { data } = await axios.get(`/usersInfo/getUserInfo/${userEmail}`);
            setInfo(data[currentAccount]);
            setGatewayStatus(data.gatewayStatus);
            setTwsStatus(data.twsStatus);
            setUserType(data.userType);
        }
    }, [userEmail]);

    useEffect(async () => {
        if (userEmail) {
            const { data } = await axios.get(`/usersInfo/getUserInfo/${userEmail}`);
            setInfo(data[currentAccount]);
            await axios.post('http://localhost:4455/positions/extractPositionsDetails', {
                user: userEmail
            });
        }
    }, [currentAccount]);

    return (
        <div>
            <h2 style={{ display: 'inline', position: 'relative', right: '350px', top: '50px' }}>
                Gateway Status:
                {gatewayStatus === false && <span style={{ marginLeft: '10px', color: 'red' }}>
                    Dissconnected <FiberManualRecordIcon style={{ color: 'red', position: 'relative', top: '5px' }} />
                </span>}
                {gatewayStatus === true && <span style={{ marginLeft: '10px', color: 'green' }}>
                    Connected <FiberManualRecordIcon style={{ color: 'green', position: 'relative', top: '5px' }} />
                </span>}
            </h2>

            <h2 style={{ display: 'inline', position: 'relative', top: '50px', left: '170px' }}>
                User type:
                {userType === 'Simulation' && <span style={{ color: 'red' }}> Simulation</span>}
                {userType === 'Real' && <span style={{ color: 'green' }}> Real Account</span>}
            </h2>

            <h2 style={{ position: 'relative', top: '80px', right: '30px' }}>
                TWS Status:
                {TwsStatus === false && <span style={{ marginLeft: '10px', color: 'red' }}>
                    Dissconnected <FiberManualRecordIcon style={{ color: 'red', position: 'relative', top: '5px' }} />
                </span>}
                {TwsStatus === true && <span style={{ marginLeft: '10px', color: 'green' }}>
                    Connected <FiberManualRecordIcon style={{ color: 'green', position: 'relative', top: '5px' }} />
                </span>}
            </h2>

            <table style={{ marginLeft: 'auto', marginRight: 'auto', position: 'relative', top: '100px' }}>
                {info.investedBalance && <tbody>
                    <tr>
                        <th style={{ fontSize: '25px', padding: '20px' }}>Invested balance</th>
                        <th style={{ fontSize: '25px', padding: '20px' }}>Current balance</th>
                        <th style={{ fontSize: '25px', padding: '20px' }}>Profit/Loss</th>
                        <th style={{ fontSize: '25px', padding: '20px' }}>Number of trades</th>
                        <th style={{ fontSize: '25px', padding: '20px' }}>Positions details</th>
                    </tr>
                    <tr>
                        <td style={{ fontSize: '20px' }}>
                            {info.investedBalance.dollars} $
                        </td>
                        <td style={{ fontSize: '20px' }}>
                            {info.currentBalance.dollars} $
                        </td>
                        <td style={{ fontSize: '20px' }}>
                            {info.profitLoss.dollars} $
                        </td>
                        <td style={{ fontSize: '20px' }}>
                            sell: {info.tradesAmount.sell} trades
                        </td>
                        <td >
                            {userEmail !== '' && <Button variant="contained" color="secondary"
                                onClick={() => window.open(`/positions`, '_blank')}
                            >
                                Enter Positions shop
                            </Button>}
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{ fontSize: '20px' }}>
                            buy: {info.tradesAmount.buy} trades
                        </td>
                        <td>
                            {userEmail !== '' && <Button variant="contained" color="secondary"
                                onClick={() => handleTrackRecordChange()}
                            >
                                get a Report to your email
                            </Button>}
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td >
                            {userEmail !== '' && <Button variant="contained" color="secondary"
                                onClick={() => handleDeletePositions()}
                            >
                                clear positions
                            </Button>}
                        </td>
                    </tr>
                </tbody>}
            </table>
        </div>
    )
}

export default AccountDetailsTable;