import React, { useEffect } from 'react';
import axios from 'axios';
import './PositionsTable.css';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import alertify from 'alertifyjs';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css'
import socketIOClient from 'socket.io-client';


const useStyles = makeStyles({ //יצירת סטיילינג
    root: { //דיב רוט 
        width: '100%',
    },
    container: { // דיב חיצוני ביותר
        maxHeight: 1000,
        position: 'relative',
        bottom: '50px'
    },
});

export default function StickyHeadTable(props) { //הפונקציה של הטבלה
    const classes = useStyles(); //שימוש בסטיילינג לפי קלאסים
    const [page, setPage] = React.useState(0); //סטייט של הפאג'ינציה (עמודים)
    const [rowsPerPage, setRowsPerPage] = React.useState(11); //כמות שורות פר עמוד
    const [positions, setPositions] = React.useState([]);
    const [positionsToFilter, setPositionsToFilter] = React.useState([]);
    const [openSymbols, setOpenSymbols] = React.useState('');
    const [trackRecord, setTrackRecord] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(0);
    const [currentFilter, setCurrentFilter] = React.useState('');
    const open = Boolean(anchorEl);

    const handleClick = (value) => {
        const alertMessage =
        `Take profit 1 Quantity  : ${value[0].quantity.toFixed(3)} ${"<br></br>"}
        Take profit 1 Date : ${value[0].date} ${"<br></br>"} 
        Take profit 1 Price : ${value[0].marketPrice} ${"<br></br>"} 
        Take profit 2 Quantity  : ${value[1].quantity.toFixed(3)} ${"<br></br>"}
        Take profit 2 Date : ${value[1].date} ${"<br></br>"} 
        Take profit 2 Price : ${value[1].marketPrice} ${"<br></br>"} 
        Take profit 3 Quantity  : ${value[2].quantity.toFixed(3)} ${"<br></br>"}
        Take profit 3 Date : ${value[2].date} ${"<br></br>"} 
        Take profit 3 Price : ${value[2].marketPrice} ${"<br></br>"} 
        Take profit 4 Quantity  : ${value[3].quantity.toFixed(3)} ${"<br></br>"}
        Take profit 4 Date : ${value[3].date} ${"<br></br>"} 
        Take profit 4 Price : ${value[3].marketPrice} ${"<br></br>"} 
        Take profit 5 Quantity  : ${value[4].quantity.toFixed(3)} ${"<br></br>"}
        Take profit 5 Date : ${value[4].date} ${"<br></br>"} 
        Take profit 5 Price : ${value[4].marketPrice} ${"<br></br>"} 
        

    `
        console.log(value)
        alertify.alert('Take Profit values', alertMessage , function () { alertify.success('Ok'); });
    };
    const handleClose = () => {
        setAnchorEl(null);
    };



    const columns = [  // עמודות לטבלה הראשית
        {
            id: 'Num',
            label: 'IB ID',
            minWidth: 50
        },
        {
            id: 'technologies',
            label: 'technology',
            minWidth: 50
        },
        {
            id: 'Symbol',
            label: 'Symbol',
            minWidth: 50,
        },
        {
            id: 'Operation',
            label: 'Operation',
            minWidth: 50
        },
        {
            id: 'StartDate',
            label: 'Start Date',
            minWidth: 50,
        },
        {
            id: 'EndDate',
            label: 'End Date',
            minWidth: 50,
        },
        {
            id: 'StartPrice',
            label: 'Start Price',
            minWidth: 50,
        },
        {
            id: 'EndPrice',
            label: 'End Price',
            minWidth: 50,
        },
        {
            id: 'tp',
            label: 'TP',
            minWidth: 50,
        },
        {
            id: 'sp',
            label: 'SP',
            minWidth: 50,
        },
        {
            id: 'succeeded',
            label: 'Succeeded',
            minWidth: 50,
        },
        {
            id: 'PipsesCents',
            label: 'Pipses/Cents',
            minWidth: 50,
        },
        {
            id: 'Precent',
            label: 'Success rate (per page)',
            minWidth: 50,
        },
    ];

    function createData( //פונקציה המייצרת דאטא חדש לטבלה
        Num,
        technologies,
        Symbol,
        Operation,
        StartDate,
        EndDate,
        StartPrice,
        EndPrice,
        tp,
        sp,
        succeeded,
        PipsesCents,
        Precent
    ) {
        return { Num, technologies, Symbol, Operation, StartDate, EndDate, StartPrice, EndPrice, tp, sp, succeeded, PipsesCents, Precent };
    }

    useEffect(() => {
        const socket = socketIOClient('http://localhost:3007',
            {
                cors: {
                    origin: "http://localhost:3007",
                    methods: ["GET", "POST"]
                },
                query: {
                    email: "tradingandcoffeeapplication@gmail.com"
                }
            });

        socket.on("shopUpdate", data => {
            getUserData();
        });
        socket.on("shopInsert", data => {
            getUserData();
        });
    }, [])

    const handleTrackRecordChange = ({ target }) => {
        alertify.prompt('Set your starting capital', 'What was your capital when you first started using the system signal? ($)', '0'
            , function (evt, value) { alertify.success('You entered: ' + value) }
            , function () { alertify.error('Cancel') });
        setTrackRecord(target.value);
    }


    const handleChangePage = (event, newPage) => { //פונקציה לשינוי עמוד
        setPage(newPage); //שינוי הסטייט לעמוד חדש
    };

    const handleChangeRowsPerPage = (event) => { //אפשרות למשתמש לשנות את מספר השורות בעמוד (כרגע מבוטל)
        setRowsPerPage(+event.target.value); //המספר שהמשתמש בחר
        setPage(0);
    };

    // פונקציה שמוסיפה אחוזי הצלחה בראש כל עמוד + משנה ערכים שהם אנדיפיינד
    const addSuccessRate = (arr) => {
        let arrays = [];
        const size = 10;
        let ratesArray = [];
        arr.reverse()
        // חותך את המערך לצ'אנקים של 10 או פחות
        for (let i = 0; i < arr.length; i += size) {
            arrays.push(arr.slice(i, i + size));
        }
        //לולאת פור איצ
        arrays.forEach(chunk => {
            //מוצא את מספר הפוזיציות שהצליחו
            let succeeded = chunk.filter(item => item.succeeded === 'true').length;
            // מוצא את מספר הפוזיציות שעדיין לא נסגרו
            let unClosedPositions = 0;
            chunk.map((item) => {
                if (item.succeeded === 'undefined') { //במידה וסוקסידד אנדיפיינד
                    item.succeeded = 'Position is open'
                    unClosedPositions++; // לא סופר פוזיציות פתוחות בחישוב האחוזים
                };
                if (!item.EndPrice) { // במידה ואין מחיר סגירה
                    item.EndPrice = 'Position is open'
                }
                if (!item.PipsesCents) { // במידה ואין פיפסים
                    item.PipsesCents = 'Position is open'
                }
            });
            // מוצא את אחוזי ההצלחה לפי החישוב הבא: מספר הפוזיציות שהצליחו לחלק לגודל הצ'אנק פחות מספר הפוזיציות שלא נסגרו
            let rate = (succeeded / (chunk.length - unClosedPositions)) * 100;
            rate = rate.toFixed() + '%';
            if (rate === 'NaN%') {
                rate = '0%'
            };
            ratesArray.push(rate);
        });
        arrays.map((array, idx) => array.unshift(createData('', '', '', '', '', '', '', '', '', '', '', '', ratesArray[idx]))); //הכנסה של עמודת אחוזים לטבלה
        return arrays.flat()
    }

    //פונקציה שמביאה את כל הפוזיציות והמידע של המשתמש
    const getUserData = async () => {
        const { data } = await axios.get('/positions/getShopPositions'); // API שמביא דאטא על המשתמש
        const finalPositions = data;
        const sortedPositions = finalPositions.sort((a, b) => { // מסדר את הפוזיציות 
            return a.insertTime - b.insertTime;
        });                                            

        let rows = [];
        let openPositionsEndDates = []
        for (let i = 0; i < sortedPositions.length; i++) { // לולאת פור על כל הפוזיציות של המשתמש
            if (sortedPositions[i].pipsed) { //במידה ויש לפוזיציה פיפסים
                sortedPositions[i].pipsed = sortedPositions[i].pipsed.toFixed(3); // מסדר את הפיפסים רק ל3 מספרים אחרי הנקודה
            };
            if (sortedPositions[i].succeeded === undefined) { //במידה והפוזיציה פתוחה
                openPositionsEndDates.push(sortedPositions[i].endDate); // דוחף למערך את תאריך הסגירה של הפוזיציה
            }
            if (sortedPositions[i].stopLoss) { //במידה ויש לפוזיציה פיפסים
            sortedPositions[i].stopLoss = sortedPositions[i].stopLoss.toFixed(3); // מסדר את הפיפסים רק ל3 מספרים אחרי הנקודה
            console.log(sortedPositions[i].stopLoss)
            }
            rows.push(createData( // מכין את כל הפוזיציות לטבלה
                sortedPositions[i].IB_ID,
                sortedPositions[i].technologies,
                sortedPositions[i].symbol,
                sortedPositions[i].operation,
                sortedPositions[i].startDate,
                sortedPositions[i].endDate,
                sortedPositions[i].startPrice,
                sortedPositions[i].endPrice,
                sortedPositions[i].takeProfit,
                sortedPositions[i].stopLoss,
                String(sortedPositions[i].succeeded),
                sortedPositions[i].pipsed,
                sortedPositions[i].Precent
            ))
        };
        // props.passEndDates(openPositionsEndDates); // מעביר תאריכים של כל הפוזיציות הפתוחות לקומפוננטה הראשית

        const finalArray = addSuccessRate(rows); // מוסיף אחוזי הצלחה לטבלה
        setPositions(finalArray); // קריאה לפונקציה שמכניסה את הערכים לטבלה
        setPositionsToFilter(finalArray);
        console.log(finalArray)
    }

    //קיראה לפונקציה שמביאה את כל המידע על המשתמש כשהדף עולה
    useEffect(() => {
        getUserData();
    }, [])

    // useEffect(() => {
    //     getUserData();
    // }, [positions])

    const filterPositions = ({ target }) => {
        console.log(target.value)
        setCurrentFilter(target.value);
        if (target.value !== "all") {
            let filteredPosionts = positionsToFilter.filter(position => position.technologies == target.value);
            setPositions(filteredPosionts);
        } else {
            setPositions(positionsToFilter);
        }
    }

    const downloadPdf = async (positionsArray) => {
        try {
            const { data } = await axios.get('/auth/userDetails'); //בודק אם המשתמש מחובר ואם כן מביא את הפרטים שלו
            axios.get('/auth/userDetails')
            await axios.post('/pdf/downloadpage', {
                positions: positionsArray,
                email: data.email
            });
            window.open(`http://localhost:4423/usersPDF/${data.email}.pdf`, '_blank')
        } catch (err) {
            console.log(err);
        };
    };
    return (
        <Paper className={classes.root} style={{ paddingTop: '20px' }}>
            <div style={{ height: "40px", textAlign: 'center' }}>
                <img
                    src={'/Logo.jpg'}
                    style={{
                        width: '125px', position: 'relative', float: 'left', bottom: '50px'
                    }}
                />
                <h1 style={{ position: "relative", bottom: "15px", fontSize: '40px', right: '100px', }}>Trading&Coffee performance list</h1>
            </div>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column, idx) => ( //מאפינג לעמודות
                                <TableCell
                                    key={idx} //מזהה
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, textAlign: 'center', backgroundColor: 'lightBlue' }} //סטיילינג
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {positions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => { //מאפינג לדפים
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                                    {columns.map((column, idx) => { //  מאפינג שורות לתוך הטבלה
                                        const value = row[column.id];
                                        if (column.label !== "TP") {
                                            return (
                                                <TableCell key={idx} align={column.align} style={{ textAlign: 'center', fontSize: '17px', height: '16.5px', borderBottom: '1px solid black' }}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        } else if (row.tp.length > 0) {
                                            return (
                                                <TableCell key={idx} align={column.align} style={{ textAlign: 'center', fontSize: '11px', height: '16.5px', borderBottom: '1px solid black' }}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : <div>       <Button
                                                        id="basic-button"
                                                        aria-controls={open ? 'basic-menu' : undefined}
                                                        aria-haspopup="true"
                                                        aria-expanded={open ? 'true' : undefined}
                                                        onClick={() => handleClick(value)}
                                                    >
                                                        watch TP
                                                    </Button>
                                                    </div>}
                                                </TableCell>
                                            )
                                        } else {
                                            return (
                                                <TableCell key={idx} align={column.align} style={{ textAlign: 'center', fontSize: '11px', height: '16.5px', borderBottom: '1px solid black' }}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : <div>       <Button
                                                        id="basic-button"
                                                        aria-controls={open ? 'basic-menu' : undefined}
                                                        aria-haspopup="true"
                                                        aria-expanded={open ? 'true' : undefined}
                                                        onClick={() => handleClick(value)}
                                                    >
                                                    </Button>
                                                    </div>}
                                                </TableCell>
                                            )
                                        }
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination //פאג'ינציה (דפים)
                rowsPerPageOptions={[10]} //אפשרות לתת למשתמש לבחור כמות שורות בדף כרגע האפשרות היחידה היא 10
                component="div"
                count={positions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                style={{ height: '55px' }}
            />
            <FormControl style={{ width: '180px', height: '10px', position: 'relative', bottom: '65px', float: 'right', right: '230px' }} >
                <InputLabel style={{ width: '180px', color: 'black' }} >Filter positions</InputLabel>
                <NativeSelect style={{ width: '180px' }}
                    value={currentFilter}
                    onChange={filterPositions}
                >
                    <option value={'all'}> All Positions</option>
                    <option value={'Stocks'}>Stocks Positions</option>
                    <option value={'Options'}>Options Positions</option>
                    <option value={'FutureContract'}>Future Contract Positions</option>
                    <option value={'FutureContractOptions'}>Future Contract Options Positions</option>
                </NativeSelect>
            </FormControl>
            {/* <FormControl style={{ width: '180px', position: 'relative', bottom: '15px', float: 'right', right: '20px' }} >
                <InputLabel style={{ width: '180px', color: 'black' }} >Track Records</InputLabel>
                <NativeSelect style={{ width: '180px' }}
                    value={openSymbols}
                    onChange={handleTrackRecordChange}
                >
                    <option aria-label="None" value="" />
                    <option value={'crypto-symbols'}>Track-Record Crypto Symbols</option>
                    <option value={'pairs-symbols'}>Track-Record Currency Pairs Symbols</option>
                    <option value={'stocks-symbols'}>Track-Record Stocks Symbols</option>
                    <option value={'bonds-symbols'}>Track-Record Bonds Symbols</option>
                    <option value={'comodity-symbols'}>Track-Record Commodity Symbols</option>
                    <option value={'indexes-symbols'}>Track-Record Indexes Symbols</option>
                    <option value={'all-records'}>Track-Record All records</option>
                </NativeSelect>
            </FormControl> */}
            <Button
                onClick={() => downloadPdf(positions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage))}
                variant="contained"
                color="primary"
                style={
                    { fontSize: '14px', position: 'relative', left: '5px', bottom: '60px' }
                }>
                Download Page(PDF)
            </Button>
        </Paper>
    );
}