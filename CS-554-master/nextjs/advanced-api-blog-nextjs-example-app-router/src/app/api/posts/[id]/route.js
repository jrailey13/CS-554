import {postData} from '@/data/index.js';
import validation from '@/data/validation';
import {NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache';
export async function GET(req, {params}) {
  try {
    params.id = validation.checkId(params.id, 'ID URL Param');
  } catch (e) {
    return NextResponse.json({error: e}, {status: 400});
  }

  try {
    const post = await postData.getPostById(params.id);
    return NextResponse.json(post);
  } catch (e) {
    return NextResponse.json({error: e}, {status: 404});
  }
}

export async function PUT(req, {params}) {
  let reqBody = null;
  try {
    reqBody = await req.json();

    if (!reqBody || Object.keys(reqBody).length === 0) {
      return NextResponse.json(
        {error: 'There are no fields in the request body'},
        {status: 400}
      );
    }
    //check all the inputs that will return 400 if they fail
    try {
      params.id = validation.checkId(params.id, 'ID url param');
      reqBody.title = validation.checkString(reqBody.title, 'Title');
      reqBody.body = validation.checkString(reqBody.body, 'Body');
      reqBody.posterId = validation.checkId(reqBody.posterId, 'Poster ID');
      if (reqBody.tags) {
        if (!Array.isArray(reqBody.tags)) {
          reqBody.tags = [];
        } else {
          reqBody.tags = validation.checkStringArray(reqBody.tags, 'Tags');
        }
      }
    } catch (e) {
      return NextResponse.json({error: e}, {status: 400});
    }

    try {
      const updatedPost = await postData.updatePostPut(params.id, reqBody);
      revalidatePath('/posts');
      return NextResponse.json(updatedPost, {status: 200});
    } catch (e) {
      return NextResponse.json({error: e}, {status: 404});
    }
  } catch (e) {
    return NextResponse.json(
      {error: 'There is no request body'},
      {status: 400}
    );
  }
}

export async function PATCH(req, {params}) {
  let reqBody = null;
  try {
    let reqBody = await req.json();

    if (!reqBody || Object.keys(reqBody).length === 0) {
      return NextResponse.json(
        {error: 'There are no fields in the request body'},
        {status: 400}
      );
    }
    //check the inputs that will return 400 is fail
    try {
      params.id = validation.checkId(params.id, 'Post ID');
      if (reqBody.title)
        reqBody.title = validation.checkString(reqBody.title, 'Title');
      if (reqBody.body)
        reqBody.body = validation.checkString(reqBody.body, 'Body');
      if (reqBody.posterId)
        reqBody.posterId = validation.checkId(reqBody.posterId, 'Poster ID');
      if (reqBody.tags)
        reqBody.tags = validation.checkStringArray(reqBody.tags, 'Tags');
    } catch (e) {
      return NextResponse.json({error: e}, {status: 400});
    }

    try {
      const updatedPost = await postData.updatePostPatch(params.id, reqBody);
      revalidatePath('/posts');
      return NextResponse.json(updatedPost, {status: 200});
    } catch (e) {
      return NextResponse.json({error: e}, {status: 404});
    }
  } catch (e) {
    return NextResponse.json(
      {error: 'There is no request body'},
      {status: 400}
    );
  }
}

export async function DELETE(req, {params}) {
  //check the id
  try {
    params.id = validation.checkId(params.id, 'Id URL Param');
  } catch (e) {
    return NextResponse.json({error: e}, {status: 400});
  }
  //try to delete post
  try {
    let deletedPost = await postData.removePost(params.id);
    revalidatePath('/posts');
    return NextResponse.json(deletedPost, {status: 200});
  } catch (e) {
    return NextResponse.json({error: e}, {status: 404});
  }
}
