package main

import (
	"github.com/gin-gonic/gin"
	"github.com/tomcat3v07/reservation/controller"
	"github.com/tomcat3v07/reservation/entity"
	"github.com/tomcat3v07/reservation/middlewares"
)

func main() {
	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	api := r.Group("")
	{
		protected := api.Use(middlewares.Authorizes())
		{
			// User Routes
			protected.GET("/customers", controller.ListCustomers)
			protected.GET("/customer/:id", controller.GetCustomer)
			protected.PATCH("/customers", controller.UpdateCustomer)
			protected.DELETE("/customers/:id", controller.DeleteCustomer)

			// Room Routes
			protected.GET("/rooms", controller.ListRooms)
			protected.GET("/room/:id", controller.GetRoom)
			protected.POST("/rooms", controller.CreateRoom)
			protected.PATCH("/rooms", controller.UpdateRoom)
			protected.DELETE("/rooms/:id", controller.DeleteRoom)

			// Payment Routes
			protected.GET("/payments", controller.ListPayments)
			protected.GET("/payment/:id", controller.GetPayment)
			protected.POST("/payments", controller.CreatePayment)
			protected.PATCH("/payments", controller.UpdatePayment)
			protected.DELETE("/payments/:id", controller.DeletePayment)

			// Reservation Routes
			protected.GET("/reservations", controller.ListReservations)
			protected.GET("/reservation/:id", controller.GetReservation)
			protected.POST("/reservations", controller.CreateReservation)
			protected.PATCH("/reservations", controller.UpdateReservation)
			protected.DELETE("/reservations/:id", controller.DeleteReservation)
		}
	}

	// Customer Routes
	r.POST("/customers", controller.CreateCustomer)

	// Authentication Routes
	r.POST("/login", controller.Login)

	// Run the server
	r.Run()
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
