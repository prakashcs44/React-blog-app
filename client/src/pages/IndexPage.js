import React, { useEffect, useState } from 'react'
import Post from '../components/Post'

function IndexPage() {
  const [posts,setPosts] = useState([]);
  useEffect(()=>{
    fetch("http://localhost:3001/post").then(res=>{
      res.json().then(post=>{
         setPosts(post);
      })
    })
  },[])
  return (
  <>
 {posts.length>0 && posts.map(post=>{
  return <Post {...post} key={post._id}/>
 })}
  </>
  )
}

export default IndexPage
