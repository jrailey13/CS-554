'use server';
import validation from '@/data/validation';
import {redirect} from 'next/navigation';
import {postData, userData} from '@/data/index.js';
import {revalidatePath} from 'next/cache';

export async function createPost(prevState, formData) {
  let title,
    body,
    posterId,
    tags = null;
  let id = null;
  let success = false;
  let errors = [];
  title = formData.get('title');
  body = formData.get('body');
  posterId = formData.get('posterId');
  tags = formData.get('tags');

  try {
    title = validation.checkString(title, 'Title');
  } catch (e) {
    errors.push(e);
  }

  try {
    body = validation.checkString(body, 'Body');
  } catch (e) {
    errors.push(e);
  }

  try {
    posterId = validation.checkId(posterId, 'Poster ID');
  } catch (e) {
    errors.push('Error: You Must select a user who posted from the dropdown!');
  }

  if (tags) {
    try {
      tags = tags.split(',');
      tags = validation.checkStringArray(tags, 'Tags');
    } catch (e) {
      errors.push(e);
    }
  }

  if (errors.length > 0) {
    return {message: errors};
  } else {
    try {
      let newPost = await postData.addPost(title, body, posterId, tags);
      id = newPost._id.toString();
      // redirect(`/posts/${id}`); // Navigate to new route
      success = true;
    } catch (e) {
      return {message: e};
    } finally {
      if (success) {
        revalidatePath('/posts');
        redirect(`/posts/${id}`); // Navigate to new route
      }
    }
  }
}

export async function createUser(prevState, formData) {
  let firstName,
    lastName = null;
  let id = null;
  let success = false;
  let errors = [];
  firstName = formData.get('firstName');
  lastName = formData.get('lastName');

  try {
    firstName = validation.checkString(firstName, 'First Name');
  } catch (e) {
    errors.push(e);
  }

  try {
    lastName = validation.checkString(lastName, 'Last Name');
  } catch (e) {
    errors.push(e);
  }

  if (errors.length > 0) {
    return {message: errors};
  } else {
    try {
      let newUser = await userData.addUser(firstName, lastName);
      id = newUser._id.toString();
      success = true;
      //redirect(`/posts/${id}`); // Navigate to new route
    } catch (e) {
      return {message: e};
    } finally {
      if (success) {
        revalidatePath('/users');
        redirect(`/users/${id}`); // Navigate to new route
      }
    }
  }
}
