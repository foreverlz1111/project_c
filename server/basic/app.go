package main
import(
	"log"
	//"gorm-mysql/database"
	"gorm-mysql/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/timeout"
	"time"
)
func _SetRoutes(app *fiber.App){
	app.Get("/hello",timeout.New(routes.Hello, 5 * time.Second))
}

func main(){
	//database.ConnectDB()
	app := fiber.New()
	_SetRoutes(app)
	app.Use(cors.New())
	app.Use(func(c *fiber.Ctx)error{
		return c.SendStatus(404)//空页面
	})
	log.Fatal(app.Listen(":3000"))
}
