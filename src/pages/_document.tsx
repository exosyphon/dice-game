import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <Script
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=G-PMNS5L31T2}`}
            />
            <Script id='analytics' strategy="lazyOnload">
                {`
                     window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());

                      gtag('config', 'G-PMNS5L31T2');
                `}
            </Script>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
