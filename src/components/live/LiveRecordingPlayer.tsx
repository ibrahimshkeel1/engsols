type Props = {
  url: string;
  title: string;
};

function embedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const id = u.searchParams.get("v") || u.pathname.split("/").pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function LiveRecordingPlayer({ url, title }: Props) {
  const embed = embedUrl(url);
  const isVideoFile = /\.(mp4|webm|ogg)(\?|$)/i.test(url);

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold">Recording</h2>
      {embed ? (
        <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl bg-muted">
          <iframe src={embed} title={title} className="absolute inset-0 h-full w-full" allowFullScreen />
        </div>
      ) : isVideoFile ? (
        <video src={url} controls className="mt-4 w-full rounded-2xl" />
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-primary hover:underline">
          Watch recording →
        </a>
      )}
    </div>
  );
}
