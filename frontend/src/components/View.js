import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function View() {
    const location=useLocation();
    const id=location.state.id;

    const [title,setTitle]=useState('');
    const [content,setContent]=useState('');
    const [author,setAuthor]=useState('');

    const viewdata=async()=>{
        const res=await fetch(`http://localhost:3000/view/${id}`,{
            method:"GET",
            headers:{"content-Type":"application/json"},
            credentials:"include"
        });
        const data=await res.json();
        const blog=data.blog;
        setTitle(blog.title);
        setContent(blog.content);
        setAuthor(blog.name);
    }

    useEffect(()=>{
        viewdata();
    },[id]);
  return (
    <>
    <h1>{title}</h1>
    <p>{content}</p>
    <h5>-{author}</h5>
    </>
  )
}
