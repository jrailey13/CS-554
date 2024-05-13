import {postData} from '@/data/index.js';
import {NextResponse} from 'next/server';
import validation from '@/data/validation';

export async function POST(req, {params}) {
  let reqBody = null;
  try {
    reqBody = await req.json();

    if (!reqBody || Object.keys(reqBody).length === 0) {
      return NextResponse.json(
        {error: 'There are no fields in the request body'},
        {status: 400}
      );
    }
    try {
      reqBody.oldTag = validation.checkString(reqBody.oldTag, 'Old Tag');
      reqBody.newTag = validation.checkString(reqBody.newTag, 'New Tag');
    } catch (e) {
      return NextResponse.json({error: e}, {status: 400});
    }

    try {
      let getNewTagPosts = await postData.renameTag(
        reqBody.oldTag,
        reqBody.newTag
      );
      return NextResponse.json(getNewTagPosts, {status: 200});
    } catch (e) {
      return NextResponse.json({error: e}, {status: 404});
    }
  } catch {
    e;
  }
  {
    return NextResponse.json(
      {error: 'There is no request body'},
      {status: 400}
    );
  }
}
