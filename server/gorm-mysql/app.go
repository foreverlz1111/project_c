package main

import (
	"log"

	"gorm-mysql/database"
	"gorm-mysql/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	
)

func setUpRoutes(app *fiber.App) {
	app.Get("/hello", routes.Hello)
	app.Get("/allinfo", routes.Allinfo)
	app.Post("/insertone/:my_timestamp",routes.Insertone)
}

func main() {
	database.ConnectDb()
	app := fiber.New()

	setUpRoutes(app)

	app.Use(cors.New())

	app.Use(func(c *fiber.Ctx) error {
		return c.SendStatus(404) // => 404 "Not Found"
	})

	log.Fatal(app.Listen(":3000"))
}
