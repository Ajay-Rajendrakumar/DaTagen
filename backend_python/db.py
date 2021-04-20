import sqlite3


conn = sqlite3.connect('test.db')
print("Opened database successfully")
# conn.execute('''CREATE TABLE USER
#          (ID INT PRIMARY KEY     NOT NULL,
#          NAME           CHAR(50),
#          PASSWORD         CHAR(50));''')
# print("Table created successfully")
# conn.execute("INSERT INTO USER (ID,NAME,PASSWORD) \
#      VALUES (1, 'test', 'test')")

# name='test'
# pwd='test'
# cursor = conn.execute("SELECT id, name, password from USER WHERE name='"+name+"' AND PASSWORD='"+pwd+"'")
# print(len(list(cursor)))
# for row in cursor:
#    print("ID = ", row[0])
#    print("NAME = ", row[1])
#    print("PASSWORD = ", row[2])


# conn.execute('''CREATE TABLE NOTES
#          (ID INT PRIMARY KEY     NOT NULL,
#          NOTE           CHAR(200),
#          STATUS         CHAR(200),
#          ISDELETE       INT ,
#          DATE           CHAR(100)
#          );''')
# conn.execute("INSERT INTO NOTES (ID,NOTE,STATUS,ISDELETE,DATE) \
#      VALUES (1, 'Complete The upload', 'pending',0,'date')")
conn.execute('''DROP TABLE REMINDER''')
conn.execute('''CREATE TABLE REMINDER
         (ID INT PRIMARY KEY     NOT NULL,
         REMINDER           CHAR(200),
         STATUS         CHAR(200),
         ISDELETE       INT ,
         DATE           CHAR(100),
         TIME           CHAR(100),
         RECIEVER   CHAR(500)
         );''')
conn.execute("INSERT INTO REMINDER (ID,REMINDER,STATUS,ISDELETE,DATE,TIME) \
     VALUES (1, 'Complete', 'pending',0,'null','null')")

conn.commit()
conn.close()