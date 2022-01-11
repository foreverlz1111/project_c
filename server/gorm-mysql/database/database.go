package database

import (

	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	DBConn *gorm.DB
)

//连接数据库
func ConnectDb() {

	// 参考 https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
	
	dsn := "user:password@tcp(mysql.rds.aliyuncs.com:3306)/test_connection_go?charset=utf8&parseTime=True&loc=Local"
	/*
		提示:
		为了正确使用time.Time类型，请注意设置parseTime参数；
		注意你的数据库格式是utf8还是utf8mb4
	*/

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	
	if err != nil {
		log.Fatal("数据库连接失败！\n", err)
		os.Exit(2)
	}
	/*调试内容
	log.Println("数据库连接成功！")
	log.Println("有无模式对应的info_table表", db.Migrator().HasTable(&models.Info_table{})) 
	log.Println("有无info_table表", db.Migrator().HasTable("info_table"))   
	log.Println("当前打开数据库：",db.Migrator().CurrentDatabase())
	*/
	DBConn = db
}
