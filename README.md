***

### 本页导航
- [简介](#1)
- [文件](#2)
- [示例动图](#3)
- [Ready list](#4)

***

<h3 name="1">简介： </h3>

- 微信小程序（安卓）端的视频交互，数据库上云,即时通讯底包上腾讯云。

***
<h3 name="2">文件：</h3>

.

├── city.py

├── demonstration

├── LICENSE

├── [miniprogram](https://github.com/foreverlz1111/project_c/tree/main/miniprogram) //小程序代码

├── miniprogram_cache //Daily code

├── README.md //当前文件

├── [server](https://github.com/foreverlz1111/project_c/tree/main/server) //服务器代码

***
<h3 name="3"> 动图：</h3>

- 1. 刷新状态： ![截图](https://github.com/foreverlz1111/project_c/blob/main/demonstration/%E6%BC%94%E7%A4%BA%E4%B8%80.gif)


- 2. 呼叫： ![截图](https://github.com/foreverlz1111/project_c/blob/main/demonstration/%E6%BC%94%E7%A4%BA%E4%BA%8C.gif)


- 3. 呼叫记录(删、改)： ![截图](https://github.com/foreverlz1111/project_c/blob/main/demonstration/%E6%BC%94%E7%A4%BA%E4%B8%89.gif)


- 4. 状态更改： ![截图](https://github.com/foreverlz1111/project_c/blob/main/demonstration/%E6%BC%94%E7%A4%BA%E5%9B%9B.gif)


- 5. 车场名更改： ![截图](https://github.com/foreverlz1111/project_c/blob/main/demonstration/%E6%BC%94%E7%A4%BA%E4%BA%94.gif)


- 6. 道闸记录(改)： ![截图](https://github.com/foreverlz1111/project_c/blob/main/demonstration/%E6%BC%94%E7%A4%BA%E5%85%AD.gif)


- 7. 道闸记录(增、删)： ![截图](https://github.com/foreverlz1111/project_c/blob/main/demonstration/%E6%BC%94%E7%A4%BA%E4%B8%83.gif)


- 8. 密码更改： ![截图](https://github.com/foreverlz1111/project_c/blob/main/demonstration/%E6%BC%94%E7%A4%BA%E5%85%AB.gif)
***
<h3 name="4">Ready list： </h3>
- 1) 后台服务端


[//]: <红色![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=+)> ()

[//]: <蓝色![#c5f015](https://via.placeholder.com/15/c5f015/000000?text=+)> ()

[//]: <绿色![#1589F0](https://via.placeholder.com/15/1589F0/000000?text=+)> ()


|  模块   | 功能点  | 备注  | 检查  |  
|  :-----  | :----: | :----: | :----: |
| 车场管理  | 车场增删查改 | ![#1589F0](https://via.placeholder.com/15/1589F0/000000?text=+)有查，需修改车场状态，修改车场名 | 👌2022年2月7日 |
| 车场管理  | 车场道闸增删查改 | ![#1589F0](https://via.placeholder.com/15/1589F0/000000?text=+)有查、改（开关闸），需增、删、 改（修改道闸类型） | 👌2022年2月7日 |
| 车场管理  | 车场管理员增删查改，重置密码 | ![#1589F0](https://via.placeholder.com/15/1589F0/000000?text=+).做修改密码 | 👌2022年2月7日 |
| 记录管理  | 接收呼叫信息，接通呼叫信息 | ![#c5f015](https://via.placeholder.com/15/c5f015/000000?text=+).已有 | 👌2022年2月7日 |
| 记录管理  | 呼叫记录 | ![#c5f015](https://via.placeholder.com/15/c5f015/000000?text=+).已有 | 👌2022年2月7日 |
| 权限管理  | 人员，角色，菜单增删查改 | ![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=+) .暂无法实现 | 👌2022年2月7日 |
| 日志记录  | 接口日志请求记录 | ![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=+) .暂无法实现 | 👌2022年2月7日 |
| 字典管理  | 字典增删查改 | ![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=+) .暂无法实现 | 👌2022年2月7日 |

- 2) 小程序客户端客户功能


|  模块   | 功能点  | 备注  | 检查  |  
|  :-----  | :----: | :----: | :----: |
| 呼叫  | 可扫描道闸二维码进行呼叫或者小程序直接呼叫 | ![#1589F0](https://via.placeholder.com/15/1589F0/000000?text=+).生成带参数的太阳码入口 | 👌2022年2月12日 |
- 3) 小程序客户端车场管理员功能


|  模块   | 功能点  | 备注  | 检查  |  
|  :-----  | :----: | :----: | :----: |
| 接通呼叫  | 接通对应车场的呼叫 | ![#c5f015](https://via.placeholder.com/15/c5f015/000000?text=+).已有 | 👌2022年2月11日 |
| 呼叫记录  | 对应车场呼叫记录 | ![#c5f015](https://via.placeholder.com/15/c5f015/000000?text=+).已有 | 👌2022年2月11日 |
***
