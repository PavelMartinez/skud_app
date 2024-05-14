'use client';

import React from 'react';
import { Radio, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import Link from 'next/link';

interface DataType {
	id: number;
    key: string;
    surname: string;
    name: string;
    last_name: string;
	department: string;
	position: string;
	status: string;
	is_entered: 1 | 0;
	is_onBreak: 1 | 0;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Фамилия',
    dataIndex: 'surname',
    key: 'surname',
  },
  {
    title: 'Имя',
    dataIndex: 'name',
    key: 'surname',
  },
  {
    title: 'Отчество',
    dataIndex: 'last_name',
    key: 'last_name',
  },
  {
    title: 'Департамент',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: 'Должность',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: 'Статус',
    key: 'status',
	render: (_: any, record: DataType) => {
		if(!record.is_entered) return (<Tag color="volcano">Не на работе</Tag>)
		if(record.is_entered) return (<Tag color="green">На объекте</Tag>)
		if(record.is_onBreak) return (<Tag color="geekblue">Перерыв</Tag>)
	}
  },
  {
    title: 'Действия',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Link href={"/dashboard/employee/info/" + record.id}>Инфо</Link>
		<Link href={"/dashboard/employee/edit/" + record.id}>Изменить</Link>
        <Link href={"/dashboard/employee/" + record.id} style={{color: "red"}}>Блокировка</Link>
      </Space>
    ),
  },
];

const App: React.FC = () => {
	const [data, setData] = React.useState([])
	const [tableLoading, setTableLoading] = React.useState(true)

	React.useEffect(() => {
		fetch('/api/getEmployees')
		.then((res) => res.json())
		.then((data) => {
			setData(data.users.map((item: any) => {
					return {
						...item,
						key: item.id
					}; 
				}
			))
			setTableLoading(false)
		})
	}, [])
	return (
		<>
			<Table columns={columns} dataSource={data} pagination={{ position: ["bottomRight"] }} loading={tableLoading}/>
		</>
	)
}

export default App;