import { API_KEY } from '@/utils/request';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import * as React from 'react';
import { Movie } from '../../../typing';
import clsx from 'clsx';
import { Popover, Transition } from '@headlessui/react';
import { useRecoilState } from 'recoil';
import { modalState, movieState } from '../../../atoms/modalAtom';

const Search = () => {
  const [query, setQuery] = React.useState('');
  const [showInput, setShowInput] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<Movie[]>([]);
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [showResults, setShowResults] = React.useState(false);
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState);
  const [showModal, setShowModal] = useRecoilState(modalState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowResults(e.target.value.length >= 3);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  const searchMovies = React.useCallback(async (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    if (query.length >= 3) {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`
      );

      const filteredResults = response.data.results.filter(
        (result: any) =>
          result.media_type === 'movie' || result.media_type === 'tv'
      );

      setSearchResults(filteredResults);
      console.log(filteredResults);
      setShowResults(true);
    } else {
      setSearchResults([]);
    }
  }, []);

  const handleBlur = () => {
    setShowResults(false);
  };

  React.useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  React.useEffect(() => {
    if (debouncedQuery) {
      searchMovies(debouncedQuery);
    }
  }, [debouncedQuery, searchMovies]);

  return (
    <div className="flex relative items-center" onBlur={handleBlur}>
      <Transition
        show={showInput}
        enter="transition-opacity duration-700"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-350"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={handleInputChange}
          onClick={() => setShowResults(true)}
          className={clsx(
            showInput ? ' bg-black/30 block' : ' bg-transparent',
            ' px-2 py-1 transition-all  rounded focus:outline-none'
          )}
        />
      </Transition>
      <div
        onClick={() => setShowInput(!showInput)}
        className="text-gray-200 ml-4 hover:text-gray-300 cursor-pointer transition focus:p-1 p-1"
        tabIndex={0}
      >
        <MagnifyingGlassIcon className="w-6" />
      </div>
      <div className="absolute top-10 max-h-40 overflow-y-auto">
        {query.length >= 3 && (
          <ul className="flex flex-col bg-zinc-900/80">
            {searchResults.map(result => (
              <li
                className="w-[400px] py-2 hover:cursor-pointer mx-2 flex justify-between"
                key={result.id}
                onClick={() => {
                  console.log(result);
                  setCurrentMovie(result);
                  setShowModal(true);
                }}
              >
                <span>{result.title || result.name}</span>{' '}
                <span className="bg-gray-800 h-fit px-1 rounded-md">
                  {result.media_type}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;

function MyPopover() {
  return (
    <Popover className="relative">
      <div>
        <Popover.Button className="flex items-center">
          <input type="text" placeholder="Search" className="z-20" />
          <MagnifyingGlassIcon className="w-6" />
        </Popover.Button>
      </div>

      <Popover.Panel className="absolute z-10">
        <div className="grid grid-cols-1 w-60">
          <p>Analytics</p>
          <p>Engagement</p>
          <p>Security Lorem ipsum dolor sit amet.</p>
          <p>Integrations</p>
        </div>
      </Popover.Panel>
    </Popover>
  );
}
