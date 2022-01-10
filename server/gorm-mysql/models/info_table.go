package models

import (
	"time"
)
//结构体Info_table，首字母需要大写
type Info_table struct {
	//字段首字母需要大写
	Id int `json:"id"`
	Name string `json:"name"`
	Whentime time.Time `json:"whentime"`
	Statue int `json:"status"`
}
func (Info_table)TableName()string{
	//重写查询的表名
	return "info_table"
}
