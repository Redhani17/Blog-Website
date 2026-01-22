import React, { use, useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Home.css";

export default function Login() {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const navigate=useNavigate();
    
    const v=localStorage.getItem("token");
    
    const logincheck=async()=>{
      const res = await fetch('http://localhost:3000/login-check',{
        method:"GET",
        headers:{"content-Type":"application/json"},
        credentials:"include"
      });
      const data=await res.json();
      if(data.message==="Logged") navigate("/");
    }

    const handle = async()=>{
        const res = await fetch('http://localhost:3000/login',{
            method:"POST",
            headers:{"content-Type":"application/json"},
            credentials:"include",
            body: JSON.stringify({email,password})
        });
        if(res.ok) navigate("/");
        else alert("Login failed");
        // if(data.token){
        //     localStorage.setItem("token",data.token);
        //     alert("Login Successful.");
        //     navigate("/home");
        // }
        // else alert("Login Unsucsessful.");
    }

    useEffect(()=>{
      logincheck();
    });

  return (
    <>
    <input placeholder='Email' onChange={(e)=>{setEmail(e.target.value)}} />
    <p></p>
    <input placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}} />
    <p></p>
    <button onClick={handle}>Login</button>
    <p></p>
    <div className='login'>
    <p>Don't Have Account?</p>&nbsp;<u><p onClick={()=>{navigate('/signup')}} style={{ color: 'blue', cursor: 'pointer' }}>Signup</p></u>
    </div>
    </>
  )
}
