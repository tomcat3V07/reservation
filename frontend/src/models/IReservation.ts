import { CustomersInterface } from "./ICustomer";
import { RoomsInterface } from "./IRoom";
import { PaymentsInterface } from "./IPayment";

export interface ReservationsInterface {
    ID: number, 
    People: number,
    DateAndTime: Date,

    CustomerID: number,
    Customer: CustomersInterface,

    RoomID: number,
    Room: RoomsInterface,
    
    PaymentID: number,
    Payment: PaymentsInterface,
}