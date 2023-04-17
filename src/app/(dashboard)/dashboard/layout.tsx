import Header from "@/components/header"

export const metadata = {
    title: 'Dashboard',
    description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>{children}</>
    )
}
