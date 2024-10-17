import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import CommentDialog from './CommentDialog';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
import { setPosts, setSelectedPost } from '../redux/postSlice';
import { Badge } from 'react-bootstrap';


const Post = ({ post }) => {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { post_find } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const { suggestedusers } = useSelector(store => store.auth);
  // Likes state
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLikes, setPostLikes] = useState(post.likes.length);
  const [commentCount, setCommentCount] = useState(post.comments.length);

  // Handle like/dislike
  const likeDislike = async () => {
    try {
      const token = Cookies.get('accesstoken');
      const headers = { token };

      const action = liked ? 'dislike' : 'like';
      const response = await axios.get(`http://localhost:4000/api/${post._id}/${action}`, { headers });

      if (response.data.success) {
        setLiked((prev) => !prev);
        setPostLikes((prev) => (liked ? prev - 1 : prev + 1));

        // Update the global post list with the like changes
        const updatedPosts = post_find.map((p) =>
          p._id === post._id
            ? {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            }
            : p
        );
        dispatch(setPosts(updatedPosts));
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error('Error in like/dislike:', error);
      toast.error(error.response?.data?.message || 'Error while liking/disliking the post.');
    }
  };

  // Handle comment submission
  const commentHandler = async () => {
    if (!text.trim()) return;
    try {
      const token = Cookies.get('accesstoken');
      const headers = { token };

      const response = await axios.post(
        `http://localhost:4000/api/${post._id}/comment`,
        { text },
        { headers }
      );

      if (response.data.success) {
        const newComment = response.data.comment;

        const updatedComments = [...post.comments, newComment];
        setCommentCount(updatedComments.length);

        const updatedPosts = post_find.map((p) =>
          p._id === post._id ? { ...p, comments: updatedComments } : p
        );
        dispatch(setPosts(updatedPosts));
        setText('');
        toast.success('Comment posted successfully!');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to post the comment.');
    }
  };

  // Handle post deletion
  const deletePostHandler = async () => {
    try {
      const token = Cookies.get('accesstoken');
      const headers = { token };

      const response = await axios.delete(`http://localhost:4000/api/delete/${post._id}`, {
        headers,
      });

      if (response.data.success) {
        const updatedPosts = post_find.filter((p) => p._id !== post._id);
        dispatch(setPosts(updatedPosts));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error.response?.data?.message || 'Failed to delete post.');
    }
  };

  const bookmarkaHandler = async () =>{
    try {
      const token = Cookies.get('accesstoken')
      let headers = {token}
      const res = await axios.get(`http://localhost:4000/api/${post._id}/bookmark`,{headers})
      if(res.data.success){
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const folloOrUnfollowHandler = async () => {
    try {
      const token = Cookies.get('accesstoken');
      const headers = { token };
  
      // Use the author's user ID for follow/unfollow, not the post ID
      const response = await axios.post(
        `http://localhost:4000/api/followOrUnfollow/${post.author._id}`, 
        {}, // No request body required here
        { headers } // Headers sent here
      );
  
      if (response.data.success) {
        toast.success(response.data.message);
  
        // Optionally update the UI here if needed (e.g., change button text)
      }
    } catch (error) {
      console.error('Error in follow/unfollow:', error);
      toast.error(error.response?.data?.message || 'Failed to follow/unfollow.');
    }
  };
  

  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      <div className='flex items-center gap-4 bg-white shadow-md p-4 rounded-lg'>
        {/* Avatar */}
        <Avatar className={'w-12 h-12 rounded-full'}>
          <AvatarImage src={post.author?.profilePhoto} alt={post.author?.username} />
          <AvatarFallback>{post.author?.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* Username */}
        <div className={'flex items-center gap-3'}>
          <h5 className='text-lg font-semibold text-gray-800'>{post.author?.username}</h5>
          {user?._id === post?.author?._id && <Badge bg="secondary">Author</Badge>}
        </div>
      </div>

      {/* Post Image */}
      {post.image && (
        <img
          className={'rounded-sm my-2 w-full aspect-square object-cover'}
          src={post.image}
          alt="post_img"
        />
      )}

      {/* Post Options */}
      <Dialog>
        <DialogTrigger asChild>
          <MoreHorizontal className={'cursor-pointer'} />
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center text-sm text-center">
          
           {post?.author?._id !== user?._id && (
            <button onClick={folloOrUnfollowHandler} className={'cursor-pointer w-fit text-[#ED4956] font-bold'}>
              {user.following.includes(post.author._id) ? 'Unfollow' : 'Follow'}
            </button>
          )}
          
          
          
          <button className={'cursor-pointer w-fit '}>Add to favorites</button>
          {user?._id === post.author._id && (
            <button onClick={deletePostHandler} className={'cursor-pointer w-fit text-[#ED4956] font-bold'}>
              Delete
            </button>
          )}
        </DialogContent>
      </Dialog>

      {/* Post Interaction Icons */}
      <div className={'flex items-center justify-between my-2'}>
        <div className={'flex items-center gap-3'}>
          {liked ? (
            <FaHeart
              onClick={likeDislike}
              size={'24'}
              className={'cursor-pointer text-red-600'}
            />
          ) : (
            <FaRegHeart
              onClick={likeDislike}
              size={'22px'}
              className={'cursor-pointer hover:text-gray-600'}
            />
          )}
          <MessageCircle
            className={'cursor-pointer hover:text-gray-600'}
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
          />
          <Send className={'cursor-pointer hover:text-gray-600'} />
        </div>
        <Bookmark onClick={bookmarkaHandler} className={'cursor-pointer hover:text-gray-600'} />
      </div>

      {/* Like Count */}
      <span className={'font-medium block mb-2'}>{postLikes} likes</span>

      {/* Post Caption */}
      {post.caption && (
        <p>
          <span className={'font-medium mr-2'}>{post.author?.username}</span>
          {post.caption}
        </p>
      )}

      {/* Comments */}
      {commentCount > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className={'cursor-pointer text-sm text-gray-400'}
        >
          View all {commentCount} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />

      {/* Add Comment */}
      <div className="flex items-center mt-2">
        <input
          className={'outline-none flex-1 border-b border-gray-300 py-2'}
          type="text"
          value={text}
          placeholder={'Add a comment...'}
          onChange={(e) => setText(e.target.value)}
        />
        {text && (
          <span className={'text-[#3BADF8] cursor-pointer ml-2'} onClick={commentHandler}>
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
