import { VideosDirectory } from "@/components/videos/VideosDirectory";
import { getApprovedMentors } from "@/lib/data/mentors";
import { getVideos } from "@/lib/data/videos";

export default async function VideosPage() {
  const [videos, mentors] = await Promise.all([getVideos(), getApprovedMentors()]);

  return <VideosDirectory videos={videos} mentors={mentors} />;
}
