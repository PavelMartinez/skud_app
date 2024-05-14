import { signIn } from "@/auth"
import { Button, Flex, Form, Input } from "antd"
import FormItem from "antd/lib/form/FormItem";
import InputPassword from "antd/lib/input/Password";
 
export function SignIn() {
	type FieldType = {
		username?: string;
		password?: string;
	};
  	return (
		<Form
			name="basic"
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			style={{ maxWidth: 600 }}
			initialValues={{ remember: true }}
			onFinish={async (formData) => {
				"use server"
				await signIn("credentials", formData)
				}}
			autoComplete="off"
		>
			<FormItem<FieldType>
				label="Логин"
				name="username"
				rules={[{ required: true, message: 'Введите логин!' }]}
			>
				<Input />
			</FormItem>
		
			<FormItem<FieldType>
			label="Пароль"
			name="password"
			rules={[{ required: true, message: 'Введите пароль!' }]}
			>
			<InputPassword />
			</FormItem>
		
			<FormItem wrapperCol={{ offset: 8, span: 16 }}>
			<Button type="primary" htmlType="submit">
				Войти
			</Button>
			</FormItem>
		</Form>
  	)
}