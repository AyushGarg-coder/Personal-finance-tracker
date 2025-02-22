import {Box, Button, styled, TextField, Typography} from '@mui/material'
import { useEffect, useState } from 'react'
import {ToastContainer,toast} from 'react-toastify'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Container=styled(Box)`
margin:auto;
margin-top:64px;
width:400px;
box-shadow:5px 2px 5px 2px rgb(0 0 0/0.6)
`

const Wrapper=styled(Box)`
display:flex;
flex:1;
flex-direction:column;
padding:25px 35px;
&>div,&>p,&>button{
margin-top:20px;
}
`

const Image=styled("img")({
    width:"100px",
    margin:'auto',
    padding:"50px 0 0",
    display:'flex'
})

const Text=styled(Typography)`
margin:auto;
color:gray;
font-size:16px;
`
const Loginbtn=styled(Button)`
text-transform:none;
height:48px;
border-radius:2px;
background-color:#1976d2;
color:white;
`
const SignUpbtn=styled(Button)`
text-transform:none;
height:48px;
border-radius:2px;
color:#1976d2;
`
const Error=styled(Typography)`
color:red;
font-family:italic;
font-size:10px;
margin:auto;

`

const loginIntitial={
    email:'',
    password:''
}

const signupInitial={
    name:'',
    email:'',
    password:''
}


const Login=({setUserAuthenticated})=>{
    const [account,setAccount]=useState("Login")
    const [login,setLogin]=useState(loginIntitial)
    const [signup,setSignup]=useState(signupInitial)
    const[error,setError]=useState("")
    const passwordPattern=/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?#&]{10,}$/;
    const patternName=/^[a-zA-z\s]+$/;
    const patternEmail=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const navigate=useNavigate();

    const handleChange=(e)=>{
        const {name,value}=e.target
        if(account==='Login'){
            if(name==='email'){
                if(value && !patternEmail.test(value)){
                    setError('Must be a valid email')
                }
                else{
                    setError("")
                }
            }
            if(name==='password'){
                if(value && !passwordPattern.test(value)){
                    setError('Password Must Contain a Digit, Alphabet (Uppercase and LowerCase) and symbol')
                }
                else{
                    setError("")
                }
            }
            setLogin({...login,[e.target.name]:e.target.value})
        }
        else{
            if(name==='password'){
                if(value && !passwordPattern.test(value)){
                    setError('Password Must Contain a Digit, Alphabet (Uppercase and LowerCase) and symbol')
                }
                else{
                    setError("")
                }
            }
            if(name==='email'){
                if(value && !patternEmail.test(value)){
                    setError('Must be a valid email')
                }
                else{
                    setError("")
                }
            }
                if(name==='name'){
                    if(value && !patternName.test(value)){
                        setError("Name Must contain Alphabet only")
                    }
                    else{
                        setError("")
                    }
                }
            setSignup({...signup,[e.target.name]:e.target.value})
        }
    }

    const handleLogin=async()=>{
        try{
            if(login.email && login.password){
                if(login.password && !passwordPattern.test(login.password)){
                    toast.info('Password is not correctly formatted')
                    return
                }
                if(login.email && !patternEmail.test(login.email)){
                    toast.info("Must be a valid Email")
                    return
                }
                else{
                        let response=await axios.post('http://localhost:3000/login',login)
                        if(response.status===200){
                            setUserAuthenticated(true)
                            // console.log(response.data)
                            localStorage.setItem('name',response.data.name)
                            localStorage.setItem('email',login.email)
                            localStorage.setItem('token',response.data.token)
                            toast.success("Login Successfull")
                            navigate("/")
                        }
                }
            }
        }
        catch(e){
            toast.error(e.response.data)
        }
    }

    const handleSignup=async()=>{
        try{
            if(signup.name && signup.email && signup.password){
                if(signup.password && !passwordPattern.test(signup.password)){
                    toast.info("Password is properly Formatted")
                    return
                }
                if(login.email && !patternEmail.test(login.email)){
                    toast.info("Must be a valid Email")
                    return
                }
                if(signup.name && !patternName.test(signup.name)){
                    toast.info('Name Must conatin Alphabet Only')
                    return
                }
                else{
                    let response=await axios.post('http://localhost:3000/signup',signup)

                    if(response.status===200){
                        setAccount('Login')
                        toast.success("Signup Successfull")
                    }
                }
            }
        }
        catch(e){
            toast.error(e.response.data)
        }
    }

    useEffect(()=>{
        const checkAuth=async()=>{
            try{
                const email=localStorage.getItem('email')
                const token=localStorage.getItem('token')

                if(token && email){
                    const response=await axios.post('http://localhost:3000/checkAuth',{email:email,token:token})
                    if(response.status===200){
                        setUserAuthenticated(true)
                        navigate('/')
                    }
                    else{
                        setUserAuthenticated(false)
                    }
                }
                else{
                    setUserAuthenticated(false)
                }
            }
            catch(e){

            }
        }
        checkAuth()
    },[navigate,setUserAuthenticated])

return(
    <Container>
        <ToastContainer/>
        <Box>
            <Image src="https://cdn-icons-png.flaticon.com/128/6054/6054322.png" alt='Logo'/>
            {
                account==="Login"?
            <Wrapper>
                <TextField variant='standard' type='email' name='email'  label="Enter the Email Id" value={login.email} onChange={handleChange} required/>
                <TextField variant='standard' type='password' name='password' label="Enter the Password" value={login.password} onChange={handleChange} required/>
                {
                    error!==""?<Error>{error}</Error> :<Typography></Typography>
                }
                {/* <Link to={"/login"} className="text-decoration-none fs-6" style={{}}>Forget Password ?</Link> */}
                <Loginbtn variant='contained' onClick={handleLogin}>Login</Loginbtn>
                {/* <Text>OR</Text> */}
                <hr/>
                <SignUpbtn variant='outlined' className='mt-0' onClick={() => { setAccount('Signup') }}>SignUp</SignUpbtn>
            </Wrapper>
                :
            <Wrapper>
                <TextField variant='standard' name='name' label="Enter the Name" value={signup.name} onChange={handleChange} required/>
                <TextField variant='standard' type='email' name='email' label="Enter the Email Id" value={signup.email} onChange={handleChange} required/>
                <TextField variant='standard'type='password' name='password' label="Enter the Password" value={signup.password} onChange={handleChange} required/>
                {
                    error!==""?<Error>{error}</Error> :<Typography></Typography>
                    
                }
                <Loginbtn variant='contained' onClick={handleSignup}>SignUp</Loginbtn>
                {/* <Text>OR</Text> */}
                <hr/>
                <SignUpbtn variant='outlined' className='mt-0' onClick={() => { setAccount('Login') }}>Login</SignUpbtn>
            </Wrapper>
            }
        </Box>
    </Container>
)
}

export default Login;