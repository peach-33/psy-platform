import { notFound } from 'next/navigation';

import { getCurrentUser } from '@/lib/session';
import Header from '@/components/header';
import { DashboardNav } from '@/components/sidebar';
import { SidebarNavItem } from '@/types';
import { Suspense } from 'react';
import Loading from './loading';

export const metadata = {
    title: '控制台',
    description: '管理平台所有操作',
};

interface DashboardLayoutProps {
    children?: React.ReactNode;
}
const sidebarNav: SidebarNavItem[] = [
    {
        title: '首页',
        href: '/dashboard',
        icon: 'dashboard',
    },
    {
        title: '实验管理',
        href: '/experiment',
        icon: 'billing',
    },
    {
        title: '引擎管理',
        href: '/engine',
        icon: 'engine',
    },
    {
        title: '实验记录',
        href: '/history',
        icon: 'history',
    },
    {
        title: '用户列表',
        href: '/users',
        icon: 'users',
    },
    {
        title: '项目列表',
        href: '/projects',
        icon: 'projects',
    },
    {
        title: '项目分组列表',
        href: '/project/groups',
        icon: 'projectGroups',
    },
    {
        title: '用户组',
        href: '/usergroup',
        icon: 'usergroup',
    },
    {
        title: '用户设置',
        href: '/settings',
        icon: 'settings',
    },
    {
        title: '平台设置',
        href: '/platform/settings',
        icon: 'wrench',
    },
];
export default async function DashboardLayout({ children }: DashboardLayoutProps) {
    const user = await getCurrentUser();

    if (!user) {
        return notFound();
    }

    return (
        <div className="mx-auto flex flex-col space-y-4 items-center bg-white">
            <header className="container sticky top-0 w-full bg-white">
                <Header user={user} />
            </header>
            <div className="container grid gap-12 md:grid-cols-[200px_1fr] px-8">
                <aside className="hidden w-[200px] flex-col md:flex">
                    <DashboardNav items={sidebarNav} />
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden">
                    <Suspense fallback={<Loading />}>{children}</Suspense>
                </main>
            </div>
        </div>
    );
}
