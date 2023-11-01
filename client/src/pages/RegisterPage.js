import React, { useState } from 'react'

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const register = async (ev)=>{
    ev.preventDefault();
    
  const response =  await fetch('http://localhost:3001/register',{
    headers:{'Content-Type':"application/json"},
    method:"POST",
    body:JSON.stringify({username,password})
   })
   if(response.status !== 200){
    alert("Registration failed");
   }
   else{
    alert("Registration succesfull");
   }

  }

  return (
    <form className='register' onSubmit={register}>
      <h1>Register</h1>
      <input type="text" placeholder='username' value={username} onChange={(e) => {
        setUsername(e.target.value)
      }} />
      <input type="password" placeholder='password' value={password} onChange={(e) => {
        setPassword(e.target.value)
      }} />
      <button type="submit">Register</button>
    </form>
  )
}

export default RegisterPage
