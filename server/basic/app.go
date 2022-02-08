package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/timeout"
	"gorm-mysql/database"
	"gorm-mysql/routes"
	"log"
	"time"
)

func _SetRoutes(app *fiber.App) {
	app.Get("/hello", timeout.New(routes.Hello, 5*time.Second)) //连通性
	app.Get("/login/:account/:password/", routes.Login)         //登陆
	app.Get("/park/:account_id", routes.Park)                   //返回关联车场
	app.Get("/road_gate/:park_id", routes.Road_gate)            //[废弃内容]
	app.Get("/road/:park_id", routes.Road)                      //返回道闸信息
	app.Put("/open_change", routes.Open_change)                 //开关闸
	app.Get("/fetcher/:park_id/:road_id", routes.Fetcher)       //返回车场、道闸信息
}
func _SetCall(app *fiber.App) {
	app.Put("/call/", routes.Call)
	//app.Get("/call_account/:park_id",routes.Call_account)//返回关联账号//[废弃内容]
	app.Put("/call_accept/", routes.Call_accept)
	//app.Put("/call_handup",routes.Call_handup)//[废弃内容]
	app.Put("/call_reject", routes.Call_reject)
	app.Get("/call_entity/:park_id/:account_id",routes.Call_entity)//新增通话记录
	
}
func _SetManages(app *fiber.App){
	app.Put("/manages/park_status",routes.Park_status_change)//开关车场
	app.Put("/manages/park_name",routes.Park_name_change)//修改车场名
	app.Put("/call_entity/update/remark",routes.Call_entity_update_remark)//更新通话记录的备注
	//app.Delete("/call_entity/update/deletion",routes.Call_entity_deletion)
	//app.Post("/manages/open_gate",routes.Add_gate)//新增道闸
	//app.Put("/manages/open_gate",routes.Update_gate)//更新道闸
	//app.Delete("/manages/open_gate",routes.Delete_gate)//删除道闸
}
func main() {
	database.ConnectDB()
	app := fiber.New()
	_SetRoutes(app)
	_SetCall(app)
	_SetManages(app)
	app.Use(cors.New())
	app.Use(func(c *fiber.Ctx) error {
		return c.SendStatus(404) //空页面
	})
	log.Fatal(app.Listen(":3000"))
}
