import Navbar from '@/components/navbar';
import Banner from '@/components/netflix1/Banner';
import requests from '@/utils/request';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { Movie } from '../../typing';
import { RowLanscape, RowPotrait } from '@/components/netflix1/Row';
import RootLayout from '@/components/layouts/layout';
import { useRecoilValue } from 'recoil';
import { modalState } from '../../atoms/modalAtom';
import Modal from '@/components/netflix1/Modal';

interface Props {
  familyTv: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionTv: Movie[];
  comedyTv: Movie[];
  crimesTv: Movie[];
  mysteryTv: Movie[];
  SciFiTv: Movie[];
}

const Series = ({
  familyTv,
  actionTv,
  comedyTv,
  mysteryTv,
  crimesTv,
  topRated,
  trendingNow,
  SciFiTv,
}: Props) => {
  const showModal = useRecoilValue(modalState);

  return (
    <RootLayout title={'TV Show'}>
      <Head>
        <title>NOTFLOX 1</title>
      </Head>
      <main>
        <Banner netflixOriginals={trendingNow} />
        <section className="space-y-12 md:space-y-10 mx-auto relative xl:-mt-64 max-w-[1300px]">
          <RowLanscape title="Top Rated" movies={topRated} />
          <RowPotrait title="Trending" movies={trendingNow} />
          <RowPotrait title="Sci-Fi & Fantasy" movies={SciFiTv} />
          <RowPotrait title="Action & Adventure" movies={actionTv} />
          <RowPotrait title="Crimes" movies={crimesTv} />
          <RowPotrait title="Mystery" movies={mysteryTv} />
          <RowPotrait title="Comedies" movies={comedyTv} />
        </section>
      </main>
      {showModal && <Modal />}
    </RootLayout>
  );
};

export default Series;

export const getServerSideProps = async (context: NextPageContext) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  const [
    familyTv,
    trendingNow,
    topRated,
    actionTv,
    comedyTv,
    crimesTv,
    mysteryTv,
    SciFiTv,
  ] = await Promise.all([
    fetch(requests.fetchFamilyTv).then(res => res.json()),
    fetch(requests.fetchTrending).then(res => res.json()),
    fetch(requests.fetchTopRatedTv).then(res => res.json()),
    fetch(requests.fetchActionTv).then(res => res.json()),
    fetch(requests.fetchComedyTv).then(res => res.json()),
    fetch(requests.fetchCrimeTv).then(res => res.json()),
    fetch(requests.fetchMysteryTv).then(res => res.json()),
    fetch(requests.fetchSciFiTv).then(res => res.json()),
  ]);

  return {
    props: {
      familyTv: familyTv.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionTv: actionTv.results,
      comedyTv: comedyTv.results,
      SciFiTv: SciFiTv.results,
      crimesTv: crimesTv.results,
      mysteryTv: mysteryTv.results,
    },
  };
};
