import { redirect } from "next/navigation";

export default function AdminNewNewsPage() {
  redirect("/admin/news#create");
}
