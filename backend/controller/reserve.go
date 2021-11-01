package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tomcat3v07/reservation/entity"
)

// POST /reserves
func CreateReservation(c *gin.Context) {

	var reservation entity.Reservation
	var customer entity.Customer
	var room entity.Room
	var payment entity.Payment

	if err := c.ShouldBindJSON(&reservation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", reservation.CustomerID).First(&customer); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "customer not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", reservation.RoomID).First(&room); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "room not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", reservation.PaymentID).First(&payment); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payment not found"})
		return
	}

	rv := entity.Reservation{
		Customer:    customer,
		Room:        room,
		Payment:     payment,
		People:      reservation.People,
		DateAndTime: reservation.DateAndTime,
	}

	if err := entity.DB().Create(&rv).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": rv})
}

// GET /reserve/:id
func GetReservation(c *gin.Context) {
	var reservation entity.Reservation
	id := c.Param("id")
	if err := entity.DB().Preload("Customer").Preload("Room").Preload("Payment").Raw("SELECT * FROM reservations WHERE id = ?", id).Find(&reservation).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reservation})
}

// GET /reserves
func ListReservations(c *gin.Context) {
	var reservations []entity.Reservation
	if err := entity.DB().Preload("Customer").Preload("Room").Preload("Payment").Raw("SELECT * FROM reservations").Find(&reservations).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reservations})
}

// DELETE /reserves/:id
func DeleteReservation(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM reservations WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reservation not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /reserves
func UpdateReservation(c *gin.Context) {
	var reservation entity.Reservation
	if err := c.ShouldBindJSON(&reservation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", reservation.ID).First(&reservation); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reservation not found"})
		return
	}

	if err := entity.DB().Save(&reservation).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reservation})
}
