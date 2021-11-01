import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import Select from "@material-ui/core/Select";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import { CustomersInterface } from "../models/ICustomer";
import { RoomsInterface } from "../models/IRoom";
import { PaymentsInterface } from "../models/IPayment";
import { ReservationsInterface } from "../models/IReservation";

import {
    KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import MenuItem from '@material-ui/core/MenuItem';

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  })
);

function ReservationCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [customers, setCustomers] = useState<CustomersInterface>();
  const [rooms, setRooms] = useState<RoomsInterface[]>([]);
  const [payments, setPayments] = useState<PaymentsInterface[]>([]);
  const [reservation, setReservation] = useState<Partial<ReservationsInterface>>(
    {}
  );

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof reservation;
    setReservation({
      ...reservation,
      [name]: event.target.value,
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof reservation;
    const { value } = event.target;
    setReservation({
      ...reservation, [id]: value });
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };

  const getCustomers = async () => {
    const uid = Number(localStorage.getItem("uid"));
    fetch(`${apiUrl}/customer/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setCustomers(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getRooms = async () => {
    fetch(`${apiUrl}/rooms`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setRooms(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getPayments = async () => {
    fetch(`${apiUrl}/payments`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setPayments(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getCustomers();
    getRooms();
    getPayments();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      CustomerID: convertType(customers?.ID),
      RoomID: convertType(reservation.RoomID),
      PaymentID: convertType(reservation.PaymentID),
      People: convertType(reservation.People),
      DateAndTime: selectedDate,
    };

    const requestOptionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(`${apiUrl}/reservations`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log("บันทึกได้")
          setSuccess(true);
        } else {
          console.log("บันทึกไม่ได้")
          setError(true);
        }
      });
  }

  return (
        <Container className={classes.container} maxWidth="md">
            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    บันทึกข้อมูลสำเร็จ
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    บันทึกข้อมูลไม่สำเร็จ
                </Alert>
            </Snackbar>
            <Paper className={classes.paper}>
                <Box display="flex">
                    <Box flexGrow={1}>
                        <Typography
                            component="h2"
                            variant="h6"
                            color="primary"
                            gutterBottom
                        >
                            จองห้องพัก
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <Grid container spacing={3} className={classes.root}>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <p>ชื่อ-นามสกุล</p>
                            <Select
                                native
                                disabled
                                value={reservation.CustomerID}
                            >
                                <option aria-label="None" value="">
                                  {customers?.Name}
                                </option>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <p>จำนวนผู้เข้าพัก</p>
                            <TextField
                                id="People"
                                variant="outlined"
                                type="number"
                                size="medium"
                                InputProps={{ inputProps: { min: 1 } }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={reservation.People}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <p>ห้องพัก</p>
                            <Select
                                value={reservation.RoomID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "RoomID"
                                }}
                            >
                                <option aria-label="None" value="">
                                    กรุณาเลือกห้องพัก
                                </option>
                                {rooms.map((item: RoomsInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.RoomNumber}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <p>ช่องทางการชำระเงิน</p>
                            <Select
                                value={reservation.PaymentID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "PaymentID"
                                }}
                            >
                                <option aria-label="None" value="">
                                    กรุณาเลือกช่องทางการชำระเงิน
                                </option>
                                {payments.map((item: PaymentsInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.Method}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                            <p>วันที่ต้องการเข้าพัก</p>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDateTimePicker
                                    name="DateAndTime"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    label="กรุณาเลือกวันที่"
                                    format="yyyy-MM-dd hh:mm"
                                />
                            </MuiPickersUtilsProvider>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            component={RouterLink}
                            to="/reserve"
                            variant="contained"
                        >
                            กลับ
                        </Button>
                        <Button
                            style={{ float: "right" }}
                            onClick={submit}
                            variant="contained"
                            color="primary"
                        >
                            บันทึก
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default ReservationCreate;