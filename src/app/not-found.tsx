import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-container flex min-h-[60vh] max-w-lg flex-col items-center justify-center py-16 text-center">
      <p className="section-label">404</p>
      <h1 className="text-display-lg mt-2">Page not found</h1>
      <p className="text-body-lg mt-3">
        This page doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Go home</ButtonLink>
        <ButtonLink href="/mentors" variant="secondary">
          Find mentors
        </ButtonLink>
      </div>
    </div>
  );
}
