var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser');

var admin = require("firebase-admin");
var serviceAccount = require("./fir-test-7b098-firebase-adminsdk-6kx4f-b8d8fcfc77.json");
const { response, request } = require('express');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-test-7b098-default-rtdb.asia-southeast1.firebasedatabase.app"
});

var fireData = admin.database();
fireData.ref('todolist').once('value',(snapshot)=>{
   // console.log(snapshot.val());
}) 

app.engine('ejs',engine);
app.set('views','./views');
app.set('view engine','ejs');
//增加靜態檔案的路徑
app.use(express.static('public'))

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

//路由
app.get('/',function(req,res){
   fireData.ref('todolist').once('value',(snapshot)=>{
      var data = snapshot.val()
      res.render('index',{
         "data":data,
      })
      // res.send(data);

   })
})

app.get('/petlist',function (req,res) {
   fireData.ref('petData').once("value",(snapshot)=>{
      // var data = snapshot.val()
      res.send(snapshot.val())
   })
})

// fireData.ref('todolist').set({
//    "number":"0934153410"
// }).then(()=>{
//    fireData.ref('todolist').once('value',(snapshot)=>{
//       console.log(snapshot.val());
//    })
// })

// 新增邏輯
app.post('/addTodo',(request,response)=>{
   var content = request.body.content
   var contetnRef = fireData.ref('todolist').push();
   contetnRef.set({
      "content":content,
   }).then(()=>{
      fireData.ref('todolist').once('value',(snapshot)=>{
         // response.send(snapshot.val())
         response.send({
            "sucess":true,
            "result":snapshot.val(),
            "message":"資料讀取成功"
         })
      })
   })
})

// 刪除邏輯

app.post('/removeTodo',(request,response)=>{
   var _id = request.body.id;
   fireData.ref('todolist').child(_id).remove().then(()=>{
      fireData.ref('todolist').once('value',(snapshot)=>{
         response.send({
            "sucess":true,
            "result":snapshot.val(),
            "message":"資料刪除成功"
         })
      })
   })


})

// 監聽 port
var port = process.env.PORT || 3005;
app.listen(port);