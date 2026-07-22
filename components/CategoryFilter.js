const CATS = [
  { id: 'all', label: 'All' },
  { id: '10',  label: 'Music' },
  { id: '20',  label: 'Gaming' },
  { id: '17',  label: 'Sports' },
  { id: '25',  label: 'News' },
  { id: '24',  label: 'Entertainment' },
  { id: '1',   label: 'Film & Animation' },
  { id: '26',  label: 'Howto & Style' },
  { id: '27',  label: 'Education' },
  { id: '28',  label: 'Science & Technology' },
  { id: '22',  label: 'People & Blogs' },
  { id: '23',  label: 'Comedy' },
  { id: '15',  label: 'Pets & Animals' },
  { id: '19',  label: 'Travel & Events' },
];

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="yt-cats" role="list" aria-label="Video categories">
      {CATS.map((c) => (
        <button
          key={c.id}
          role="listitem"
          className={`yt-cat ${active === c.id ? 'active' : ''}`}
          onClick={() => onChange(c.id)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
