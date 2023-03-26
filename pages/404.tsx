import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Boerderij bloem | 404</title>
        <link rel="icon" href="/notfound.png" />
      </Head>
      <main className="not-found">
        <h1>404 | pagina niet gevonden</h1>
        <p>
          Deze pagina bestaat niet, <Link href="/">Terug naar de homepage</Link>.
        </p>
      </main>
    </>
  );
}
