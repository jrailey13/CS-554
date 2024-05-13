import {userData} from '@/data/index.js';
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
    const user = await userData.getUserById(params.id);
    return NextResponse.json(user);
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
      params.id = validation.checkId(params.id);
      reqBody.firstName = validation.checkString(
        reqBody.firstName,
        'First Name'
      );
      reqBody.lastName = validation.checkString(reqBody.lastName, 'Last Name');
    } catch (e) {
      return NextResponse.json({error: e}, {status: 400});
    }

    try {
      const updatedUser = await userData.updateUserPut(
        params.id,
        reqBody.firstName,
        reqBody.lastName
      );
      revalidatePath('/users');
      return NextResponse.json(updatedUser, {status: 200});
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
    reqBody = await req.json();

    if (!reqBody || Object.keys(reqBody).length === 0) {
      return NextResponse.json(
        {error: 'There are no fields in the request body'},
        {status: 400}
      );
    }
    //check the inputs that will return 400 is fail
    try {
      params.id = validation.checkId(params.id);
      if (reqBody.firstName) {
        reqBody.firstName = validation.checkString(
          reqBody.firstName,
          'First Name'
        );
      }

      if (reqBody.lastName) {
        reqBody.lastName = validation.checkString(
          reqBody.lastName,
          'Last Name'
        );
      }
    } catch (e) {
      return NextResponse.json({error: e}, {status: 400});
    }

    try {
      const updatedUser = await userData.updateUserPatch(params.id, reqBody);
      revalidatePath('/users');
      return NextResponse.json(updatedUser, {status: 200});
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
    let deletedUser = await userData.removeUser(params.id);
    revalidatePath('/users');
    return NextResponse.json(deletedUser, {status: 200});
  } catch (e) {
    return NextResponse.json({error: e}, {status: 404});
  }
}
