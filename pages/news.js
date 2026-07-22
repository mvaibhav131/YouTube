import PageLayout from '../components/PageLayout';
import CategoryFeed from '../components/CategoryFeed';
export default function News() {
  return <PageLayout title="News - YouTube"><CategoryFeed categoryId="25" title="News" icon="📰" /></PageLayout>;
}
