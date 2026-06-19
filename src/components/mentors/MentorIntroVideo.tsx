function youtubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

type Props = {
  url: string;
  name: string;
};

export function MentorIntroVideo({ url, name }: Props) {
  const embed = youtubeEmbedUrl(url);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted/20">
      {embed ? (
        <iframe
          src={embed}
          title={`${name} intro video`}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video src={url} controls className="aspect-video w-full bg-black" preload="metadata">
          Your browser does not support video playback.
        </video>
      )}
    </div>
  );
}
