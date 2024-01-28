import { DashboardHeader } from '@/components/dashboard-header';
import { State } from '@/components/state';
import { Table } from '@/components/table/table';
import { dateFormat } from '@/lib/date';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { TableConfig } from '@/types/table';
import { ExperimentDetailButton } from '@/components/experiment/experiment-detail-button';
import { ExperimentCreateButton } from '@/components/experiment/experiment-create-button';
import Image from 'next/image';

async function getExperiments() {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
        return [];
    }

    const experiments = await db.$queryRaw<any[]>`
        select e.*, engine_image, engine_name
        from experiment e 
        left join engine en on en.id = e.engine_id
        where e.creator = ${currentUser.id}
        order by e.create_time desc
    `;

    return experiments;
}

/** 实验流程设计与管理 */
export default async function ExperimentList() {
    const datas = await getExperiments();

    return (
        <div className="container mx-auto">
            <div className="flex flex-col gap-4">
                <DashboardHeader heading="实验管理" text="创建新实验或者更新实验设置">
                    <ExperimentCreateButton className="btn btn-primary btn-sm" />
                </DashboardHeader>
                <div className="w-full overflow-auto">
                    <Table configs={experimentTableConfig} datas={datas} />
                </div>
            </div>
        </div>
    );
}

const experimentTableConfig: TableConfig[] = [
    {
        key: 'experiment_name',
        label: '实验名称',
        children: (data: any) => {
            return (
                <div className="flex flex-col gap-2">
                    <span>{data.experiment_name}</span>
                </div>
            );
        },
    },
    {
        key: 'engine_id',
        label: '使用引擎',
        children: (data: any) => {
            return (
                <div className="flex flex-col gap-2 justify-center">
                    <Image
                        className="rounded"
                        src={data.engine_image}
                        alt={data.engine_name}
                        width={48}
                        height={48}
                    />
                    <div className="text-gray-700">{data.engine_name}</div>
                </div>
            );
        },
    },
    {
        key: 'available',
        label: '状态',
        children: (data: any) => {
            let text = Boolean(data.available) ? '可用' : '暂停';
            return <State type="success">{text}</State>;
        },
    },
    {
        key: 'create_time',
        label: '创建时间',
        children: (data: any) => {
            return (
                <div className="flex flex-col gap-2">
                    <span>{dateFormat(data.create_time)}</span>
                </div>
            );
        },
    },
    {
        key: 'id',
        label: '操作',
        hidden: true,
        children: (data: any) => {
            return (
                <div className="flex gap-4 items-center">
                    <ExperimentDetailButton experiment={data} />
                </div>
            );
        },
    },
];
