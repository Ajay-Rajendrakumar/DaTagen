import cv2
import numpy as np
import random
import matplotlib.pyplot as plt
import os
import sqlite3
import datetime

def scale(img):
    (height, width) = img.shape[:2]
    res = cv2.resize(img, (int(random.randint(100,300)), int(random.randint(100,300))), interpolation = cv2.INTER_CUBIC)
    return res

def rotate(img):     
    (rows, cols) = img.shape[:2]
    M = cv2.getRotationMatrix2D((cols / 2, rows / 2), random.randint(0,360), 1)
    res = cv2.warpAffine(img, M, (cols, rows))
    return res

def translate(img):
    (rows, cols) = img.shape[:2]
    M = np.float32([[1,0,random.randint(-50,50)],[0,1,random.randint(-50,50)]])
    res = cv2.warpAffine(img, M, (cols, rows))
    return res

def shear(img):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    plt.axis('off')
    rows, cols, dim = img.shape
     # shearing applied to y-axis
    M=[]
    M = np.float32([[1,   0, 0],
                	  [0.5, 1, 0],
                	  [0,   0, 1]])
    # shearing applied to x-axis
    if(random.randint(0,10)/2==0):
        M = np.float32([[1, 0.5, 0],
                        [0, 1  , 0],
                        [0, 0  , 1]])
   
    sheared_img = cv2.warpPerspective(img,M,(int(cols*1.5),int(rows*1.5)))
    plt.axis('off')
    return sheared_img

def reflection(img):
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

def cvtColor(img):
    try:
        res = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY )
        return res
    except:
        print('error')
        return img

filename='xsnxs.jfif'
fileId='1'
original_loc = os.getcwd()+'/originalImage/'+filename
save_loc=os.getcwd()+'/generateDataset/'+filename
conn = sqlite3.connect('test.db')
try:
    os.mkdir(save_loc)
except:
    print("FolderExits")
for i in range(3):
    i=str(i)
    img = cv2.imread(original_loc)
    options=["scale","rotate","translate","shear","reflection","color"]
    for j in range(random.randint(0,5)):
        opt=options[random.randint(0,5)]
        if opt=="scale":
            img=scale(img)
        elif opt=="rotate":
            img=rotate(img)
        elif opt=="translate":
            img=translate(img)
        elif opt=="shear":
            img=shear(img)
        elif opt=="reflection":
            img=reflection(img)
        elif opt=="color":
            img=cvtColor(img) 
    imageName= "/datasetImage-"+i+".jpg"      
    cv2.imwrite(save_loc+imageName, img)
    cursor1 = conn.execute("SELECT * from DATASET")
    x = str(datetime.datetime.now())
    date=x.split(' ')[0]
    time=x.split(' ')[1].split('.')[0]
    conn.execute("INSERT INTO DATASET (ID,IMAGE,ORIGINAL,ISDELETE,DATE,TIME) VALUES ('"+str(len(cursor1.fetchall())+1)+"', '"+imageName+"', '"+fileId+"','0','"+date+"','"+time+"')")                 
    conn.commit()

cur=conn.execute("SELECT * from DATASET")                 
print(cur.fetchall())
conn.close


