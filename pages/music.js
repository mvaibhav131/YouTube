import PageLayout from '../components/PageLayout';
import CategoryFeed from '../components/CategoryFeed';
export default function Music() {
  return <PageLayout title="Music - YouTube"><CategoryFeed categoryId="10" title="Music" icon="🎵" /></PageLayout>;
}
