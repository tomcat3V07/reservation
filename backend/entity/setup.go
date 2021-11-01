package entity

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("reservation.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	//Migrate the schema
	database.AutoMigrate(
		&Customer{},
		&Room{},
		&Payment{},
		&Reservation{},
	)

	db = database

	password, err := bcrypt.GenerateFromPassword([]byte("123456"), 14)

	c1 := Customer{
		Name:     "อดิเทพ พูลสวัสดิ์",
		Contact:  "0902350750",
		Email:    "b6100124@g.sut.ac.th",
		Password: string(password),
	}
	db.Model(&Customer{}).Create(&c1)

	c2 := Customer{
		Name:     "ลลิษา มโนบาล",
		Contact:  "0902350751",
		Email:    "lalalalisam@g.sut.ac.th",
		Password: string(password),
	}
	db.Model(&Customer{}).Create(&c2)

	var aditep Customer
	var lisa Customer
	db.Raw("SELECT * FROM customers WHERE Contact = ?", "0902350750").Scan(&aditep)
	db.Raw("SELECT * FROM customers WHERE Contact = ?", "0902350751").Scan(&lisa)

	// --- Room Data
	r1 := Room{
		RoomNumber: "101",
		Location:   "ชั้น 1",
	}
	db.Model(&Room{}).Create(&r1)

	r2 := Room{
		RoomNumber: "201",
		Location:   "ชั้น 2",
	}
	db.Model(&Room{}).Create(&r2)

	r3 := Room{
		RoomNumber: "301",
		Location:   "ชั้น 3",
	}
	db.Model(&Room{}).Create(&r3)

	// --- Payment Data
	p1 := Payment{
		Method: "KTB",
	}
	db.Model(&Payment{}).Create(&p1)

	p2 := Payment{
		Method: "SCB",
	}
	db.Model(&Payment{}).Create(&p2)

	p3 := Payment{
		Method: "TMB",
	}
	db.Model(&Payment{}).Create(&p3)

	//reserve 1
	db.Model(&Reservation{}).Create(&Reservation{
		DateAndTime: time.Now(),
		People:      1,
		Customer:    aditep,
		Room:        r1,
		Payment:     p1,
	})
	//reserve 2
	db.Model(&Reservation{}).Create(&Reservation{
		DateAndTime: time.Now(),
		People:      2,
		Customer:    lisa,
		Room:        r2,
		Payment:     p3,
	})
	//reserve 3
	db.Model(&Reservation{}).Create(&Reservation{
		DateAndTime: time.Now(),
		People:      1,
		Customer:    aditep,
		Room:        r2,
		Payment:     p1,
	})
}
