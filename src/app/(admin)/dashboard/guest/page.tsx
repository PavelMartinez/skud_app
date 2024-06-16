'use client';

import React from 'react';
import { Alert, Button, Cascader, Checkbox, ColorPicker, DatePicker, Form, Input, Radio, Select, Slider, Space, Switch, Table, Tag, TreeSelect, Upload } from 'antd';
import type { TableProps } from 'antd';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { stripIndents } from 'common-tags';

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
    title: 'Документ',
    dataIndex: 'document_number',
    key: 'document_number',
  },
  {
    title: 'Цель прихода',
    dataIndex: 'visit_purpose',
    key: 'visit_purpose',
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
        <Link href={"/dashboard/guest/info/" + record.id}>Инфо</Link>
		<Link href={"/dashboard/guest/edit/" + record.id}>Изменить</Link>
      </Space>
    ),
  },
];


interface NewSuccess {
	message: string;
}

const App: React.FC = () => {
	const [data, setData] = React.useState([])
	const [loading, setLoading] = React.useState(true)
	const [newSuccess, setNewSuccess] = React.useState<NewSuccess>()
	const session = useSession()
	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		const data = { ...values, createdByUser: session.data?.user.id }
		console.log('Received values of form: ', data);

		const newData = {
			surname: data.surname,
			name: data.name,
			last_name: data.last_name,
			visit_purpose: data.visit_purpose,
			document_number: data.document_number,
			createdByUser: session.data?.user.id,
			foreignId: data.foreignId,
			photo_path: data.photo[0].response.photo_path
		}

		setLoading(true)
		fetch('/api/addGuest', {
			method: 'POST',
			body: JSON.stringify(newData),
		})
		.then((res) => res.json())
		.then((data) => {
			setNewSuccess({
				message: stripIndents`
				Гость успешно добавлен. Сохраните его данные для входа в систему (Фамилия-Имя-Отчество_Логин_Пароль):

				${data.surname}-${data.name}-${data.last_name}_${data.username}_${data.password}
				`
			})
			form.resetFields();
			fetchGuests()
		})
	};

	const normFile = (e: any) => {
		console.log('Upload event:', e);

		if (Array.isArray(e)) {
			return e;
		}
	   	return e && e.fileList;
	};

	const fetchGuests = () => {
		fetch('/api/getGuests')
		.then((res) => res.json())
		.then((data) => {
			if(data.guests)
			{
				setData(data.guests.map((item: any) => {
						return {
							...item,
							key: item.id
						}; 
					}
				))
			}
			setLoading(false)
		})
	}

	React.useEffect(() => {
		fetchGuests()
	}, [])
	return (
		<>
			<Table columns={columns} dataSource={data} pagination={{ position: ["bottomRight"] }} loading={loading}/>

			<Form
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 14 }}
				layout="horizontal"
				disabled={loading} 
				title='Добавить гостя'
				onFinish={onFinish}
				form={form}
			>
				<Form.Item label="Фамилия" name="surname" rules={[{ required: true, message: 'Фамилия обязательна' }]}>
					<Input />
				</Form.Item>
				<Form.Item label="Имя" name="name" rules={[{ required: true, message: 'Имя обязательно' }]}>
					<Input />
				</Form.Item>
				<Form.Item label="Отчество" name="last_name">
					<Input />
				</Form.Item>
				<Form.Item label="Документ" name="document_number">
					<Input />
				</Form.Item>
				<Form.Item label="Цель прихода" name="visit_purpose">
					<Input />
				</Form.Item>
				<Form.Item label="Внутренний номер" name="foreignId">
					<Input />
				</Form.Item>
				<Form.Item label="Загрузить фото" name="photo" valuePropName="photo" rules={[{ required: true, message: 'Фотография обязательна' }]} required getValueFromEvent={normFile}>
					<Upload action="/api/uploadPhoto" listType="picture" maxCount={1} accept="image/png, image/jpeg">
						<Button>Выбрать файл</Button>
					</Upload>
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
						Добавить
					</Button>
				</Form.Item>
			</Form>

			{newSuccess && <Alert message={newSuccess.message} type="success" />}
		</>
	)
}

export default App;