import pymysql
import datetime
if __name__ == '__main__':
    city = open("/city.txt", "r", encoding='gbk')
    db = pymysql.connect(host="mysql.rds.aliyuncs.com",user="",password="",database="")
    cursor = db.cursor()
    print(datetime.datetime.now())
    count = len(city.readlines())
    city.seek(0)
    while count > 0:
        str = city.readline()
        mytime = datetime.datetime.now()
        sql = """insert into table(raw1,raw2,raw3,raw4)values(%s,%s,%s,%s,%s)"""
        try:
            cursor.execute(sql,(1,mytime,mytime,str[:6],str[7:]))
            result = cursor.fetchall()
            for row in result:
                print(row)
            db.commit()
            print(count,"插入:",str[:6],str[7:])
        except:
            print("插入失败")
        count = count - 1
    db.close()
    
