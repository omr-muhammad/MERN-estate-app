import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const searchTermFromUrl = searchParams.get('searchTerm');
  const navigate = useNavigate();

  useEffect(() => {
    const search = searchTermFromUrl || '';
    setSearchTerm(search);
  }, [searchTermFromUrl]);

  function handleSubmit(e) {
    e.preventDefault();

    searchParams.set('searchTerm', searchTerm);
    const searchQuery = searchParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className='bg-slate-100 p-3 rounded-lg flex items-center'
    >
      <input
        type='text'
        placeholder='Search...'
        className='bg-transparent focus:outline-none w-24 sm:w-64'
        value={searchTerm || ''}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button>
        <FaSearch className='text-slate-600' />
      </button>
    </form>
  );
}
