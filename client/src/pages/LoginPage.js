import React,{ useContext, useState } from 'react'
import {Navigate} from "react-router-dom"
import { UserContext } from '../contexts/UserContext';
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);


  const login = async (e)=>{
   e.preventDefault();
   const response = await fetch("http://localhost:3001/login",{
    headers:{"Content-Type":"application/json"},
    method:"POST",
    body:JSON.stringify({
      username,
      password
    }),
    credentials:"include"
   })
   if(response.ok){
    response.json().then(userInfo=>{

      setUserInfo(userInfo);
      setRedirect(true);
    })
     
   }
   else{
    alert("wrong credentials");
   }

  }
  
  if(redirect){
    return <Navigate to = "/"/>
  }
  return (
  
    <form className='login' onSubmit={login}>
    <h1>Login</h1>
    <input type = "text" placeholder='username' value = {username} onChange = {(e)=>{
      setUsername(e.target.value)
    }}/>
    <input type = "password" placeholder='password' value = {password} onChange = {(e)=>{
      setPassword(e.target.value)
    }}/>
    <button type = "login">Login</button>
    </form>
    
  )
}

export default LoginPage
