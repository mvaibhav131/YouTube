import { CheckCircleFilled } from "@ant-design/icons";
import PageLayout from "../components/PageLayout";
import { getThumbnail, getVideoId, timeAgo, avatarColor } from "../lib/utils";

function ResultSkeleton() {
  return (
    <div className="yt-res-card" style={{ pointerEvents: "none" }}>
      <div className="yt-skel" style={{ width: 320, flexShrink: 0, aspectRatio: "16/9", borderRadius: 12 }} />
      <div style={{ flex: 1, paddingTop: 4 }}>
        <div className="yt-skel" style={{ height: 20, marginBottom: 10, width: "80%" }} />
        <div className="yt-skel" style={{ height: 13, marginBottom: 8, width: "40%" }} />
        <div className="yt-skel" style={{ height: 12, width: "60%" }} />
      </div>
    </div>
  );
}

export default function SearchPage({ results, q }) {
  return (
    <PageLayout title={q ? q + " - YouTube" : "Search - YouTube"} defaultSidebar="mini">
      <div className="yt-results">
        {!q && (
          <div className="yt-empty">
            <div className="yt-empty-title">Search for something</div>
            <div className="yt-empty-sub">Type in the search bar above to find videos.</div>
          </div>
        )}

        {q && results.length === 0 && (
          <div className="yt-empty">
            <div className="yt-empty-title">No results found</div>
            <div className="yt-empty-sub">Try a different search term.</div>
          </div>
        )}

        {results.map((item) => {
          const videoId = getVideoId(item);
          const thumb = getThumbnail(item.snippet, "high");
          const ch = item.snippet?.channelTitle || "";
          const href = videoId ? "/watch/" + videoId : "#";
          return (
            <a key={videoId} href={href} className="yt-res-card" style={{ textDecoration: "none" }}>
              <div className="yt-res-thumb">
                {thumb && <img src={thumb} alt={item.snippet.title} loading="lazy" />}
              </div>
              <div className="yt-res-info">
                <div className="yt-res-title">{item.snippet.title}</div>
                <div className="yt-res-meta">
                  {item.snippet.publishedAt ? timeAgo(item.snippet.publishedAt) : ""}
                </div>
                <div className="yt-res-ch">
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: avatarColor(ch), display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
                  }}>
                    {(ch || "U")[0].toUpperCase()}
                  </div>
                  <span className="yt-rel-meta">{ch}</span>
                  <CheckCircleFilled style={{ color: "#717171", fontSize: 12 }} />
                </div>
                <div className="yt-res-desc">{item.snippet.description}</div>
              </div>
            </a>
          );
        })}
      </div>
    </PageLayout>
  );
}

// Server-side search — runs on Netlify's server, bypasses all client-side caching.
// regionCode=IN ensures Indian-relevant results regardless of Netlify server location (US).
export async function getServerSideProps({ query, res }) {
  const q = String(query.q || "").trim().slice(0, 200);
  res.setHeader("Cache-Control", "no-store");

  if (!q) return { props: { results: [], q: "" } };

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return { props: { results: [], q } };

  try {
    const url =
      "https://www.googleapis.com/youtube/v3/search" +
      "?part=snippet" +
      "&type=video" +
      "&order=relevance" +
      "&maxResults=50" +
      "&regionCode=IN" +
      "&relevanceLanguage=hi" +
      "&q=" + encodeURIComponent(q) +
      "&key=" + key;

    const r = await fetch(url, { cache: "no-store" });
    const data = await r.json();
    const results = (data?.items || [])
      .filter((v) => v?.snippet)
      .map((v) => ({ id: v.id, snippet: v.snippet }));
    return { props: { results, q } };
  } catch {
    return { props: { results: [], q } };
  }
}