/**
 * Social Media Component for a decentralized platform frontend.
 * Manages user registration, post creation, liking posts, commenting, and fetching posts.
 * @module SocialMediaComponent
 * @function
 */

"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContract } from '../../lib/ContractContext';

/**
 * @function SocialMediaComponent
 * @description React component for the social media platform.
 * @returns {JSX.Element} Rendered component.
 */
function SocialMediaComponent() {
  // State variables
  const { contract } = useContract();
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [commentText, setCommentText] = useState('');

  /**
   * @function useEffect
   * @description Effect to connect to the wallet on component mount.
   */
  useEffect(() => {
    async function connectToWallet() {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send('eth_requestAccounts', []);
          setWallet(provider.getSigner());
          setIsLoading(false);
        } else {
          throw new Error('Wallet connection not available.');
        }
      } catch (error) {
        console.error(error);
      }
    }

    connectToWallet();
  }, []);

  /**
   * @function useEffect
   * @description Effect to fetch registered user on component mount.
   */
  useEffect(() => {
    async function fetchRegisteredUser() {
      try {
        if (wallet) {
          const address = await wallet.getAddress();
          const user = await contract.getUserByAddress(address);
          console.log(user);
          if (user) {
            setRegisteredUser(user);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchRegisteredUser();
  }, [wallet]);

  /**
   * @function useEffect
   * @description Effect to fetch posts on component mount.
   */
  useEffect(() => {
    async function fetchPosts() {
      try {
        await getPosts();
      } catch (error) {
        console.error(error);
        setMessage(error.message);
      }
    }

    if (contract) {
      fetchPosts();
    }
  }, [contract]);

  /**
   * @function registerUser
   * @description Function to register a user.
   */
  const registerUser = async () => {
    try {
      const address = await wallet.getAddress();
      const tx = await contract.registerUser(username, { from: address });
      await tx.wait();
      setMessage('User registered successfully.');
      setUsername('');
      fetchRegisteredUser();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  /**
   * @function createPost
   * @description Function to create a post.
   */
  const createPost = async () => {
    try {
      const tx = await contract.connect(wallet).createPost(content);
      await tx.wait();
      setMessage('Post created successfully.');
      setContent('');
      getPosts();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  /**
   * @function likePost
   * @description Function to like a post.
   * @param {number} postId - The ID of the post to like.
   */
  const likePost = async (postId) => {
    try {
      const tx = await contract.connect(wallet).likePost(postId);
      await tx.wait();
      setMessage('Post liked successfully.');
      await getPosts(); // Refresh posts after liking
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  /**
   * @function addComment
   * @description Function to add a comment to a post.
   * @param {number} postId - The ID of the post to comment on.
   * @param {string} comment - The text content of the comment.
   */
  const addComment = async (postId, comment) => {
    try {
      const tx = await contract.connect(wallet).addComment(postId, comment);
      await tx.wait();
      setMessage('Comment added successfully.');
      getPosts();
      setCommentText('');
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  /**
   * @function getPosts
   * @description Function to fetch all posts.
   */
  const getPosts = async () => {
    try {
      const count = await contract.getPostsCount();
      const fetchedPosts = [];
      for (let i = 0; i < count; i++) {
        const post = await contract.getPost(i);
        const comments = [];
        for (let j = 0; j < post.commentsCount; j++) {
          const comment = await contract.getComment(i, j);
          comments.push(comment);
        }
        fetchedPosts.push({ ...post, comments });
      }
      setPosts(fetchedPosts);
      setMessage('');
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // JSX for the component
  return (
    <div className="container mt-5">
      {/* Navbar section */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
          <a className="navbar-brand" href="#">Social Media</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {registeredUser && (
                <li className="nav-item">
                  <button disabled className="btn btn-warning"> {registeredUser.userAddress.slice(0, 6)}...</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Registration section */}
      {!registeredUser && (
        <div className="row mt-3">
          <div className="col-md-6">
            <div className="card">
            <div className="card-body">
                <h5 className="card-title">Create Account</h5>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={registerUser} disabled={isLoading}>Register</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create post section */}
      {registeredUser && (
        <div className="row mt-3">
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
      )}

      {/* Post section */}
      <div className="mt-3">
        {message && <div className="alert alert-info" role="alert">{message}</div>}
        <h3>Posts</h3>
        <div className="row">
          {posts.map((post, index) => (
            <div className="col-md-6 mb-3" key={index}>
              <div className="card shadow p-2">
              <div className="card-body">
                  <h6 className="card-title" style={{'color':'darkgrey'}}>Author : {post.author.toString()}</h6>
                  <p className="card-text" style={{'color':'darkgrey'}}>{post.content}</p>
                  <p className="card-text" style={{'color':'darkgrey'}}>Likes: {post.likes.toString()}</p>
                  {/* Like button */}
                  {registeredUser && (
                    <>
                     <button  className="btn btn-primary m-2" onClick={() => likePost(index)}>Like</button>
                      {/* Comment input and button */}
                      <input type="text" className="form-control m-2" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                      <button className="btn btn-secondary" onClick={() => addComment(index, commentText)}>Comment</button>
                    </>
                 
                  )}
                 {/* Comments */}
                  <div className="mt-3">
                    <h5>Comments</h5>
                    {post.comments.map((comment, commentIndex) => (
                      <div key={commentIndex}>
                        <p className='text-info'>{comment.content} <br />
                        <span className='text-primary'>{`${comment.commenter.slice(0,6)}...${comment.commenter.slice(comment.commenter.length -4)}`}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    
    </div>
  );
}

export default SocialMediaComponent;
