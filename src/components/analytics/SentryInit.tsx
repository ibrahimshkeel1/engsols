import Script from "next/script";

export function SentryInit() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return null;

  return (
    <Script id="sentry-init" strategy="afterInteractive">
      {`
        (function(){
          var s=document.createElement('script');
          s.src='https://browser.sentry-cdn.com/8.0.0/bundle.min.js';
          s.crossOrigin='anonymous';
          s.onload=function(){
            if(window.Sentry) window.Sentry.init({ dsn: '${dsn}', tracesSampleRate: 0.1 });
          };
          document.head.appendChild(s);
        })();
      `}
    </Script>
  );
}
