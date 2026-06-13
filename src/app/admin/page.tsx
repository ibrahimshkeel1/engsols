import Link from "next/link";
import { getAllMentorProfilesForAdmin } from "@/lib/data/mentors";
import { getAllNewsForAdmin } from "@/lib/data/news";
import { getForumPosts } from "@/lib/data/forum";
import { getLiveSessions } from "@/lib/data/live";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [mentors, news, posts, live] = await Promise.all([
    getAllMentorProfilesForAdmin(),
    getAllNewsForAdmin(),
    getForumPosts(),
    getLiveSessions(),
  ]);

  const pendingMentors = mentors.filter((m) => m.status === "pending").length;
  const draftNews = news.filter((n) => !n.published).length;

  const stats = [
    { label: "Pending mentors", value: pendingMentors, href: "/admin/mentors" },
    { label: "Forum posts", value: posts.length, href: "/admin/forum" },
    { label: "Live sessions", value: live.length, href: "/admin/live" },
    { label: "Draft articles", value: draftNews, href: "/admin/news" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Platform overview and quick actions.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="card-elevated transition hover:border-primary/40">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-3xl font-bold">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <h2 className="font-semibold">Quick actions</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/admin/mentors" className="text-primary hover:underline">Review mentor applications</Link></li>
              <li><Link href="/admin/news/new" className="text-primary hover:underline">Publish news article</Link></li>
              <li><Link href="/admin/forum" className="text-primary hover:underline">Moderate forum</Link></li>
            </ul>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="p-6">
            <h2 className="font-semibold">Launch checklist</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>✓ Supabase schema ready</li>
              <li>✓ Auth + role-based panels</li>
              <li>→ Approve your first mentors</li>
              <li>→ Publish industry news</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
