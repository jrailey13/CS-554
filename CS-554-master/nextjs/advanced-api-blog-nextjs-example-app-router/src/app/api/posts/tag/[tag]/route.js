import {NextResponse} from 'next/server';
import validation from '@/data/validation';
import {postData} from '@/data/index.js';
export async function GET(req, {params}) {
  try {
    params.tag = validation.checkString(params.tag, 'Tag');
  } catch (e) {
    return NextResponse.json({error: e}, {status: 400});
  }
  //try to get all posts by tag
  try {
    const postList = await postData.getPostsByTag(params.tag);
    return NextResponse.json({postList}, {status: 200});
  } catch (e) {
    return NextResponse.json({error: e}, {status: 404});
  }
}
