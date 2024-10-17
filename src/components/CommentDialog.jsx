import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { MoreHorizontal } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { setPosts } from '../redux/postSlice';

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState('');
  const { selectePost, post_find } = useSelector((store) => store.post);
  const [comments, setComments] = useState(selectePost?.comments || []); // Initialize comments with post's comments
  const dispatch = useDispatch();

  useEffect(() => {
    // Update local comments state when post changes
    if (selectePost) {
      setComments(selectePost.comments);
    }
  }, [selectePost]);

  const changeEventHandler = (e) => {
    setText(e.target.value.trim() ? e.target.value : '');
  };

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('accesstoken');
      const headers = {
        token: token,
      };

      // Send request to post the comment
      const response = await axios.post(
        `http://localhost:4000/api/${selectePost?._id}/comment`,
        { text },
        { headers: headers }
      );

      if (response.data.success) {
        const newComment = response.data.comment; // New comment from backend

        // Update local comment state
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);

        // Update the global state for the post with new comments
        const updatedPostData = post_find.map((p) =>
          p._id === selectePost._id ? { ...p, comments: updatedComments } : p
        );
        dispatch(setPosts(updatedPostData));
        // Clear the input field after posting the comment
        setText('');

        toast.success('Comment posted successfully!');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to post the comment.');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className={'max-w-4xl p-0 flex flex-col bg-white rounded-lg overflow-hidden shadow-lg'}
      >
        <div className={'flex'}>
          {/* Left: Image Section */}
          <div className={'w-1/2'}>
            <img
              className={'rounded-sm w-full h-full object-cover'}
              src={selectePost?.image}
              alt="post_img"
            />
          </div>

          {/* Right: Comments & Info Section */}
          <div className={'flex-1 flex flex-col justify-between'}>
            {/* Header */}
            <div className={'flex items-center justify-between p-4 border-b'}>
              <div className={'flex gap-3 items-center'}>
                <Link to={`/profile/${selectePost?.author._id}`}>
                  <Avatar className={'w-10 h-10'}>
                    <AvatarImage src={selectePost?.author?.profilePhoto} />
                    <AvatarFallback className={'bg-gray-300 text-white font-bold'}>
                      {selectePost?.author?.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className={'font-semibold text-sm'} to={`/profile/${selectePost?.author._id}`}>
                    {selectePost?.author?.username}
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className={'cursor-pointer text-gray-500 hover:text-black'} />
                </DialogTrigger>
                <DialogContent className={'flex flex-col items-center text-sm text-center'}>
                  <button className={'cursor-pointer w-full text-red-600 font-bold'}>Unfollow</button>
                  <button className={'cursor-pointer w-full'}>Add to favorites</button>
                </DialogContent>
              </Dialog>
            </div>

            {/* Comments Section */}
            <div className={'flex-1 overflow-y-auto max-h-96 p-4'}>
              {/* Render comments here */}
              {comments.length > 0 ? (
                comments.map((comment) => <Comment key={comment._id} comment={comment} />)
              ) : (
                <p className={'text-gray-500'}>No comments yet. Be the first to comment!</p>
              )}
            </div>

            {/* Add Comment Section */}
            <div className={'p-4 border-t'}>
              <div className={'flex items-center gap-3'}>
                <input
                  type="text"
                  placeholder={'Add a comment...'}
                  onChange={changeEventHandler}
                  value={text}
                  className={'w-full border p-2 rounded text-sm outline-none focus:border-blue-400'}
                />
                <button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  className={`${
                    !text.trim() ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white px-4 py-2 rounded font-semibold`}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
