import { DashboardNav } from '@/components/dashboard/dashboard-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNav />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
