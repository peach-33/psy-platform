import Link from 'next/link';
import { DashboardHeader } from '@/components/dashboard-header';
import { ExperimentEditor } from '@/components/experiment/experiment-ediotr';
import { ImageList } from '@/components/experiment/image-list';
import { db } from "@/lib/db"
import { ImageResponse } from '@/types/experiment';
import { ImageListServer } from '@/components/experiment/image-list-server';
import { dateFormat } from '@/lib/date';
import { ExperimentSetting } from '@/components/experiment/experiment-setting';

async function getExperimentInfos(experimentId: string) {
    const result = await db.psy_trail.findMany({
        where: {
            user_experiment_id: experimentId
        }
    })
    let formatResult: ImageResponse[] = result.map((e, idx) => {
        return {
            id: e.id.toString(),
            prompt: e.prompt || undefined,
            state: e.state || undefined,
            create_time: e.create_time ? dateFormat(e.create_time) : undefined,
            update_time: e.update_time ? dateFormat(e.update_time) : undefined,
            image_url: e.image_url || "",
            idx: idx
        }
    })
    return formatResult
}

/**预实验输入测试 */
export default async function PreInput({ params: { id } }: any) {

    const list = await getExperimentInfos(id)

    return (
        <div className='h-screen bg-white'>
            <div className='container mx-auto flex flex-col gap-8'>
                <DashboardHeader heading='实验说明' text='请在下方的文本框内输入您的想法和感受。'>
                    <ExperimentSetting />
                </DashboardHeader>
                <ImageListServer>
                    <ImageList experimentList={list} />
                </ImageListServer>
                <div className='flex flex-col gap-4 w-full'>
                    <ExperimentEditor back='/test/select' nanoId={id} />
                    <Link href='./experiment/start' className='w-full btn btn-outline btn-secondary '>
                        <button>跳过教程</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
