import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';

const Posts = () => {
  const {  post_find } = useSelector((store) => store.post);

  if (! post_find ||  post_find.length === 0) {
    return <p>No  post_find available.</p>; // Add a fallback when no  post_find are available
  }

  return (
    <>
      { post_find.map((post) => (
        <Post key={post._id} post={post} />  // Ensure key is unique
      ))}
    </>
  );
};

export default Posts;
