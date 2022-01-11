package routes

import(

	"log"
	"github.com/gofiber/fiber/v2"

)

func Hello(ctx *fiber.Ctx) error{
	err := ctx.SendString("服务器准备就绪")
	if err != nil{
		log.Println(err)
		return err
	}
	return nil
}
