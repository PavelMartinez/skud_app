'use client';

import React from 'react';
import { Descriptions, Tag, Image, Skeleton, Result, Button, Table } from 'antd';
import type { DescriptionsProps, TableProps } from 'antd';
import { useRouter } from 'next/navigation'

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
	  key: 'issuedByUser',
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

export default function Page({ params }: { params: { slug: number } }) {
	const [description, setDescription] = React.useState<DescriptionsProps['items']>([])
	const [user, setUser] = React.useState<any>()
	const [userLogs, setUserLogs] = React.useState([])
	const [userQrs, setUserQrs] = React.useState([])
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(true)
	const router = useRouter()

	React.useEffect(() => {
		fetch('/api/getGuest?id=' + params.slug)
		.then((res) => res.json())
		.then((data) => {
			const user = data.guest;
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
					label: 'Документ',
					children: user.document_number,
				},
				{
					key: '6',
					label: 'Причина посещения',
					children: user.visit_purpose,
				},
				{
					key: '7',
					label: 'Статус',
					children: !user.is_entered ? <Tag color="volcano">Не на работе</Tag> : <Tag color="green">На объекте</Tag>,
				},
				{
					key: '8',
					label: 'Посл. вход',
					children: user.lastEnteredAt || "Нет",
				},
				{
					key: '10',
					label: 'Посл. выход',
					children: user.lastLeftAt || "Нет",
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
					width={400}
					src={`/assets/${user?.photo_path}`}
				/>
			}
			<Table
			columns={columnsLog} dataSource={userLogs} pagination={{ position: ["bottomRight"] }} loading={loading} title={() => 'Логи сотрудника'} />
			<Table
			columns={columnsQr} dataSource={userQrs} pagination={{ position: ["bottomRight"] }} loading={loading}  title={() => 'QR сотрудника'}/>
		</>
	)
}