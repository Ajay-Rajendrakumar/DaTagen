from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request
from datetime import datetime
from flask import jsonify
from PIL import Image, ImageDraw, ImageFont,ImageFilter
import PIL.ImageDraw
import PIL.Image
import base64
import random
import os
import math
from flask import send_file,send_from_directory
import glob
import sqlite3
import time, threading
from datetime import date
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

song_folder=os.getcwd()+'/songs'
img_folder=os.getcwd()+'/image'

def reminder():
    conn = sqlite3.connect('test.db')
    cur = conn.execute("SELECT * from REMINDER WHERE ISDELETE='0' AND STATUS='pending' AND date='"+str(date.today())+"'")
    data=[]
    for i in cur.fetchall():
        now = datetime.now()
        db_time=i[5].split(':')
        val=i
        if((int(now.hour))==(int(db_time[0]))and (int(now.minute))==(int(db_time[1]))):
            cur = conn.execute("UPDATE REMINDER SET STATUS='Sent' WHERE id='"+str(i[0])+"'")
            print(val)
            mail(val[1],str(val[6]))
            conn.commit()
            conn.close()
        current_date=0
    threading.Timer(10, reminder).start()

def mail(text,users):
    sender_address = "ajaydevtest@gmail.com"
    sender_pass = '@u8bburm.@devtest'
    print(sender_address,sender_pass,text,users)
    mail_content=text
    receiver_address = users
    #Setup the MIME
    message = MIMEMultipart()
    message['From'] = sender_address
    message['To'] = receiver_address
    message['Subject'] = 'Reminder'   #The subject line
    #The body and the attachments for the mail
    message.attach(MIMEText(mail_content, 'plain'))
    #Create SMTP session for sending the mail
    session = smtplib.SMTP('smtp.gmail.com', 587) #use gmail with port
    session.starttls() #enable security
    session.login(sender_address, sender_pass) #login with mail_id and password
    text = message.as_string()
    session.sendmail(sender_address, receiver_address, text)
    session.quit()
    print('Mail Sent')
reminder() 

@app.route('/musicList',methods = ['POST', 'GET'])
@cross_origin()
def musicList():
    output={"data":os.listdir(song_folder),"status":200}
    return jsonify(output)

@app.route('/getSong',methods = ['POST', 'GET'])
@cross_origin()
def getSong():
    song = request.form['song']
    path=song_folder
    print(path+song)
    return send_from_directory(path, song)
 
@app.route('/<path:filename>',methods = ['POST', 'GET'])  
def send_file(filename):  
      return send_from_directory(song_folder, filename)

@app.route('/uploadSong',methods = ['POST', 'GET'])
@cross_origin()
def uploadSong():
    if request.method == "POST":
        if request.files:
            song_upload = request.files["song"]
            filename = song_upload.filename
            song_upload.save(os.path.join("songs", song_upload.filename))
    output={"data":os.listdir(song_folder),"status":200}
    return jsonify(output)

@app.route('/createUser',methods = ['POST', 'GET'])
@cross_origin()
def createUser():
    if request.method == "POST":
        email = request.form['email']
        pwd = request.form['pwd']
        conn = sqlite3.connect('test.db')
        cur = conn.execute("SELECT * from USER WHERE name='"+email+"' AND PASSWORD='"+pwd+"'")
        if len(cur.fetchall()) > 0:
            output={"message":"User Already Exists","status":401}
        else:
            cursor1 = conn.execute("SELECT * from USER")
            conn.execute("INSERT INTO USER (ID,NAME,PASSWORD) VALUES ('"+str(len(cursor1.fetchall())+1)+"', '"+email+"', '"+pwd+"')")
            conn.commit()
            output={"message":"User created","status":200}
        conn.close()
    return jsonify(output)

@app.route('/loginUser',methods = ['POST', 'GET'])
@cross_origin()
def loginUser():
    if request.method == "POST":
        email = request.form['email']
        pwd = request.form['pwd']
        conn = sqlite3.connect('test.db')
        cursor = conn.execute("SELECT id, name, password from USER WHERE name='"+email+"' AND PASSWORD='"+pwd+"'")
        if len(cursor.fetchall()) >= 1:
        
            output={"message":"Login Successfull","data":{"name":email},"status":200}
        else:
            output={"message":"Invalid Credentials","status":401}
    return jsonify(output)

@app.route('/noteList',methods = ['POST', 'GET'])
@cross_origin()
def noteList():
    if request.method == "POST":
        conn = sqlite3.connect('test.db')
        cur = conn.execute("SELECT * from NOTES WHERE ISDELETE='0' ")
        data=[]
        for i in cur.fetchall():
            obj={}
            obj['id']=i[0]
            obj['note']=i[1]
            obj['status']=i[2]
            obj['isdelete']=i[3]
            obj['date']=i[4]
    
            data.append(obj)
    output={"data":data,"status":200}
    return jsonify(output)

@app.route('/addNote',methods = ['POST', 'GET'])
@cross_origin()
def addNote():
    if request.method == "POST":
        note = request.form['note']
        conn = sqlite3.connect('test.db')
        cursor1 = conn.execute("SELECT * from NOTES")
        date= datetime.today().strftime('%Y-%m-%d')
        time=datetime.today().strftime('%H:%M:%S')
        final = date+'|'+time
        cur = conn.execute("INSERT INTO NOTES (ID,NOTE,STATUS,ISDELETE,DATE) VALUES ('"+str(len(cursor1.fetchall())+1)+"', '"+note+"', 'pending',0,'"+final+"')")
        conn.commit()
        conn.close()
    output={"message":"Succesfully added","status":200}
    return jsonify(output)

@app.route('/updateNote',methods = ['POST', 'GET'])
@cross_origin()
def updateNote():
    if request.method == "POST":
        change_type = request.form['type']
        delete=""
        status=""
        conn = sqlite3.connect('test.db')
        if(change_type=="delete"):
            id= request.form['id']
            cur = conn.execute("UPDATE NOTES SET ISDELETE='1' WHERE id='"+id+"'")
        else:
            id= request.form['id']
            status= request.form['status']
            cur = conn.execute("UPDATE NOTES SET STATUS='"+status+"' WHERE id='"+id+"'")
        conn.commit()
        conn.close()
    output={"message":"Update Success","status":200}
    return jsonify(output)

@app.route('/reminderList',methods = ['POST', 'GET'])
@cross_origin()
def reminderList():
    if request.method == "POST":
        conn = sqlite3.connect('test.db')
        cur = conn.execute("SELECT * from REMINDER WHERE ISDELETE='0' ")
        data=[]
        for i in cur.fetchall():
            obj={}
            obj['id']=i[0]
            obj['reminder']=i[1]
            obj['status']=i[2]
            obj['isdelete']=i[3]
            obj['date']=i[4]
            obj['time']=i[5]
     
            data.append(obj)
    output={"data":data,"status":200}
    return jsonify(output)

@app.route('/addReminder',methods = ['POST', 'GET'])
@cross_origin()
def addReminder():
    if request.method == "POST":
        note = request.form['reminder']
        time = request.form['time']
        date = request.form['date']
        mail = request.form['mail']
        conn = sqlite3.connect('test.db')
        cursor1 = conn.execute("SELECT * from REMINDER")
        cur = conn.execute("INSERT INTO REMINDER (ID,REMINDER,STATUS,ISDELETE,DATE,TIME,RECIEVER) VALUES ('"+str(len(cursor1.fetchall())+1)+"', '"+note+"', 'pending',0,'"+date+"','"+time+"','"+mail+"')")
        conn.commit()
        conn.close()
    output={"message":"Succesfully added","status":200}
    return jsonify(output)

@app.route('/updateReminder',methods = ['POST', 'GET'])
@cross_origin()
def updateReminder():
    if request.method == "POST":
        change_type = request.form['type']
        delete=""
        status=""
        conn = sqlite3.connect('test.db')
        if(change_type=="delete"):
            id= request.form['id']
            cur = conn.execute("UPDATE REMINDER SET ISDELETE='1' WHERE id='"+id+"'")
        else:
            id= request.form['id']
            status= request.form['status']
            cur = conn.execute("UPDATE REMINDER SET STATUS='"+status+"' WHERE id='"+id+"'")
        conn.commit()
        conn.close()
    output={"message":"Update Success","status":200}
    return jsonify(output)

@app.route('/galleryList',methods = ['POST', 'GET'])
@cross_origin()
def galleryList():
    output={"data":os.listdir(img_folder),"status":200}
    return jsonify(output)

@app.route('/image/<path:filename>',methods = ['POST', 'GET'])  
def send_Img_file(filename):  
      return send_from_directory(img_folder, filename)

if __name__ == '__main__':
    app.run()