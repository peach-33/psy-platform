import React from 'react';
import { TableHeader } from './table-header';
import { TableRow } from './table-row';
import { TableConfig } from '@/types/table';

interface TableProp {
    datas: any[];
    configs: TableConfig[];
    children?: React.ReactNode;
    headerChildren?: React.ReactNode;
}
export function Table({ datas, configs, children, headerChildren }: TableProp) {
    return (
        <>
            <div className="table-header p-2">{headerChildren}</div>
            <table className="table w-full">
                <TableHeader configs={configs} />
                <tbody>
                    {datas.map((data) => {
                        return <TableRow key={data.id} data={data} configs={configs} />;
                    })}
                </tbody>
            </table>
            <div className="px-4 py-2 flex justify-end">{children}</div>
        </>
    );
}
