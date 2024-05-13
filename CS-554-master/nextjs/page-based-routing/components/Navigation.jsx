import Link from 'next/link';

export default function Navigation() {
  return (
    <ul className='navClass center'>
      <li className='nav'>
        <Link href='/'>Home</Link>
      </li>
      <li className='nav'>
        <Link href='/about'>About Us</Link>
      </li>
      <li className='nav'>
        <Link href='/contact'>Contact Us</Link>
      </li>
      <li className='nav'>
        <Link href='/static-site-generation/shows'>Shows (SSG)</Link>
      </li>
      <li className='nav'>
        <Link href='/server-side-rendering-fetching/shows'>Shows (SSR)</Link>
      </li>
      <li className='nav'>
        <Link href='/client-side-fetching-useeffect/shows'>Shows (CSF)</Link>
      </li>
    </ul>
  );
}
