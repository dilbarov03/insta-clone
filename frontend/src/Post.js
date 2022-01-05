import React, {useState, useEffect} from "react";
import {Avatar, Button} from "@material-ui/core";
import "./Post.css"

const BASE_URL = 'http://localhost:8000/'

function Post({post, authToken, authTokenType, username}) {

   const [imageUrl, setImageUrl] = useState('')
   const[comments, setComments] = useState([])
   const[newComment, setNewComment] = useState('')

   useEffect(() => {
      if (post.image_url_type == 'absolute'){
         setImageUrl(post.image_url)
      } else {
         setImageUrl(BASE_URL + post.image_url)
      }

   }, [])

   useEffect(() => {
      setComments(post.comments)
   }, [])

   const handleDelete = (event) => {
      event?.preventDefault();

      const requestOptions = {
         method: 'GET',
         headers: new Headers({
            'Authorization': authTokenType + ' ' + authToken
         })
      }

      fetch(BASE_URL + 'post/delete/' + post.id, requestOptions)
         .then(response => {
            if(response.ok){
               window.location.reload()
            }
            throw response
         })
         .catch(error => {
            console.log(error);
         })
   }
   let username2 = window.localStorage.getItem('username')

   const postComment = (event) => {
      event?.preventDefault()

      const json_string = JSON.stringify({
         'username': username,
         'text': newComment,
         'post_id': post.id
      })

      const requestOptions = {
         method: 'POST',
         headers: new Headers({
            'Authorization': authTokenType + ' ' + authToken,
            'Content-Type': 'application/json'
         }),
         body: json_string
      }

      fetch(BASE_URL + 'comment', requestOptions)
         .then(response => {
            if (response.ok){
               return response.json()
            }
         })
         .then(data => {
            fetchComments()
         })
         .catch(error => {
            console.log(error);
         })
         .finally(() => {
            setNewComment('')
         })
   }

   const fetchComments = () => {
      fetch(BASE_URL + 'comment/all/' + post.id)
      .then(response => {
         if (response.ok) {
            return response.json()
         }
         throw response
      })
      .then(data => {
         setComments(data)
      })
      .catch(error => {
         console.log(error);
      })
   }

   return (
      <div className="post">
         <div className="post_header">
            <Avatar alt="Uktamjon" src="" />
            <div className="post_headerInfo">
               <h3>{post.user.username}</h3>
               
               {
                  authToken && (post.user.username==username2) ? (
                     <Button className="post_delete" onClick={handleDelete}>Delete</Button>
                  ) : (
                     <h1></h1>
                  )
               }                              
               
            </div>
         </div>

         <img className="post_image" src={imageUrl}></img>
         <h4 className="post_text">{post.caption}</h4>

         <div className="post_comments">
            {
               comments.map((comment) => (
                  <p>
                     <strong>{comment.username}:</strong> {comment.text}
                  </p>
               ))
            }
         </div>

         {authToken && (
            <form className="post_commentbox">
               <input className="post_input"
                  type="text" placeholder="Add a coment" value={newComment} onChange={(e) => setNewComment(e.target.value)}/>
               <button className="post_button" type="submit" disabled={!newComment} onClick={postComment}>Post</button>
            </form>
         )}

      </div>
   )
}

export default Post;