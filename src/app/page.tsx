import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-secondary-800 p-6 font-unageo text-center">
      <h1 className="font-unbounded text-xl text-secondary-000">Afrivendors</h1>
      <p className="text-sm text-accent-70">Public / signed-out area (placeholder)</p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-white no-underline"
      >
        Open admin dashboard
      </Link>
    </div>
  )
}
