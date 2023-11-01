import { formatISO9075 } from 'date-fns';
import React, { useState,useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import {UserContext} from "../contexts/UserContext"


function PostPage() {
  const {id} = useParams();
  const {userInfo} = useContext(UserContext);
  const [postInfo,setPostInfo] = useState(null)
  useEffect(()=>{
    fetch(`http://localhost:3001/post/${id}`)
    .then(res=>{
        res.json().then((postInfo)=>{
           setPostInfo(postInfo);
        })
    })
  },[])
  if(!postInfo){
    return ''
  }
  return (
    <div className='post-page'>
     <h1>{postInfo.title}</h1>
     <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
     <div className='author'> by @{postInfo.author.username}</div>
     {userInfo.id === postInfo.author._id && (
      <div className='edit-row'>
        <Link to={`/edit/${postInfo._id}`} className='edit-btn'>Edit this post</Link>
      </div>

     )}
    <div className='image'>
    <img src = {`http://localhost:3001/${postInfo.cover.slice(7)}`}/>
    </div>
   
    <div className='content'  dangerouslySetInnerHTML={{__html:postInfo.content}}/>
    </div>
  )
}

export default PostPage

