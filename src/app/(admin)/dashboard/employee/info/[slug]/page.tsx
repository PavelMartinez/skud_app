'use client';

import React from 'react';
import { Descriptions, Tag, Image, Skeleton, Result, Button, Table } from 'antd';
import type { DescriptionsProps, TableProps } from 'antd';
import { useRouter } from 'next/navigation'
import Title from 'antd/lib/typography/Title';

interface DataTypeLog {
	id: number;
    key: string;
	action: 'createdQr' | 'enteredQr' | 'leftQr' |'leftOnBreakQr' | 'enteredAfterBreakQr';
	issuedByUser: string;
	createdAt: string;
}


enum LogAction {
	createdQr = "QR создан",
	enteredQr = "QR проход",
	leftQr = "QR выход",
	leftOnBreakQr = "QR выход перерыв",
	enteredAfterBreakQr = "QR вход перерыв"
}

const columnsLog: TableProps<DataTypeLog>['columns'] = [
	{
		title: 'ID',
		dataIndex: 'id',
		key: 'id',
	},
	{
		title: 'Действие',
		key: 'action',
		render: (_: any, record: DataTypeLog) => (<Tag>{LogAction[record.action]}</Tag>)
	},
	{
	  title: 'Ответственный',
	  dataIndex: 'issuedByUser',
	  key: 'issuedByUser',
	},
	{
	  title: 'Создан',
	  dataIndex: 'createdAt',
	  key: 'createdAt',
	}
  ];

export default function Page({ params }: { params: { slug: number } }) {
	const [description, setDescription] = React.useState<DescriptionsProps['items']>([])
	const [user, setUser] = React.useState<any>()
	const [userLogs, setUserLogs] = React.useState([])
	const [userQrs, setUserQrs] = React.useState([])
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(true)
	const router = useRouter()

	React.useEffect(() => {
		fetch('/api/getEmployee?id=' + params.slug)
		.then((res) => res.json())
		.then((data) => {
			const user = data.user;
			console.log(user)
			if(!user)
			{
				setLoading(false)
				return setError("Пользователь не найден")
			}
			const items: DescriptionsProps['items'] = [
				{
					key: '1',
					label: 'ID',
					children: user.id,
				},
				{
					key: '2',
					label: 'Фамилия',
					children: user.surname,
				},
				{
					key: '3',
					label: 'Имя',
					children: user.name,
				},
				{
					key: '4',
					label: 'Отчество',
					children: user.last_name,
				},
				{
					key: '5',
					label: 'Отдел',
					children: user.department,
				},
				{
					key: '6',
					label: 'Должность',
					children: user.position,
				},
				{
					key: '7',
					label: 'Статус',
					children: !user.is_entered ? <Tag color="volcano">Не на работе</Tag> : (user.is_onBreak ? <Tag color="geekblue">Перерыв</Tag> : <Tag color="green">На объекте</Tag>),
				},
				{
					key: '8',
					label: 'Посл. вход',
					children: user.lastEnteredAt || "Нет",
				},
				{
					key: '9',
					label: 'Посл. перерыв',
					children: user.lastBreakAt || "Нет",
				},
				{
					key: '10',
					label: 'Посл. выход',
					children: user.lastLeftAt || "Нет",
				},
				{
					key: '11',
					label: 'Предупреждения',
					children: user.warns,
				},
				{
					key: '12',
					label: 'Посл. предупреждение',
					children: user.lastWarnAt || "Нет",
				},
				{
					key: '13',
					label: 'Блокировка',
					children: user.is_blocked ? "Да" : "Нет",
				},
				{
					key: '14',
					label: 'ID системы',
					children: user.userId,
				},
			];
			setDescription(items)
			setUser(user)
			if(user.Logs)
				setUserLogs(user.Logs.map((item: any) => {
					return {
						...item,
						key: `log${item.id}`
					}; 
				}))
			if(user.Qrs)
				setUserQrs(user.Qrs.map((item: any) => {
					return {
						...item,
						key: `Qr${item.id}`
					}; 
				}))
			setLoading(false)
		})
		.catch((e) => {
			setLoading(false)
			setError("При запросе произошла ошибка")
		})
	}, [])
	return (
		<>
			{error &&
				<Result
				status="error"
				title={"Произошла ошибка: " + error}
				extra={
				<Button type="primary" key="console" onClick={() => router.back()}>
					Назад
				</Button>
				}
			/>
			}
			{loading && <Skeleton />}
			{!loading && user &&
				<Descriptions title="Информация" items={description} />
			}
			{!loading && user?.photo_path &&
				<Image
					width={500}
					height={500}
					src="error"
					fallback="data:image/png;base64,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"
				/>
			}
			{userLogs && <Table
			columns={columnsLog} dataSource={userLogs} pagination={{ position: ["bottomRight"] }} loading={loading}/>}
		</>
	)
}