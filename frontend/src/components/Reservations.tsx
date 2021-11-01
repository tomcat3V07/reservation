import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { ReservationsInterface } from "../models/IReservation";
import { format } from 'date-fns'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
    tableSpace: {
      marginTop: 20,
    },
  })
);

function Reservations() {
  const classes = useStyles();
  const [reservations, setReservation] = React.useState<ReservationsInterface[]>([]);
  
  const getReservations = async () => {
    const apiUrl = "http://localhost:8080/reservations";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setReservation(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getReservations();
  }, []);

  return (
    <div>
      <Container className={classes.container} maxWidth="md">
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              บันทึกข้อมูลการจอง
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/reserve/create"
              variant="contained"
              color="primary"
            >
              สร้างข้อมูล
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} className={classes.tableSpace}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width="10%">
                  รหัส
                </TableCell>
                <TableCell align="center" width="30%">
                  ลูกค้า
                </TableCell>
                <TableCell align="center" width="10%">
                  ห้อง
                </TableCell>
                <TableCell align="center" width="10%">
                  จำนวนผู้เข้าพัก
                </TableCell>
                <TableCell align="center" width="10%">
                  วิธีการชำระเงิน
                </TableCell>
                <TableCell align="center" width="30%">
                  วันที่และเวลา
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((item: ReservationsInterface) => (
                <TableRow key={item.ID}>
                  <TableCell align="center">{item.ID}</TableCell>
                  <TableCell align="center">{item.Customer.Name}</TableCell>
                  <TableCell align="center">{item.Room.Name}</TableCell>
                  <TableCell align="center">{item.People}</TableCell>
                  <TableCell align="center">{item.Payment.Method}</TableCell>
                  <TableCell align="center">{format((new Date(item.DateAndTime)), 'dd MMMM yyyy hh:mm')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default Reservations;