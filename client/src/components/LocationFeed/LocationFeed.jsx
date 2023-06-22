import React, { useState, useContext, useEffect } from 'react'
import { LoggedInContext } from '../../App'

const LocationFeed = ({ selectedAttic }) => {
  const [posts, setPosts] = useState([])
  const { loggedIn } = useContext(LoggedInContext)

  const postCommment = (postId, content) => {
    fetch('http://localhost:8080/comments', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({comment: content,
        user_id: loggedIn.id,
        post_id: postId})
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .then(() => fetchPostsWithComments())
    .catch(err => console.log(err))
  }

  const parseDate = (date) => {
    const createdDate = new Date(date)
    const year = createdDate.getFullYear()
    const month = createdDate.getMonth() + 1
    const day = createdDate.getDate()

    const formattedDate = `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}-${year}`

    return formattedDate
  }

  const fetchPostsWithComments = () => {

    if (selectedAttic) {
      fetch(`http://localhost:8080/posts?attic_id=${selectedAttic.id}`)
      .then(res => res.json())
      .then(async data => {
        const postsWithComments = await Promise.all(data.map(async post => {
          const res = await fetch(`http://localhost:8080/comments?post_id=${post.id}`);
          const comments = await res.json();
          return {...post, comments};
        }));
        setPosts(postsWithComments);
      })
      .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    fetchPostsWithComments()
  }, []);

  return (
    <>
    {posts.length > 0 ? (
      <div className='FeedContainer gap-10 p-4 mt-4 justify-center items-center w-2/3'>
      <h1 className='FeedHeader text-[#45A29E] text-3xl font-semibold bg-gray-300 rounded-md shadow text-center p-4 w-1/5 ml-4'>Feed:</h1>
        {posts.map(post => (
            <div key={post.id} className='PostContainer flex flex-col m-4 p-4 bg-gray-300 rounded-md shadow'>
                <h1 className='PostHeader text-[#45A29E] text-3xl font-semibold mb-10'>{post.header}</h1>
                <p className='PostBody text-[#222222] mb-10'>{post.body}</p>
                <h2 className='CommentsHeader text-[#45A29E] text-xl font-semibold mb-2'>Comments</h2>
                {post.comments && post.comments.map(comment => (
                  <div className='CommentCard shadow-md rounded-md mb-4 p-2'>
                    <p className='PostDate text-[#222222]'>{comment.name} on {parseDate(comment.created_at)}</p>
                    <p key={comment.id} className='Comments text-[#222222] mb-2'>{comment.comment}</p>
                  </div>
                ))}
                {loggedIn.isLoggedIn ? (
                  <div className='flex flex-row items-center gap-5'>
                    <input
                      type='text'
                      className='CommentInput w-1/5 p-2 mb-4 bg-white rounded-md shadow mt-4 transition-all focus:w-full'
                      placeholder='Add a comment...'
                      onKeyDown={event => {
                        if (event.key === 'Enter') {
                            postCommment(post.id, event.target.value);
                            event.target.value = '';
                        }
                    }}
                  />
                </div>) : null}
                <p className='PostDate text-[#222222] text-left'>Post Created: {parseDate(post.created_at)}</p>
            </div>
        ))}
    </div>
    ) : null}
    </>
  );

}

export default LocationFeed