"use client"

import React, { useState } from 'react';
import { useContract } from '../../lib/ContractContext';

function SocialMediaComponent() {
  const { contract } = useContract();
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [posts, setPosts] = useState([]);

  const registerUser = async () => {
    setIsLoading(true);
    try {
      await contract.registerUser(username);
      setErrorMessage('');
      setUsername('');
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  const createPost = async () => {
    setIsLoading(true);
    try {
      await contract.createPost(content);
      setErrorMessage('');
      setContent('');
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  const likePost = async (postId) => {
    setIsLoading(true);
    try {
      await contract.likePost(postId);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  const addComment = async (postId, comment) => {
    setIsLoading(true);
    try {
      await contract.addComment(postId, comment);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const count = await contract.getPostsCount();
      const fetchedPosts = [];
      for (let i = 0; i < count; i++) {
        const post = await contract.getPost(i);
        fetchedPosts.push(post);
      }
      setPosts(fetchedPosts);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Register User</h5>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={registerUser} disabled={isLoading}>Register</button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Create Post</h5>
              <div className="mb-3">
                <textarea className="form-control" rows="3" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
              </div>
              <button className="btn btn-primary" onClick={createPost} disabled={isLoading}>Create Post</button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <button className="btn btn-primary" onClick={getPosts} disabled={isLoading}>Get Posts</button>
      </div>
      <div className="mt-3">
        {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
        <h3>Posts</h3>
        <ul className="list-group">
          {posts.map((post, index) => (
            <li className="list-group-item" key={index}>
              <strong>Author:</strong> {post.author}<br />
              <strong>Content:</strong> {post.content}<br />
              <strong>Likes:</strong> {post.likes}
              <button className="btn btn-primary ml-2" onClick={() => likePost(index)} disabled={isLoading}>Like</button><br />
              <strong>Comments Count:</strong> {post.commentsCount}
              <div className="mt-2">
                <input type="text" className="form-control" placeholder="Add a comment" />
                <button className="btn btn-primary mt-2" onClick={() => addComment(index, 'comment')} disabled={isLoading}>Add Comment</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SocialMediaComponent;
