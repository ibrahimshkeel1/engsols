import Script from "next/script";

function isValidSentryDsn(dsn: string): boolean {
  return /^https:\/\/[a-z0-9]+@o\d+\.ingest(?:\.[a-z]+)?\.sentry\.io\/\d+$/i.test(dsn);
}

export function SentryInit() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
  if (!dsn || !isValidSentryDsn(dsn)) return null;

  const initConfig = JSON.stringify({ dsn, tracesSampleRate: 0.1 });

  return (
    <Script id="sentry-init" strategy="afterInteractive">
      {`(function(){var c=${initConfig};var s=document.createElement('script');s.src='https://browser.sentry-cdn.com/8.0.0/bundle.min.js';s.crossOrigin='anonymous';s.onload=function(){if(window.Sentry)window.Sentry.init(c);};document.head.appendChild(s);})();`}
    </Script>
  );
}
