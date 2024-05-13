import {userData, postData} from '@/data/index.js';
import {NextResponse} from 'next/server';
import {dbConnection, closeConnection} from '@/config/mongoConnection.js';
import {revalidatePath} from 'next/cache';
export const dynamic = 'force-dynamic';
export async function GET(req) {
  //  console.log(req.url);
  const db = await dbConnection();
  await db.dropDatabase();
  const patrick = await userData.addUser('Patrick', 'Hill');
  const pid = patrick._id.toString();
  const aiden = await userData.addUser('Aiden', 'Hill');
  const aid = aiden._id.toString();
  await postData.addPost('Hello, class!', 'Today we are creating a blog!', pid);
  await postData.addPost(
    'Using the seed',
    'We use the seed to have some initial data so we can just focus on servers this week',
    pid
  );

  await postData.addPost(
    'Using routes',
    'The purpose of today is to simply look at some GET routes',
    pid
  );

  await postData.addPost(
    "Aiden's first post",
    "This is aiden's first post",
    aid,
    ['toys']
  );
  await postData.addPost(
    "Aiden's second post",
    "This is aiden's second post",
    aid,
    ['aiden']
  );
  await postData.addPost(
    "Aiden's third post",
    "This is aiden's thrid post",
    aid,
    ['aiden', 'kid']
  );

  console.log('Done seeding database');
  revalidatePath('/posts');
  revalidatePath('/users');
  return NextResponse.json({done: true}, {status: 200});
}
