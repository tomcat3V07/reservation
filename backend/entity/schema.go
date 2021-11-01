package entity

import (
	"time"

	"gorm.io/gorm"
)

type Customer struct {
	gorm.Model
	Name         string
	Contact      string
	Email        string `gorm:"uniqueIndex"`
	Password     string
	Reservations []Reservation `gorm:"foreignKey:CustomerID"`
}

type Room struct {
	gorm.Model
	RoomNumber   string
	Location     string
	Reservations []Reservation `gorm:"foreignKey:RoomID"`
}

type Payment struct {
	gorm.Model
	Method       string
	Reservations []Reservation `gorm:"foreignKey:PaymentID"`
}

type Reservation struct {
	gorm.Model

	CustomerID *uint
	Customer   Customer

	RoomID *uint
	Room   Room

	PaymentID *uint
	Payment   Payment

	People      int
	DateAndTime time.Time
}
