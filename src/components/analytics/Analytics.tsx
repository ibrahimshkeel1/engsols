import Script from "next/script";

function isValidGaId(id: string): boolean {
  return /^(G-[A-Z0-9]+|UA-\d+-\d+)$/i.test(id);
}

function isValidPlausibleDomain(domain: string): boolean {
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(domain);
}

export function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();

  const safePlausible = plausibleDomain && isValidPlausibleDomain(plausibleDomain) ? plausibleDomain : null;
  const safeGaId = gaId && isValidGaId(gaId) ? gaId : null;

  if (!safePlausible && !safeGaId) return null;

  return (
    <>
      {safePlausible && (
        <Script
          defer
          data-domain={safePlausible}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
      {safeGaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(safeGaId)}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(safeGaId)});`}
          </Script>
        </>
      )}
    </>
  );
}
