package routes

import (
	"github.com/gofiber/fiber/v2"
	"gorm-mysql/database"
	"gorm-mysql/models"
	"log"

)

type Items struct {
	r []models.Road_gate_entity `json:"r"`
	o []models.Open_gate_entity `json:"o"`
}

func Hello(ctx *fiber.Ctx) error {
	err := ctx.SendString("服务器准备就绪")
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}
func Login(c *fiber.Ctx) error {
	acc := c.Params("account")
	pwd := c.Params("password")
	account_entity := new(models.Account_entity)
	database.DB.Where("account = ? and password = ? and status = 0", acc, pwd).First(&account_entity)
	if account_entity.Account != "" {
		log.Println(account_entity)
		return c.Status(200).JSON(account_entity)
	}
	log.Println(account_entity)
	return c.Status(400).SendString("未找到该用户")
}
func Park(c *fiber.Ctx) error {
	id := c.Params("account_id")
	park_account := models.Park_account_entity{}
	park := models.Park_entity{}
	database.DB.Where("account_id = ?", id).First(&park_account)
	if park_account.Park_id != 0 {
		log.Println(park_account)
		database.DB.Where("id = ? and status = 0", park_account.Park_id).First(&park)
		if park.Id != 0 {
			detail := &models.Park_detail{
				Id:           park.Id,
				Status:       park.Status,
				Gmt_created:  park.Gmt_created,
				Gmt_modified: park.Gmt_modified,
				Park_name:    park.Park_name,
				Address:      park.Address,
			}
			detail.Get_detail(park)
			return c.Status(200).JSON(detail)
		}
		return c.Status(400).SendString("车场已停运")
	}
	log.Println(park_account)
	return c.Status(400).SendString("无车场可管理")
}
func Road_gate(c *fiber.Ctx) error {
	park_id := c.Params("park_id")
	road_gate := []models.Road_gate_entity{}
	open_gate := []models.Open_gate_entity{}
	database.DB.Where("park_id = ?", park_id).Find(&road_gate)
	log.Println("road_gate", road_gate)
	if road_gate != nil {
		subsql := database.DB.Select("id").Where("park_id = ? ", park_id).Table("road_gate_entity")
		database.DB.Where("road_gate_id IN (?) ", subsql).Find(&open_gate)
		log.Println("open gete", open_gate)
		item := new(Items)
		item.r = road_gate
		item.o = open_gate
		log.Println(item)
		out := map[string]interface{}{}
		out["r"] = item.r
		out["o"] = item.o
		return c.Status(200).JSON(out)
	}
	return c.Status(400).SendString("车场无道闸")
}
