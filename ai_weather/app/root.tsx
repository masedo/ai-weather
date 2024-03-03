import '~/styles/tailwind.css';
import type { MetaFunction } from "@remix-run/node";

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const meta: MetaFunction = () => {
  return [
    { title: "AI Weather chat" },
    { name: "description", content: "Welcome to AI weather chat" },
  ];
};

export default function App() {
  return (
    <html lang="en" className="bg-gray-800">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans bg-gray-800 text-white">
        <nav className="bg-gray-900 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-bold">AI Weather chat</a>
          
          </div>
        </nav>

        <main className="container mx-auto my-8 p-4 rounded-lg">
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}