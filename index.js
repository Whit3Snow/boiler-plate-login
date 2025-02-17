const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');

//var url1 = "mongodb://192.249.18.247:27017/Users";
var url = 'mongodb://wkdgywls03:ronharry23@192.249.18.247:27017/?authSource=test&readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const {User} = require("./models/User")
const {auth} = require("./middleware/auth");
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

//application/x-www-from-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

//application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

const mongoose = require('mongoose');
mongoose.connect(url,{useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false
}).then( () => console.log('Mongo DB connnect...'))
  .catch(err => console.log(err));



app.get('/',(req,res) => res.send('Hello World! 집에 갈래요 엄마 보고 싶어요 ㅜㅜ'))

app.get('/api/hello', (req,res) => {
    
    res.send("안녕하세요!")
})


app.post('/api/users/register',(req,res) => {

    //회원 가입 할때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.


    const user = new User(req.body)
    
    user.save((err,userInfo)=>{
        if(err) return res.json({success: false,err})
        return res.status(200).json({
            success:true
        })
    })
})

app.post('/api/users/login', (req,res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email: req.body.email},(err,user)=>{

        if(!user){
            return res.json({
                loginSuccess : false,
                message : "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
        user.comparePassword(req.body.password, (err,isMatch) => {

            if(!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            //비밀번호까지 맞다면 토큰을 생성하기.
            user.generateToken((err,user)=>{
                if (err) return res.status(400).send(err);

                // 토큰을 저장한다. 어디에? 쿠키,로컬 스토리지
                return res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess:true, userId: user._id})//리턴 값이 lofinSuccess true와 userid 임

            })
        })
    })
})

app.get('/api/users/auth',auth,(req,res)=>{
    
    //여기까지 미들웨어를 통과해왔다는 얘기는 Authecation 이 true 라는 말
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth : true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })

})

app.get('/api/users/logout',auth, (req,res)=>{
    console.log("여기에 들어왔나?? ㅜㅜ")
    User.findOneAndUpdate({_id:req.user._id},
        {token: ""}
        ,(err,user) => {
            console.log("여기에 들어왔나?? ㅜㅜ 2")
            if(err) return res.json({success: falsedfgdfg,err});
            return res.status(200).send({
                success:true
            })
        })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))