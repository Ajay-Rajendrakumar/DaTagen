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
from email.mime.application import MIMEApplication
import cv2
import numpy as np
import random
import matplotlib.pyplot as plt
import datetime
import shutil
import zipfile
import time
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

song_folder=os.getcwd()+'/songs'
img_folder=os.getcwd()+'/originalImage'
data_folder=os.getcwd()+'/generateDataset'
test_folder=os.getcwd()+'/contourImage'
zip_folder=os.getcwd()+'/Dataset'
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('haarcascade_eye.xml') 

def reminder():
    conn = sqlite3.connect('test.db')
    cur = conn.execute("SELECT * from REMINDER WHERE ISDELETE='0' AND STATUS='pending' AND date='"+str(date.today())+"'")
    data=[]
    for i in cur.fetchall():
        now = datetime.datetime.now()
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
    sender_pass = ''
    print(sender_address,sender_pass,text,users)
    mail_content=text
    receiver_address = users.split(',')
    #Setup the MIME
    message = MIMEMultipart()
    message['From'] = sender_address
    message['To'] = "Users"
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

def scale(img):
    try:
        (height, width) = img.shape[:2]
        res = cv2.resize(img, (int(random.randint(10,100)), int(random.randint(10,100))), interpolation = cv2.INTER_CUBIC)
        return res
    except:
        return img

def rotate(img): 
    try:    
        (rows, cols) = img.shape[:2]
        M = cv2.getRotationMatrix2D((cols / 2, rows / 2), random.randint(0,360), 1)
        res = cv2.warpAffine(img, M, (cols, rows))
        return res
    except:
        return img

def translate(img):
    try:
        (rows, cols) = img.shape[:2]
        M = np.float32([[1,0,random.randint(-10,50)],[0,1,random.randint(-10,50)]])
        res = cv2.warpAffine(img, M, (cols, rows))
        return res
    except:
        return img

def shear(img):
    try:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        plt.axis('off')
        rows, cols, dim = img.shape
        # shearing applied to y-axis
        M=[]
        M = np.float32([[1,   0, 0],
                        [0.9, 1, 0],
                        [0,   0, 1]])
        # shearing applied to x-axis
        if(random.randint(0,10)/2==0):
            M = np.float32([[1, 0.9, 0],
                            [0, 1  , 0],
                            [0, 0  , 1]])
    
        sheared_img = cv2.warpPerspective(img,M,(int(cols*1.5),int(rows*1.5)))
        plt.axis('off')
        return sheared_img
    except:
        return img

def reflection(img):
    try:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        plt.axis('off')
        rows, cols, dim = img.shape
        # shearing applied to y-axis
        M=[]
        M = np.float32([[1,  0, 0   ],
                    [0, -1, rows],
                    [0,  0, 1   ]])
        # shearing applied to x-axis
        if(random.randint(0,10)/2==0):
            M = np.float32([[-1, 0, cols],
                    [ 0, 1, 0   ],
                    [ 0, 0, 1   ]])
    
        reflected_img = cv2.warpPerspective(img,M,(int(cols),int(rows)))
        plt.axis('off')
        return reflected_img
    except:
        return img

def cvtColor(img):
    try:
        res = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY )
        return res
    except:
        print('error')
        return img
def blur(img):
    try:
        res = cv2.GaussianBlur(img,(3,3),cv2.BORDER_DEFAULT )
        return res
    except:
        return img
def CannyEdge(img):
    try:
        img_gray1 = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        ret, thresh1 = cv2.threshold(img_gray1, 150, 255, cv2.THRESH_BINARY)
        contours2, hierarchy2 = cv2.findContours(thresh1, cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
        image_copy2 = img.copy()
        cv2.drawContours(image_copy2, contours2, -1, (0, 255, 0), 2, cv2.LINE_AA)
        image_copy3 = img.copy()
        for i, contour in enumerate(contours2): # loop over one contour area
            for j, contour_point in enumerate(contour): # loop over the points
                cv2.circle(image_copy3, ((contour_point[0][0], contour_point[0][1])), 2, (0, 255, 0), 2, cv2.LINE_AA)
        return image_copy3
    except:
        return img
def face(img):
    try:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        for (x,y,w,h) in faces:
            # To draw a rectangle in a face 
            cv2.rectangle(img,(x,y),(x+w,y+h),(0,255, 0),20) 

        return img
    except:
        return img



def change_brightness(img):
    try:
        value=random.randint(-5,5)
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(hsv)
        v = cv2.add(v,value)
        v[v > 255] = 255
        v[v < 0] = 0
        final_hsv = cv2.merge((h, s, v))
        img = cv2.cvtColor(final_hsv, cv2.COLOR_HSV2BGR)
        return img  
    except:
        return img
def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file), 
                       os.path.relpath(os.path.join(root, file), 
                                       os.path.join(path, '..')))
def send_zip_mail(reviever,filename):
    # Create a multipart message
    sender_address = "ajaydevtest@gmail.com"
    sender_pass = ''
    msg = MIMEMultipart()
    dte=str(datetime.datetime.today()).split(' ')
    date=dte[0]
    time=dte[1].split('.')[0]
    body_part = MIMEText("Generate Dataset attached "+date+" "+time+" with this mail", 'plain')
    msg['Subject'] = "Dataset"
    msg['From'] = sender_address
    msg['To'] = "Developers"
    # Add body to email
    msg.attach(body_part)
    # open and read the file in binary
    with open(os.getcwd()+'/zip/'+filename,'rb') as file:
    # Attach the file with filename to the email
        msg.attach(MIMEApplication(file.read(), Name=filename))

    # Create SMTP object
    session = smtplib.SMTP('smtp.gmail.com', 587)
    session.starttls() #enable security
    session.login(sender_address, sender_pass) #login with mail_id and password
    session.sendmail(msg['From'], reviever, msg.as_string())
    session.quit()
    # Login to the server

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
        date= datetime.datetime.today().strftime('%Y-%m-%d')
        time=datetime.datetime.today().strftime('%H:%M:%S')
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

@app.route('/galleryUpload',methods = ['POST', 'GET'])
@cross_origin()
def galleryUpload():
    #output={"data":os.listdir(img_folder),"status":200}
    user=request.form['user']
    img_upload = request.files["image"]
    filename = img_upload.filename
    img_upload.save(os.path.join("originalImage", img_upload.filename))
    conn = sqlite3.connect('test.db')
    cur = conn.execute("SELECT * from ORIGINALIMAGE;")
    val=cur.execute("SELECT COUNT(*) FROM ORIGINALIMAGE").fetchone()[0]
    x = str(datetime.datetime.now())
    date=x.split(' ')[0]
    time=x.split(' ')[1].split('.')[0]
    conn.execute("INSERT INTO ORIGINALIMAGE (ID,IMAGE,ISDELETE,DATE,TIME,UPLOADER) VALUES ('"+str(val+1)+"', '"+filename+"','0','"+date+"','"+time+"','"+user+"')")                 
    conn.commit()
    output={"status":200}
    return jsonify(output)

@app.route('/galleryList',methods = ['POST', 'GET'])
@cross_origin()
def galleryList():
    #output={"data":os.listdir(img_folder),"status":200}
    conn = sqlite3.connect('test.db')
    cur = conn.execute("SELECT * from ORIGINALIMAGE ")
    print(cur.fetchall())
    cur = conn.execute("SELECT * from ORIGINALIMAGE WHERE ISDELETE='0' ")
    data=[]
    for i in cur.fetchall():
        obj={}
        obj['id']=i[0]
        obj['image']=i[1]
        obj['isdelete']=i[2]
        obj['date']=i[3]
        obj['time']=i[4]
        obj['creator']=i[5]
        data.append(obj)
    output={"data":data,"status":200}
    return jsonify(output)

@app.route('/originalImage/<path:filename>',methods = ['POST', 'GET'])  
def send_Img_file(filename):  
      return send_from_directory(img_folder, filename)
@app.route('/generateDataset/<path:filename>',methods = ['POST', 'GET'])  
def send_data_file(filename):  
      dirc=filename.split(':')[0]
      files=filename.split(':')[1]
      print(dirc,files[1:],os.getcwd()+'/generateDataset/'+dirc)
      return send_from_directory(os.getcwd()+'/generateDataset/'+dirc, files[1:])

@app.route('/contour/<path:filename>',methods = ['POST', 'GET'])  
def send_Contour_file(filename):  
      return send_from_directory(test_folder, filename)

@app.route('/generateDataset',methods = ['POST', 'GET'])
@cross_origin()
def generateDataset():
    if request.method == "POST":
        filename=request.form['imgname']
        fileId=request.form['imgid']
        count=request.form['count']
        options=(request.form['options']).split(',')
        print(options,"--------------",len(options))
        original_loc = os.getcwd()+'/originalImage/'+filename
        save_loc=os.getcwd()+'/generateDataset/'+filename
        conn = sqlite3.connect('test.db')
        folder=True
        try:
            os.mkdir(save_loc)
        except:
            print("FolderExits")
            shutil.rmtree(save_loc) 
            os.mkdir(save_loc)
            conn.execute("DELETE FROM DATASET WHERE ORIGINAL='"+str(fileId)+"'")                 
            conn.commit()

        for i in range(int(count)):
            i=str(i)
            img = cv2.imread(original_loc)
            #options=["scale","rotate","translate","shear","reflection","color","blur","bright"]
            for j in range(random.randint(1,3)):
                ind=random.randint(0,len(options)-1)
                print(ind,"$$$$$$$$$$$$$$$$$")
                opt=options[ind]
                if opt=="Scale":
                    img=scale(img)
                elif opt=="Rotate":
                    img=rotate(img)
                elif opt=="Translate":
                    img=translate(img)
                elif opt=="Shear":
                    img=shear(img)
                elif opt=="Reflection":
                    img=reflection(img)
                elif opt=="Color":
                    img=cvtColor(img)
                elif opt=="Blur":
                    img=blur(img)
                elif opt=="Bright":
                    img=change_brightness(img) 
            ts=(datetime.datetime.now().timestamp())
            print(ts)
            imageName= "/"+str(ts).split('.')[1]+".jpg"      
            cv2.imwrite(save_loc+imageName, img)
            cur = conn.execute("SELECT * from DATASET;")
            val=cur.execute("SELECT COUNT(*) FROM DATASET").fetchone()[0]
            print(val,cur)
            x = str(datetime.datetime.now())
            date=x.split(' ')[0]
            time=x.split(' ')[1].split('.')[0]
            conn.execute("INSERT INTO DATASET (ID,IMAGE,ORIGINAL,ISDELETE,DATE,TIME) VALUES ('"+str(val+1)+"', '"+imageName+"', '"+fileId+"','0','"+date+"','"+time+"')")                 
            conn.commit()
        cur = conn.execute("SELECT * from DATASET WHERE ORIGINAL='"+str(fileId)+"' and ISDELETE='0' ")
        data=[]
        for i in cur.fetchall():
            obj={}
            obj['id']=i[0]
            obj['image']=i[1]
            obj['original']=i[2]
            obj['isdelete']=i[3]
            obj['date']=i[4]
            obj['time']=i[5]
            data.append(obj)
        output={"data":data,"status":200}
        return jsonify(output)
    return jsonify({})
@app.route('/getDataset',methods = ['POST', 'GET'])
@cross_origin()
def getDataset():
    if request.method == "POST":
        filename=request.form['imgname']
        fileId=request.form['imgid']
        conn = sqlite3.connect('test.db')

        cur = conn.execute("SELECT * from DATASET WHERE ORIGINAL='"+str(fileId)+"' and ISDELETE='0' ")
        data=[]
        for i in cur.fetchall():
            obj={}
            obj['id']=i[0]
            obj['image']=i[1]
            obj['original']=i[2]
            obj['isdelete']=i[3]
            obj['date']=i[4]
            obj['time']=i[5]
            data.append(obj)
        output={"data":data,"status":200}
        return jsonify(output)
    return jsonify({})

@app.route('/testImage',methods = ['POST', 'GET'])
@cross_origin()
def testImage():
    if request.method == "POST":
        fileId=request.form['orgId']
        filename=request.form['orgName']
        Dtype=request.form['option']
        id=(request.form['imgId']).split(',')
        files=[]
        print(fileId,filename,id)
        conn = sqlite3.connect('test.db')
        cur = conn.execute("SELECT * from DATASET WHERE ORIGINAL='"+str(fileId)+"' and ISDELETE='0' ")
        data=[]
        dic={}
        for i in cur.fetchall():
            dic[i[0]]=i[1]
        print(dic)
        shutil.rmtree(test_folder) 

        os.mkdir(test_folder)
        print(id)
        for j in id:
            j=int(j)         
            img=cv2.imread(data_folder+'/'+filename+dic[j])
            if Dtype=="Contour":
                img=CannyEdge(img)
            elif Dtype=="Face":
                img=face(img)
            else:
                img=CannyEdge(img)
                img=face(img)

            print(test_folder+'/'+dic[j])
            cv2.imwrite(test_folder+'/'+dic[j],img)
            time.sleep(1)
            files.append(dic[j])
        output={"data":files,"status":200}
        return jsonify(output)
    return jsonify({})

@app.route('/sendzip',methods = ['POST', 'GET'])
@cross_origin()
def sendzip():
    if request.method == "POST":
        fileId=request.form['orgId']
        filename=request.form['orgName']
        id=(request.form['imgId']).split(',')
        user=(request.form['user'])
        reciever=(request.form['reciever']).split(',')
        files=[]
        print(fileId,filename,id)
        conn = sqlite3.connect('test.db')
        cur = conn.execute("SELECT * from DATASET WHERE ORIGINAL='"+str(fileId)+"' and ISDELETE='0' ")
        data=[]
        dic={}
        for i in cur.fetchall():
            dic[i[0]]=i[1]
        print(dic)
        try:
            os.mkdir(zip_folder)
        except:
            shutil.rmtree(zip_folder) 
            os.mkdir(zip_folder)
        for j in id:
            j=int(j)         
            src=data_folder+'/'+filename+dic[j]
            dst=zip_folder+'/'+dic[j]
            print(src,dst)
            shutil.copyfile(src, dst)
        ts=(datetime.datetime.now().timestamp())
        filename = str(ts)+".zip"
        zipf = zipfile.ZipFile(os.getcwd()+'/zip/'+filename, 'w', zipfile.ZIP_DEFLATED)
        zipdir(zip_folder+"/", zipf)
        zipf.close()
        send_zip_mail(reciever,filename)
        output={"msg":"Suucess","status":200}
        return jsonify(output)
    return jsonify({})

if __name__ == '__main__':
    app.run()