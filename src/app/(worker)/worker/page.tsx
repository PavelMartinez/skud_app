"use client";

import { EmployeeAttributes } from "@/database/models/Employee";
import { GuestAttributes } from "@/database/models/Guest";
import { QrAttributes } from "@/database/models/Qr";
import { Button, QRCode, Skeleton, Space, Tabs, TabsProps } from "antd";
import React from "react";

interface DataType {
	qr?: QrAttributes;
	user?: EmployeeAttributes | GuestAttributes;
	isGuest: boolean;
}

export default function Page() {
	const [enterQrData, setEnterQrData] = React.useState<DataType>();
	const [breakQrData, setBreakQrData] = React.useState<DataType>();
	const [enterLoading, setEnterLoading] = React.useState(false);
	const [breakLoading, setBreakLoading] = React.useState(false);
	const [isEnterQrExpired, setIsEnterQrExpired] = React.useState(false);
	const [isBreakQrExpired, setIsBreakQrExpired] = React.useState(false);

	const items = [
		{
			key: '1',
			label: 'Вход/Выход',
			children: <QRCode value={enterQrData?.qr?.secret_key || "undefined"} status={enterLoading ? "loading" : (isEnterQrExpired ? "expired" : "active")} onRefresh={() => fetchEnterQR()}/>,
		},
		{
			key: '2',
			label: 'Перерыв',
			disabled: enterQrData?.isGuest ? true : false,
			children: 
				<Space direction="vertical">
					{!breakQrData && <Button type="primary" onClick={() => { fetchBreakQR() }}>Выйти на перерыв</Button>}
					<QRCode value={breakQrData?.qr?.secret_key || "undefined"} status={breakLoading || !breakQrData ? "loading" : (isBreakQrExpired ? "expired" : "active")} onRefresh={() => fetchBreakQR()}/>
				</Space>,
		},
	];
	// const items = React.useCallback(() => {
	// 	if(enterQrData)
	// 	{
	// 		console.log("callback")
	// 		return 
	// 	}
	// }, [enterQrData])

	React.useEffect(() => {
		fetchEnterQR();
	}, []);

	React.useEffect(() => {
		const checkExpirationEnter = (expiredAt: Date | undefined) => {
		  const currentTime = new Date().getTime();
		  const expirationTime = new Date(expiredAt || "").getTime();
		  
		  if (currentTime > expirationTime) {
			setIsEnterQrExpired(true);
		  } else {
			setIsEnterQrExpired(false);
		  }
		};
	
		checkExpirationEnter(enterQrData?.qr?.expiredAt);
		
		// Устанавливаем интервал для проверки каждые 60 секунд (или любое другое значение)
		const intervalId = setInterval(() => checkExpirationEnter(enterQrData?.qr?.expiredAt), 60000);
	
		return () => {
			clearInterval(intervalId);
		} // Очищаем интервал при размонтировании компонента
	  }, [enterQrData?.qr?.expiredAt]);


	  React.useEffect(() => {
		const checkExpirationBreak = (expiredAt: Date | undefined) => {
			const currentTime = new Date().getTime();
			const expirationTime = new Date(expiredAt || "").getTime();
			
			if (currentTime > expirationTime) {
			  setIsBreakQrExpired(true);
			} else {
			  setIsBreakQrExpired(false);
			}
		  };
	
		checkExpirationBreak(breakQrData?.qr?.expiredAt);
		
		// Устанавливаем интервал для проверки каждые 60 секунд (или любое другое значение)
		const intervalId = setInterval(() => checkExpirationBreak(breakQrData?.qr?.expiredAt), 60000);
	
		return () => {
			clearInterval(intervalId);
		} // Очищаем интервал при размонтировании компонента
	  }, [breakQrData?.qr?.expiredAt]);

	const fetchEnterQR = () => {
		setEnterLoading(true)
		fetch('/api/getEnterQr')
		.then((res) => res.json())
		.then((data) => {
			setEnterQrData(data)
			setEnterLoading(false)
		})
	}

	const fetchBreakQR = () => {
		setBreakLoading(true)
		fetch('/api/getBreakQr')
		.then((res) => res.json())
		.then((data) => {
			setBreakQrData(data)
			setBreakLoading(false)
		})
	}

	return (
		<>
			<Tabs defaultActiveKey="1" items={items} />

			{enterLoading && <Skeleton />}
			
			{!enterLoading && 
			<Space direction="vertical" align="center" style={{ width: "100%" }}>
				<div>{enterQrData?.user?.surname}</div>
				<div>{enterQrData?.user?.name}</div>
				<div>{enterQrData?.user?.last_name}</div>
			</Space>
			}
		</>
	)
}