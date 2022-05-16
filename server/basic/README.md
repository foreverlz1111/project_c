- 备注：仓库文件夹没有database.go，从文件夹“gorm-mysql”中获取。
```
basic
├── app.go 起始点
├── database 数据库配置
│   └── database.go
├── go.mod
├── go.sum
├── models 实体
│   ├── account_entity.go
│   ├── call_entity.go
│   ├── open_gate_entity.go
│   ├── park_account_entity.go
│   ├── park_detail.go
│   ├── park_entity.go
│   ├── road_detail.go
│   └── road_gate_entity.go
├── README.md
├── routes 路由
│   ├── calls.go
│   └── routes.go
└── sig 分配密钥
    ├── base64url.go
    ├── compute.go
    ├── README.md
    └── TLSSigAPI.go

4 directories, 19 files
```
