'use client';

import React from 'react';
import { Alert, Button, Form, Input, Upload } from 'antd';
import { useSession } from 'next-auth/react';
import { stripIndents } from 'common-tags';

const options = [
	{ value: 1, label: 'Сотрудник' },
	{ value: 2, label: 'Менеджер' },
	{ value: 3, label: 'Старший менеджер' },
	{ value: 4, label: 'Разработчик' }
]

interface NewSuccess {
	message: string;
}

export default function Page({ params }: { params: { slug: number } }) {
	const [data, setData] = React.useState<any>()
	const [loading, setLoading] = React.useState(true)
	const [newSuccess, setNewSuccess] = React.useState<NewSuccess>()
	const session = useSession()
	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		console.log(session.data)
		const data = { ...values, createdByUser: session.data?.user.id }
		console.log('Received values of form: ', data);

		const newData = {
			surname: data.surname,
			name: data.name,
			last_name: data.last_name,
			department: data.department,
			position: data.position,
			createdByUser: session.data?.user.id,
			foreignId: data.foreignId,
			photo_path: data.photo ? data.photo[0].response.photo_path : null,
            employeeId: params.slug
		}

		setLoading(true)
		fetch('/api/editEmployee', {
			method: 'POST',
			body: JSON.stringify(newData),
		})
		.then((res) => res.json())
		.then((data) => {
			setNewSuccess({
				message: stripIndents`
				Информация о сотруднике отредактирована
				`
			})
			form.resetFields();
			fetchUser()
		})
	};

	const normFile = (e: any) => {
		console.log('Upload event:', e);

		if (Array.isArray(e)) {
			return e;
		}
	   	return e && e.fileList;
	};

	const fetchUser = () => {
        setLoading(true)
		fetch('/api/getEmployee?id=' + params.slug)
		.then((res) => res.json())
		.then((data) => {
			const user = data.user;
            form.setFieldsValue({
                surname: user?.surname,
                name: user?.name,
                last_name: user?.last_name,
                department: user?.department,
                position: user?.position,
                foreignId: user?.foreignId,
                role: user?.role
            })
            console.log(user)
            setLoading(false)
		})
	}

	React.useEffect(() => {
		fetchUser()
	}, [])
	return (
		<>
			<Form
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 14 }}
				layout="horizontal"
				disabled={loading} 
				title='Редактировать сотрудника'
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
				<Form.Item label="Отдел" name="department">
					<Input />
				</Form.Item>
				<Form.Item label="Должность" name="position">
					<Input />
				</Form.Item>
				<Form.Item label="Внутренний номер" name="foreignId">
					<Input />
				</Form.Item>
				{/* <Form.Item label="Роль" name="role" rules={[{ required: true, message: 'Роль обязательна' }]}>
					<Select options={filteredOptions()} />
				</Form.Item> */}
				<Form.Item label="Загрузить фото" name="photo" valuePropName="photo" getValueFromEvent={normFile}>
					<Upload action="/api/uploadPhoto" listType="picture" maxCount={1} accept="image/png, image/jpeg">
						<Button>Выбрать файл</Button>
					</Upload>
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
						Сохранить
					</Button>
				</Form.Item>
			</Form>

			{newSuccess && <Alert message={newSuccess.message} type="success" />}
		</>
	)
}