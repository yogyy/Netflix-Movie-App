import { API_KEY } from '@/utils/request';
import axios from 'axios';
import { Genre, Movie, Network, ProductionCompany } from '../../../typing';
import * as React from 'react';
import RootLayout from '@/components/layouts/layout';
import Image from 'next/image';
import { baseUrl } from '../../../constants/movie';
import { Tooltip } from '@mui/material';
import Recomend from '@/components/netflix1/recomend';
import { tanggal } from '@/lib/getDate';
import { Paginate } from '@/components/Paginate';
import Link from 'next/link';

interface Props {
  tv: Movie;
  networks: Network[];
  genres: Genre[];
  productions: ProductionCompany[];
}
interface KW {
  id: number;
  name: string;
}

export default function MovieDetails({ tv, genres, productions }: Props) {
  const [similarTVShows, setSimilarTVShows] = React.useState([]);
  const [filteredTVShows, setFilteredTVShows] = React.useState([]);
  const [keywords, setKeywords] = React.useState([]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [postPerPage, setpostPerPage] = React.useState(6);
  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const similarPaginate = similarTVShows.slice(firstPostIndex, lastPostIndex);

  React.useEffect(() => {
    axios
      .get(`/api/recommend/tv/${tv.id}`)
      .then(response => setSimilarTVShows(response.data.results))

      .catch(error => console.error('Error fetching similar TV shows:', error));
    setCurrentPage(1);
  }, [tv.id]);

  React.useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/tv/${tv.id}/keywords?api_key=${API_KEY}`
      )
      .then(response => {
        setKeywords(response.data.results);
      })
      .catch(error => {
        console.error(error);
      });
  }, [tv.id]);

  return (
    <RootLayout title={tv.name}>
      <div className="relative w-screen h-[56.25vw] object-cover brightness-50 xl:w-screen">
        <span className="absolute top-[14%] left-[20%] text-3xl font-mono z-10">
          {tv.tagline}
        </span>
        {tv.backdrop_path !== null ? (
          <Image
            src={`${baseUrl}${tv?.backdrop_path || ''}`}
            fill
            alt={`banner ${tv.name}`}
            priority
            draggable={false}
          />
        ) : (
          <div className="bg-[#121212]"></div>
        )}
        <div className="absolute bg-gradient-to-b from-transparent h-full to-[#5f5f5f] bottom-0 w-full" />
      </div>
      <div className="relative bg-gradient-to-b from-[#5f5f5f] to-[#121212] lg:bg-none mx-auto md:justify-center items-center md:items-start lg:-mt-[40%] flex gap-5 flex-col md:flex-row px-5 pt-4 max-w-[1200px]">
        <div className="h-full gap-3 md:flex md:flex-col relative">
          <div className="relative -mt-32 md:mt-0 rounded ">
            <Image
              src={`https://image.tmdb.org/t/p/w342/${tv.poster_path}`}
              className="rounded-sm object-cover md:rounded flex"
              width={164}
              height={255}
              style={{ width: 'auto' }}
              alt={`Thumbnail ${tv?.name}`}
              draggable={false}
              onClick={() => console.log(tv)}
            />
          </div>
          <div className="homepage">
            <h3 className="text-sm text-sky-600">
              <Link target="_blank" href={tv.homepage}>
                Homepage
              </Link>
            </h3>
          </div>
        </div>
        <div className="md:w-7/12 w-full">
          <h1 className="text-xl font-semibold text-red-600">
            {tv.name} ({tv.first_air_date?.slice(0, 4)})
          </h1>
          <h2 className="text- text-gray-300">{tv?.original_name}</h2>
          <p className="text-sm lg:text-base text-gray-400">{tv.overview}</p>
          <hr className="my-2 border-zinc-800" />
          <div className="text-sm text-gray-300">
            <p>
              Aired : {tanggal(tv.first_air_date)}
              &nbsp; to {tanggal(tv.last_air_date || '?')}
            </p>
            <p>Status : {tv.status}</p>
            <div className="text-gray-300">
              <p>
                Genre :&nbsp;
                <span className="text-red-300">
                  {genres.map(genre => genre.name).join(', ')}
                </span>
              </p>
            </div>
            <p className="text-gray-300">
              <span className="">Rating :&nbsp;</span>
              {tv.vote_average.toFixed(1)} / 10 from&nbsp;
              {tv.vote_count.toLocaleString()}
            </p>
            <div className="text-sm text-gray-300">
              <p>
                Studio : {productions.map(studio => studio.name).join(', ')}
              </p>
            </div>
          </div>
          <hr className="mt-2 mb-12 border-zinc-800" />
        </div>
      </div>

      <div className="space-y-12 md:space-y-10 mx-auto relative max-w-[1300px]">
        <div className="flex flex-wrap py-2 mt-5 xl:mb-52 items-center">
          <h1 id="similar-tv-container" className="px-3">
            Tags :
          </h1>
          {keywords.map((keyword: KW) => (
            <p
              key={keyword.id}
              className="bg-white/5 text-gray-300 w-max px-2 rounded-md m-1 cursor-default hover:bg-white/10 hover:text-gray-200"
            >
              {keyword.name}
            </p>
          ))}
        </div>

        <Recomend
          className=""
          title="Recommendations"
          movies={similarPaginate}
        />
        <Paginate
          currentPage={currentPage}
          postPerPage={postPerPage}
          setCurrentPage={setCurrentPage}
          totalPost={similarTVShows.length}
        />
      </div>
    </RootLayout>
  );
}

export async function getServerSideProps({ params }: any) {
  const tvId = Number(params.tvId);

  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}?api_key=${API_KEY}`
    );

    return {
      props: {
        tv: data,
        genres: data.genres,
        productions: data.production_companies,
      },
    };
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return {
        props: {},
        notFound: true,
      };
    }
    return {
      props: {},
      error: true,
    };
  }
}
