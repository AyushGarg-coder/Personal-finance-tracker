const express=require('express')
const cors=require('cors')
const bodyparser=require('body-parser')
const bcyrpt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {MongoClient}=require('mongodb')
const app=express()

const dbName='fianance-app'
const saltRounds=10

app.use(bodyparser.json())
app.use(cors())
const client=new MongoClient('mongodb://127.0.0.1/27017')


app.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body
        await client.connect()
        const db=client.db(dbName)
        const collection=db.collection('user-data')
        const data=await collection.findOne({email:email})
        if(!data){
            res.status(400).json("Email Does Not Match")
            return
        }
        else{
            bcyrpt.compare(password,data.password,async(err,result)=>{
                if(err){
                    res.status(500).json(err)
                    return
                }
                if(result){
                    const token=jwt.sign({email:email},'cat',{expiresIn:'1h'})
                    res.status(200).json({"name":data.name,"token":token})
                }
                if(!result){
                    res.status(404).json('Password does not match')
                }
            })
        }
    }
    catch(e){
        res.status(500).json(e)
    }
    finally{
        await client.close()
    }
})

app.post('/signup',async(req,res)=>{
    try{
        const {name,email,password}=req.body
        if(name && email && password){
            bcyrpt.hash(password,saltRounds,async(err,hash)=>{
                if(err){
                    res.status(500).json(err)
                }
                else if(hash){
                    await client.connect()
                    const db=client.db(dbName)
                    const collection=db.collection('user-data')
                    await collection.insertOne({name:name,email:email,password:hash})
                    res.status(200).json('Data saved Successfully')
                }
                else{
                    res.status(500).json('Cannot Save Data')
                }
            })
        }
        else{
            res.status(400).json("Invalid Data")
        }
    }
    catch(e){
        res.status(500).json(e)
    }
    finally{
        await client.close()
    }
})

app.post('/checkAuth',async(req,res)=>{
    try{
        const {email,token}=req.body

        if(email,token){
            jwt.verify(token,"cat",(err,result)=>{
                if(err){
                    res.status(400).json('Invalid Token')
                }
                if(result){
                    res.status(200).json('Login Successful')
                }
            })
        }
        else{
            res.status(404).json('No Valid Authentication')
        }
    }
    catch(e){
        // console.log(e)
        res.status(500).json("Oops! Server Error")
    }
    finally{
        await client.close()
    }
})

app.listen(3000,async()=>{
    console.log('Server started successfully')
})