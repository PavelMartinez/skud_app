'use client';

import React from 'react';
import { Descriptions, Tag, Image, Skeleton, Result, Button, Table } from 'antd';
import type { DescriptionsProps, TableProps } from 'antd';
import { useRouter } from 'next/navigation'
import Link from 'next/link';

interface DataTypeLog {
	id: number;
    key: string;
	action: 'createdQr' | 'enteredQr' | 'leftQr' |'leftOnBreakQr' | 'enteredAfterBreakQr';
	issuedByUser: string;
	createdAt: string;
}

interface DataTypeQr {
	id: number;
    key: string;
	type: 'enterleave' | 'break';
	is_expired: number;
	expiredAt: string;
	createdAt: string;
}

interface DataTypePresence {
    key: string;
	date: any;
	duration: number;
}


enum LogAction {
	createdQr = "QR создан",
	enteredQr = "QR проход",
	leftQr = "QR выход",
	leftOnBreakQr = "QR выход перерыв",
	enteredAfterBreakQr = "QR вход перерыв"
}

enum QrType {
	enterleave = "Вход/Выход",
	break = "Перерыв",
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
	  render: (_: any, record: DataTypeLog) => (<Link href={`/dashboard/employee/info/${record.issuedByUser}`}>{record.issuedByUser}</Link>)
	},
	{
	  title: 'Создан',
	  dataIndex: 'createdAt',
	  key: 'createdAt',
	}
];

const columnsQr: TableProps<DataTypeQr>['columns'] = [
	{
		title: 'ID',
		dataIndex: 'id',
		key: 'id',
	},
	{
		title: 'Тип',
		key: 'action',
		render: (_: any, record: DataTypeQr) => (<Tag>{QrType[record.type]}</Tag>)
	},
	{
	  title: 'Устаревший',
	  dataIndex: 'is_expired',
	  key: 'is_expired',
	},
	{
		title: 'Устареет',
		dataIndex: 'expiredAt',
		key: 'expiredAt',
	},
	{
	  title: 'Создан',
	  dataIndex: 'createdAt',
	  key: 'createdAt',
	}
];

const columnsPresence: TableProps<DataTypePresence>['columns'] = [
	{
	  title: 'Дата',
	  dataIndex: 'date',
	  key: 'date',
	},
	{
	  title: 'Время на объекте (мин)',
	  dataIndex: 'duration',
	  key: 'duration',
	  render: (_: any, record: DataTypePresence) => <>{Math.ceil(record.duration / 60)}</>
	}
];

export default function Page({ params }: { params: { slug: number | string } }) {
	const [description, setDescription] = React.useState<DescriptionsProps['items']>([])
	const [user, setUser] = React.useState<any>()
	const [userLogs, setUserLogs] = React.useState([])
	const [userQrs, setUserQrs] = React.useState([])
	const [userPresence, setUserPresence] = React.useState([])
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
			if(data.presenceReport)
			{
				setUserPresence(data.presenceReport.map((item: any) => {
					return {
						...item,
						key: `Qr${item.id}`
					}; 
				}))
			}
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
					width={400}
					src={`/assets/${user?.photo_path}`}
				/>
			}
			<Table
			columns={columnsPresence} dataSource={userPresence} pagination={{ position: ["bottomRight"] }} loading={loading} title={() => 'Присутствие на объекте'} />
			<Table
			columns={columnsLog} dataSource={userLogs} pagination={{ position: ["bottomRight"] }} loading={loading} title={() => 'Логи сотрудника'} />
			<Table
			columns={columnsQr} dataSource={userQrs} pagination={{ position: ["bottomRight"] }} loading={loading}  title={() => 'QR сотрудника'}/>
		</>
	)
}