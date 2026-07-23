import PageLayout from '../components/PageLayout';
import CategoryFeed from '../components/CategoryFeed';
export default function Trending() {
  return <PageLayout title="Trending - YouTube"><CategoryFeed title="Trending" icon="🔥" /></PageLayout>;
}
export async function getServerSideProps() { return { props: {} }; }
