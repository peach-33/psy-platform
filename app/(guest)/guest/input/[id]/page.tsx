import { DashboardHeader } from '@/components/dashboard-header';
import { ExperimentEditor } from '@/components/experiment/experiment-editor';
import { ImageList } from '@/components/experiment/image-list';
import { db } from '@/lib/db';
import { ImageResponse } from '@/types/experiment';
import { ImageListServer } from '@/components/experiment/image-list-server';
import { dateFormat } from '@/lib/date';
import { ExperimentSetting } from '@/components/experiment/experiment-setting';
import { ExperimentFinishButton } from '@/components/experiment/experiment-finish-button';
import { CountDown } from '@/components/countdown';
import { notFound } from 'next/navigation';

async function getExperimentInfos(experimentId: string) {
    if (!experimentId) {
        return [];
    }

    // 获取用户实验prompt信息
    const result = await db.trail.findMany({
        where: { user_experiment_id: experimentId },
    });

    const formatResult: ImageResponse[] = result.map((e, idx) => {
        return {
            id: e.id.toString(),
            prompt: e.prompt || undefined,
            state: e.state || undefined,
            create_time: e.create_time ? dateFormat(e.create_time) : undefined,
            update_time: e.update_time ? dateFormat(e.update_time) : undefined,
            image_url: e.image_url || '',
            idx: idx,
        };
    });
    return formatResult;
}

async function getExperiment(userId: string, experimentId: string) {
    const user = await db.user.findFirst({
        where: { nano_id: userId },
    });
    if (!user) {
        return notFound();
    }

    const experiment = await db.user_experiments.findFirst({
        where: { user_id: user.id, nano_id: experimentId },
    });

    return experiment;
}

/**正式实验输入测试 */
export default async function GuestMainInput({
    params: { id },
    searchParams,
}: {
    params: { id: string };
    searchParams: { [key: string]: string };
}) {
    // 获取用户实验prompt信息
    const list = await getExperimentInfos(id);
    const userExperimentId = searchParams['e'];
    const guestNanoId = id;
    const experiment = await getExperiment(guestNanoId, userExperimentId);

    const startTime = experiment?.start_time
        ? Math.floor(new Date(experiment?.start_time).getTime() / 1000)
        : new Date().getTime() / 1000;

    return (
        <div className="bg-white mb-8">
            <div className="container mx-auto flex flex-col gap-4">
                <DashboardHeader heading="实验说明" text="请在下方的文本框内输入您的想法和感受。">
                    <div className="flex gap-2">
                        <ExperimentSetting />
                        <ExperimentFinishButton nanoId={id} guest={true} experimentList={list} />
                    </div>
                </DashboardHeader>
                <div className="flex justify-center">
                    <CountDown start={startTime} limit={330} nanoId={id} />
                </div>
                <ImageListServer>
                    <ImageList experimentList={list} />
                </ImageListServer>
                <div className="flex flex-col gap-4 w-full">
                    <ExperimentEditor
                        nanoId={id}
                        trail={false}
                        experimentList={list}
                        experimentNanoId={searchParams['e']}
                    />
                </div>
            </div>
        </div>
    );
}
