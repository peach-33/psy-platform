import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * /api/log/[id]
 * 记录获取实验记录
 *
 * @returns
 */
export async function GET(request: Request, context: { params: any }) {
    try {
        // 记录日志
        // ...
        const experimentId = context.params.id;
        const userExperiment = await db.user_experiments.findFirst({
            where: { nano_id: experimentId },
        });

        // TODO 添加下载文件名称
        // const experiment = await db.experiment.findFirst({
        //     where: { id: parseInt(userExperiment?.experiment_id) },
        // });

        const userId = userExperiment?.user_id as number;
        const user = await db.user.findFirst({
            where: { id: userId },
        });

        const response = await db.trail_logger.findMany({
            where: { experiment_id: experimentId },
            select: {
                input: true,
                images: true,
                timestamp: true,
            },
        });

        if (response.length === 0) {
            return NextResponse.json({ msg: '没有记录' }, { status: 404 });
        }
        let csvContent = '\uFEFF';
        csvContent += `${user?.username},${user?.qualtrics},${user?.tel}\n`; // 添加标题行
        csvContent += 'Input,Images,Timestamp\n'; // 添加标题行
        response.forEach((row) => {
            let input = (row.input as string) || '';
            let images = row.images as string[];

            // 转义引号并处理数据中的逗号和双引号
            const inputEscaped = `"${input.replace(/"/g, '""')}"`;
            const imagesEscaped = images.map((image) => image.replace(/"/g, '""')).join('|');
            const timestampEscaped = `"${row.timestamp}"`;

            // 使用转义后的数据构建CSV行
            csvContent += `${inputEscaped},${imagesEscaped},${timestampEscaped}\n`;
        });

        // 返回CSV文件
        const filename = `${context.params.id}.csv`;
        return new Response(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('更新失败:', error);
        return NextResponse.json({ msg: '服务器错误' }, { status: 500 });
    }
}
