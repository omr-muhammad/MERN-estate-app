import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SearchInput from './SearchInput';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className='shadow-md bg-slate-200'>
      <div className='flex items-center justify-between max-w-6xl p-3 mx-auto'>
        <Link to='/'>
          <h1 className='flex flex-wrap text-sm font-bold sm:text-xl'>
            <span className='text-slate-500'>Dori</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>
        <SearchInput />
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              About
            </li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='object-cover rounded-full h-7 w-7'
                src={currentUser.avatar}
                alt='avatar'
              />
            ) : (
              <li className=' text-slate-700 hover:underline'>Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
