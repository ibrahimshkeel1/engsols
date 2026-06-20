import { AdminMockExamForm } from "@/components/admin/AdminMockExamForm";

export default function AdminExamsPage() {
  return (
    <div className="max-w-3xl">
      <p className="section-label text-zone-exams">Exam CMS</p>
      <h1 className="mt-1 text-2xl font-bold">Mock Exam Manager</h1>
      <p className="mt-1 text-muted-foreground">
        Create FE and PE practice exams with multiple-choice questions — no SQL seed files required.
      </p>
      <div className="mt-8">
        <AdminMockExamForm />
      </div>
    </div>
  );
}
