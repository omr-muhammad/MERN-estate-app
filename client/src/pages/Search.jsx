import { useEffect, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const initSidebarData = {
  searchTerm: '',
  type: '',
  parking: false,
  furnished: false,
  offer: false,
  sort: 'created_at',
  order: 'desc',
};

export default function Search() {
  const [sidebarData, setSidebarData] = useState(initSidebarData);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreListings, setIsMoreListings] = useState(false);
  const [searchParams] = useSearchParams();
  const searchTermFromUrl = searchParams.get('searchTerm');
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarData((prev) => ({ ...prev, searchTerm: searchTermFromUrl }));
  }, [searchTermFromUrl]);

  useEffect(() => {
    async function fetchData() {
      const search = createSearchParams(sidebarData).toString();
      setIsLoading(true);
      setIsMoreListings(false);

      try {
        const res = await fetch(`/api/listing/all?${search}`);
        const data = await res.json();

        if (data.data.listings.length > 8) {
          setIsMoreListings(true);
        } else {
          setIsMoreListings(false);
        }

        setListings(data.data.listings);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarData.searchTerm]);

  function handleChange(e) {
    const turthyFalsey = ['offer', 'parking', 'furnished'];

    if (e.target.name === 'searchTerm') {
      setSidebarData((prev) => ({ ...prev, searchTerm: e.target.value }));
    }

    if (e.target.name === 'type') {
      setSidebarData((prev) => {
        let type;

        if (prev.type === 'rent') {
          type = e.target.id === 'rent' ? undefined : 'sale';
        } else if (prev.type === 'sale') {
          type = e.target.id === 'sale' ? undefined : 'rent';
        } else {
          type = e.target.id;
        }

        return { ...prev, type };
      });
    }

    if (turthyFalsey.includes(e.target.id)) {
      setSidebarData((prev) => ({
        ...prev,
        [e.target.id]: !prev[e.target.id],
      }));
    }

    if (e.target.id === 'sort_order') {
      const values = e.target.value.split('_');

      setSidebarData((prev) => ({
        ...prev,
        sort: values[0] || 'createdAt',
        order: values[1] || 'desc',
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const search = createSearchParams(sidebarData).toString();

    navigate({
      pathname: '/search',
      search,
    });

    async function fetchData() {
      setIsLoading(true);
      setIsMoreListings(false);

      try {
        const res = await fetch(`/api/listing/all?${search}`);
        const data = await res.json();

        if (data.data.listings.length > 8) {
          setIsMoreListings(true);
        } else {
          setIsMoreListings(false);
        }

        setListings(data.data.listings);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }

  async function showMore() {
    const startIndex = listings.length;

    // Create the query then adding startIndex
    const params = createSearchParams(sidebarData);
    params.set('startIndex', startIndex);
    const search = params.toString();

    setIsMoreListings(false);
    const res = await fetch(`/api/listing/all?${search}`);
    const data = await res.json();
    if (data.data.listings.length < 9) {
      setIsMoreListings(false);
    }

    console.log(data);
    setListings((prev) => prev.concat(data.data.listings));
  }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <input
              type='text'
              name='searchTerm'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebarData.searchTerm || ''}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                name='type'
                className='w-5'
                onChange={handleChange}
                checked={sidebarData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                name='type'
                className='w-5'
                onChange={handleChange}
                checked={sidebarData.type === 'sale'}
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to hight</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          {isLoading ? 'Loading...' : 'Listings:'}
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!isLoading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {!isLoading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} {...listing} />
            ))}
          {isMoreListings && (
            <button
              className='text-green-700 hover:underline p-7 text-center w-full'
              onClick={showMore}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
