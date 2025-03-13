import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* Add the Montserrat font */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body className="bg-dark text-light">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
} 