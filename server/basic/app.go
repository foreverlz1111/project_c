package main
import(
	"log"
	"gorm-mysql/database"
	"gorm-mysql/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/timeout"
	"time"
)
func _SetRoutes(app *fiber.App){
	app.Get("/hello",timeout.New(routes.Hello, 5 * time.Second))//连通性
	app.Get("/login/:account/:password/",routes.Login)//登陆
	app.Get("/park/:account_id",routes.Park)//返回关联车场
	app.Get("/road_gate/:park_id",routes.Road_gate)//[废弃内容]
	app.Get("/road/:park_id",routes.Road)//返回道闸信息
	app.Put("/open_change",routes.Open_change)//开关闸
	app.Get("/fetcher/:park_id/:road_id",routes.Fetcher)//返回车场、道闸信息
}

func main(){
	database.ConnectDB()
	app := fiber.New()
	_SetRoutes(app)
	app.Use(cors.New())
	app.Use(func(c *fiber.Ctx)error{
		return c.SendStatus(404)//空页面
	})
	log.Fatal(app.Listen(":3000"))
}
