import Link from "next/link";
export default function  DashboardLayout({children}) {
  return (
    <div>
      <nav>Nav
        <Link href="/dashboard/settings">Settings</Link>
      </nav>
      {children}
    </div>
  )
}