"use client"

import React, { useState } from 'react';
import { useContract } from '../../lib/ContractContext';

function SocialMediaComponent() {
  const { contract } = useContract();
  console.log(contract);
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
    <>
    
    </>
  );
}

export default SocialMediaComponent;
