import React, { use, useEffect } from 'react';
import { data, useNavigate,Link } from 'react-router-dom';
import { useState } from 'react';
import { GoHeart,GoHeartFill } from 'react-icons/go';
import {CgProfile} from 'react-icons/cg';
import {ImBin} from'react-icons/im';
import {FaComment} from 'react-icons/fa6';
import {FaRegComment} from 'react-icons/fa';
import {RiCloseCircleFill} from 'react-icons/ri';
import { BiSolidMessageAdd } from "react-icons/bi";
import {MdSaveAs} from 'react-icons/md';
import { TbDoorExit } from "react-icons/tb";
import { BsFillPencilFill } from "react-icons/bs";
import {IoSaveOutline,IoSave,IoHeartCircleSharp} from 'react-icons/io5';
import { TfiPencilAlt } from "react-icons/tfi";
import "./Home.css";

export default function Home() {
    const navigate=useNavigate();

    const [content,setContent]=useState('');
    const [search,setSearch]=useState('');
    const [title,setTitle]=useState('');
    const [blogs,setBlogs]=useState([]);
    const [userId,setUserId]=useState('');
    const [user,setUser]=useState('');
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [viewcomment, setViewcomment] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [activeBlog, setActiveBlog] = useState(null);
    const [edit,setEdit]=useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

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

    const logout=async()=>{
        const res=await fetch('http://localhost:3000/logout',{
            method:"GET",
            headers:{"content-Type":"application/json"},
            credentials:"include"
        });
        console.log(await res.json());
        setUserId("");
    }

    const addblog=async()=>{
        const res=await fetch('http://localhost:3000/add-blog',{
           method:"POST",
           headers:{"content-Type":"application/json"},
           credentials:"include",
           body: JSON.stringify({content,title})
        });
        if(res.ok) alert("Blog Added");
        else alert("Doesn't Added");
    }

    const deleteblog=async(id)=>{
        const res=await fetch('http://localhost:3000/delete-blog',{
            method:"DELETE",
            headers:{"content-Type":"application/json"},
            credentials:"include",
            body: JSON.stringify({id})
        });
        if(res.ok) console.log("Deleted.");
        else console.log("Not deleted.");
    }

    const viewblogs=async()=>{
        const res=await fetch('http://localhost:3000/view-blogs',{
           method:"GET",
           headers:{"content-Type":"application/json"},
           credentials:"include"
        });
        const data=await res.json();
        if(res.ok) setBlogs(data.blogs);
    }

    const editblog=async(blogId)=>{
        const res=await fetch('http://localhost:3000/edit-blog',{
           method:"PATCH",
           headers:{"content-Type":"application/json"},
           credentials:"include",
           body: JSON.stringify({blogId,editContent,editTitle})
        });
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
    useEffect(()=>{
        protecthandle();
    },[]);

    useEffect(()=>{
        viewblogs();
    });

  return (
    <>
    {
    userId!==""
    ?(
    <div>   
    <nav className="navbar">
    <h2 className="logo">Blogs</h2>
    <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>

        <li className="profile-menu">
        <CgProfile className='profile-colour' onClick={() => setOpen(!open)} />
        
        {open && (
            <div className="dropdown">
            <button className="saved-btn" onClick={logout}>Logout<TbDoorExit className='saved'/></button>
            <p></p>
            <button className="saved-btn" onClick={()=>{navigate("/saved",{state:{id:userId}})}}>Saved<MdSaveAs className='saved'/></button>
            <p></p>
            <button className="saved-btn" onClick={()=>{navigate("/liked",{state:{id:userId}})}}>Liked<IoHeartCircleSharp className='saved'/></button>
            </div>
        )}
        </li>
    </ul>
    </nav>
    <br/><br/>
    <div  onClick={() => setOpen(false)}>
    <div className='add-blog'>
    <input placeholder="Enter Title" onChange={(e)=>{setTitle(e.target.value)}}/>
    <input placeholder="Enter contents to add" onChange={(e)=>{setContent(e.target.value.toLowerCase())}}/>
    <h4 onClick={addblog} className='add-icon'><BiSolidMessageAdd/></h4><br/><br/>
    </div>
    <div className='center-wrapper'>
    <input placeholder='Enter blog title' className='search' onChange={(e)=>{setSearch(e.target.value)}}/>
    </div>
    <div style={styles.container}>
      {blogs.map(blog => (
        <div>
        {blog.title.toLowerCase().includes(search)&&(
        <div key={blog._id} style={styles.card}>
          <div onClick={()=>{navigate('/view',{state:{id:blog._id}})}} style={box.card}>
          <h3>{blog.name}</h3>
          <p>{blog.title}</p>
          </div>
          <h4 className='like' onClick={()=>like(blog._id)}>{blog.likes.includes(userId) ? <><GoHeartFill className='likes'/><span className="tooltip">Unlike</span></>: <><GoHeart className='likes'/><span className="tooltip">Like</span></>}&nbsp;&nbsp;{blog.likes.length}</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <h4 className='comment' onClick={()=>{ setActiveBlog(blog); setShowComments(true); viewComments(blog._id);}}><FaRegComment className='comments'/>&nbsp;&nbsp;{blog.comments.length}<span className="tooltip">Comments</span></h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {userId!==blog.logId ?(
          <>
          <h4 className='save' onClick={()=>{save(blog._id)}}>{user.blogs.includes(blog._id)?  <><IoSave className='saves'/><span className="tooltip">Unsave</span></> : <><IoSaveOutline className='saves'/><span className="tooltip">Save</span></>}</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </>
          ):(
          <>
          <h4 className="edit" onClick={() => {setEdit("edit"); setEditTitle(blog.title); setEditContent(blog.content); setActiveBlog(blog); }}><BsFillPencilFill className="edits" /><span className="tooltip">Edit</span></h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </>
          )}
           {edit === "edit" && (
            <div className="edit-overlay" onClick={() => setEdit("")}>
              <div className="edit-card" onClick={(e) => e.stopPropagation()}>
                <div className="edit-header">
                  <h3>Edit Blog</h3>
                  <RiCloseCircleFill className="close-icon" onClick={() => setEdit("")}/>
                </div>
                <input className="edit-input" placeholder="Edit title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}/>
                <textarea className="edit-textarea" placeholder="Edit content" value={editContent} onChange={(e) => setEditContent(e.target.value)}/>
                <div className='center-wrapper'>
                <h3 className="edits-btn" onClick={() => { editblog(activeBlog._id); setEdit(""); }}><TfiPencilAlt className='edit-btn'/><span className="tooltip">Edit changes</span></h3>
                </div>
              </div>
            </div>
          )}

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
      </div>
      ))}
    </div>
    </div>
    </div>
    )
    :(
    <div>
    <nav className="navbar">
      <h2 className="logo">Blogs</h2>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
    <br/><br/>
    <div style={styles.container}>
      {blogs.map(blog => (
        <div key={blog._id} style={styles.card}>
          <div onClick={()=>{navigate('/view',{state:{id:blog._id}})}} style={box.card}>
          <h3>{blog.name}</h3>
          <p>{blog.title}</p>
          </div>
          <h4 className='like'><><GoHeart className='likes'/><span className="tooltip">Login to Like</span></>&nbsp;&nbsp;{blog.likes.length}</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <h4 className='comment' ><FaRegComment className='comments'/>&nbsp;&nbsp;{blog.comments.length}<span className="tooltip">Login to Comment</span></h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <h4 className='save'><IoSaveOutline className='saves'/><span className="tooltip">Login to Save</span></h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      ))}
    </div>
    </div>
    )}
    </>
  );
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