const express = require("express");
const app = express();

const bodyParser = require("body-parser")
const cors = require("cors")

const path = require("path")

const dbPath = path.join(__dirname,"mock.db")

const {open} = require("sqlite");

const sqlite3 = require("sqlite3").verbose();


const db = new sqlite3.Database("./mock.db",sqlite3.OPEN_READWRITE)


app.use(express.json())
//app.use(bodyParser.json())
app.use(cors())
let myDatabase;

const initialzeDbAndServer = async() =>{
   try{
    myDatabase = await open({
           filename:dbPath,
           driver:sqlite3.Database
    })
    app.listen(3010,()=>(console.log("Initialize successful")))
   }
   catch(e){
    console.log(`DB Error ${e.message}`)
    process.exit(1)
   }
}


// app.listen(3010,()=>
//     (console.log("HI"))
// )
//sql = `INSERT INTO user(username,first_name,last_name,email) VALUES ("rakesh@123","Rakesh","Kumar","rakesh@gmail.com");`;
//db.run(sql)


initialzeDbAndServer()
console.log("Hi")

app.get(`/user`,async(request,response)=>{
    console.log("Hi")
    const getUserQuery = `
    SELECT * FROM user;`;
    const userQuery = await myDatabase.all(getUserQuery);
    console.log(userQuery);
    response.send(userQuery);
    
});

app.get("/user/:id",async(request,response)=>{
    const {id} = request.params;

    console.log("Hi")
    const getUserQuery = `
    SELECT * FROM user WHERE id = ${id}; `;
    const userQuery = await myDatabase.get(getUserQuery);
    console.log(userQuery);
    response.send(userQuery);
    
});

app.put("/user/:id",async(request,response)=>{
    const {id} = request.params
    const userDetails = request.body
    const {username,firstname,lastname}  = userDetails
    const userUpdateId = `
    UPDATE user SET username='${username}',first_name= '${firstname}',last_name = '${lastname}'
    WHERE id = ${id};`;
    await myDatabase.run(userUpdateId);
    response.send("Book Updated Successfully")

})

app.delete("/user/:id",async(request,response)=>{
    const {id} = request.params
    const deleteQuery = `
    DELETE FROM user WHERE id = ${id};`
    await myDatabase.run(deleteQuery);
    response.send("Delete Successfully");
})

app.post("/user",async(request,response)=>{
    const userDetails  = request.body
    const {username,first_name,last_name} = userDetails
    const checkUserRegister = `
    SELECT * FROM user WHERE username = '${username}';`
    const checkInDataBase = await myDatabase.get(checkUserRegister)
    if (checkInDataBase !==undefined){
        response.send("User already registered")
        console.log("User already registered")
    }else{
       const userDetailsUpdated = `INSERT INTO user (username,first_name,last_name) VALUES('${username}','${first_name}','${last_name}');`;
       await myDatabase.run(userDetailsUpdated) ;
       response.send("User Register Successfully")
    }

})