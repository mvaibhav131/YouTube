import PageLayout from '../components/PageLayout';
import CategoryFeed from '../components/CategoryFeed';
export default function Learning() {
  return <PageLayout title="Learning - YouTube"><CategoryFeed categoryId="27" title="Education & Learning" icon="📚" /></PageLayout>;
}
export async function getServerSideProps() { return { props: {} }; }
