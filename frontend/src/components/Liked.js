import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoHeart,GoHeartFill } from 'react-icons/go';
import {ImBin} from'react-icons/im';
import {FaRegComment} from 'react-icons/fa';
import {FaComment} from 'react-icons/fa6';
import {RiCloseCircleFill} from 'react-icons/ri';
import {IoSaveOutline,IoSave} from 'react-icons/io5';
import "./Home.css";

export default function Liked() {
    const location=useLocation();
    const navigate=useNavigate();
    const id=location.state.id;
    const [userId,setUserId]=useState('');
    const [user,setUser]=useState('');
    const [blogs,setBlogs]=useState([]);
    const [comment, setComment] = useState('');
    const [viewcomment, setViewcomment] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [activeBlog, setActiveBlog] = useState(null);

    const viewblogs=async()=>{
    const res=await fetch('http://localhost:3000/view-blogs',{
        method:"GET",
        headers:{"content-Type":"application/json"},
        credentials:"include"
    });
    const data=await res.json();
    if(res.ok) setBlogs(data.blogs);
    }

    const protecthandle=async()=>{
    const res=await fetch('http://localhost:3000/verify',{
        method:"GET",
        headers:{"content-Type":"application/json"},
        credentials:"include"
    });
    if(res.ok){
    const data=await res.json();
    setUserId(data.id);
    setUser(data.user);
    }
    else{
        setUserId("");
        setUser("");
    }
  }

      const like=async(id)=>{
        const res=await fetch('http://localhost:3000/like',{
            method:"PATCH",
            headers:{"content-Type":"application/json"},
            credentials:"include",
            body: JSON.stringify({id})
        });
    }

    const addcomment=async(id)=>{
        const res=await fetch('http://localhost:3000/comments',{
            method:"PATCH",
            headers:{"content-Type":"application/json"},
            credentials:"include",
            body: JSON.stringify({id,comment})
        });
        if (res.ok) {
    await viewComments(id);
  }
    }

    const deletecomment=async(id,blogId)=>{
        console.log("1");
        console.log(id);
        console.log(blogId);
        const res=await fetch('http://localhost:3000/delete-comment',{
            method:"DELETE",
            headers:{"content-Type":"application/json"},
            credentials:"include",
            body: JSON.stringify({id,blogId})
        });
        if(res.ok) console.log("Deleted.");
        else console.log("Not deleted.");
    }

    const viewComments=async(id)=>{
        const res=await fetch(`http://localhost:3000/view/${id}`,{
            method:"GET",
            headers:{"content-Type":"application/json"},
            credentials:"include"
        });
        const data=await res.json();
        setViewcomment(data.blog.comments);
    }

    const save=async(id)=>{
        const res=await fetch('http://localhost:3000/save',{
            method:"PATCH",
            headers:{"content-Type":"application/json"},
            credentials:"include",
            body: JSON.stringify({id})
        });
        if(res.ok) protecthandle();
    }

    const deleteblog=async(id)=>{
        const res=await fetch('http://localhost:3000/delete-blog',{
            method:"DELETE",
            headers:{"content-Type":"application/json"},
            credentials:"include",
            body: JSON.stringify({id})
        });
        if(res.ok) viewblogs();
    }


    useEffect(()=>{
      protecthandle();
    },[]);

    useEffect(()=>{
      viewblogs();
    });
  return (
    <>
    <h1>Liked Blogs</h1>
    <div style={styles.container}>
          {blogs.map(blog => (
            <>
            {blog.likes.includes(id)&&(
            <div key={blog._id} style={styles.card}>
              <div onClick={()=>{navigate('/view',{state:{id:blog._id}})}} style={box.card}>
              <h3>{blog.name}</h3>
              <p>{blog.title}</p>
              </div>
              <h4 className='like' onClick={()=>like(blog._id)}>{blog.likes.includes(userId) ? <><GoHeartFill className='likes'/><span className="tooltip">Unlike</span></>: <><GoHeart className='likes'/><span className="tooltip">Like</span></>}&nbsp;&nbsp;{blog.likes.length}</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <h4 className='comment' onClick={()=>{ setActiveBlog(blog); setShowComments(true); viewComments(blog._id);}}><FaRegComment className='comments'/>&nbsp;&nbsp;{blog.comments.length}<span className="tooltip">Comments</span></h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <h4 className='save' onClick={()=>{save(blog._id)}}>{user.blogs.includes(blog._id)?  <><IoSave className='saves'/><span className="tooltip">Unsave</span></> : <><IoSaveOutline className='saves'/><span className="tooltip">Save</span></>}</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {userId===blog.logId &&(
              <h4 className='delete' onClick={()=>{deleteblog(blog._id)}}><ImBin className='deletes'/><span className="tooltip">Delete</span></h4>
              )}
              {showComments && (
            <div className="modal-overlay" onClick={() => setShowComments(false)}>
                <div className="modal-card" onClick={e => e.stopPropagation()}>
                <div className="comments-header">
                <h3>Comments</h3>
                <h3 className="comment" onClick={() => setShowComments(false)}><RiCloseCircleFill className='comments'/><span className="tooltip">Close</span></h3>
                </div>
                {viewcomment.map(com => (
                    <div key={com._id} className="comm">
                    <div className="comm-left">
                    <h4>{com.userName}</h4>
                    <p>- {com.comment}</p>
                    </div>
                    {userId===com.userId && (
                        <div>
                           <h4 className='delete' onClick={async()=>{ await deletecomment(com._id,com.id); viewComments(com.id);}}><ImBin className='deletes'/><span className="tooltip">Delete</span></h4>
                        </div>
                    )}
                    </div>
                ))}
                <div className='add-comment'>
                <input placeholder="Add a comment" onChange={e => setComment(e.target.value)}/>&nbsp;&nbsp;
                <h4 className="comment" onClick={() => addcomment(activeBlog._id)}><FaComment className='comments'/><span className="tooltip">Comment</span></h4>
                </div>
                </div>
            </div>
            )}
            </div>
          )}
          </>
          ))}
        </div>
    </>
  )
}

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  card: {
    width: "250px",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
};

const box = {
  container: {
    flexWrap: "wrap",
    gap: "20px",
  },
  card: {
    width: "200px",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(33, 27, 27, 0.1)",
    //color: "white",
    backgroundColor: "#857c7cff",
  },
};