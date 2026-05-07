import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [role,setRole]=useState('');

    const navigate=useNavigate();

    const handle = async()=>{
        const res=await fetch('http://localhost:3000/signup',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({name,email,password,role})
        });
        const data=await res.json();
        if(res.ok) navigate("/login");
    }
  return (
    <>
    <input placeholder='Username' onChange={(e)=>{setName(e.target.value)}} /> <br/>
    <input placeholder='Email' onChange={(e)=>{setEmail(e.target.value)}} /> <br/>
    <input placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}} /> <br/>
    <input placeholder='Role' onChange={(e)=>{setRole(e.target.value)}} /> <br/>
    <button onClick={handle}>Signup</button>
    </>
  )
}
