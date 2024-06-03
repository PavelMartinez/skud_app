"use client";

import { useEffect, useRef, useState } from "react";
import "./QrStyles.css";
import QrScanner from "qr-scanner";
import { Descriptions, Modal, Skeleton, Image, Tag, DescriptionsProps, Button } from "antd";

export default function Page() {
    const scanner = useRef<QrScanner>();
    const videoEl = useRef<HTMLVideoElement>(null);
    const qrBoxEl = useRef<HTMLDivElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);
	const [scannerOn, setScannerOn] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<any>()
	const [description, setDescription] = useState<DescriptionsProps['items']>([])

	const showModal = () => {
	  	setIsModalOpen(true);
	};
  
	const handleScan = () => {
	  	setIsModalOpen(false);
		// fetch('/api/actionOnQr?user_id=' + user?.user.id + "&is_guest=" + user?.isGuest)
		// .then((res) => res.json())
		// .then((data) => {

		// 	setLoading(false);
		// })
	};
  
	const handleCancel = () => {
	  	setIsModalOpen(false);
	};

    // Success
    const onScanSuccess = (result: QrScanner.ScanResult) => {
        // 🖨 Print the "result" to browser console.
        // ✅ Handle success.
        // 😎 You can do whatever you want with the scanned result.
		
		showModal()
        fetchUser(result?.data);
    };

	const fetchUser = (secret: string) => {
		setLoading(true);
		fetch('/api/scanQr?secret_key=' + secret)
		.then((res) => res.json())
		.then((data) => {
			let items: DescriptionsProps['items'];
			if(data.isGuest)
			{
				items = [
					{
						key: '1',
						label: 'ID',
						children: data.user.id,
					},
					{
						key: '2',
						label: 'Фамилия',
						children: data.user.surname,
					},
					{
						key: '3',
						label: 'Имя',
						children: data.user.name,
					},
					{
						key: '4',
						label: 'Отчество',
						children: data.user.last_name,
					},
					{
						key: '5',
						label: 'Документ',
						children: data.user.document_number,
					},
					{
						key: '6',
						label: 'Причина посещения',
						children: data.user.visit_purpose,
					},
					{
						key: '7',
						label: 'Статус',
						children: !data.user.is_entered ? <Tag color="volcano">Не на работе</Tag> : <Tag color="green">На объекте</Tag>,
					},
					{
						key: '8',
						label: 'Посл. вход',
						children: data.user.lastEnteredAt || "Нет",
					},
					{
						key: '10',
						label: 'Посл. выход',
						children: data.user.lastLeftAt || "Нет",
					},
					{
						key: '13',
						label: 'Блокировка',
						children: data.user.is_blocked ? "Да" : "Нет",
					},
					{
						key: '14',
						label: 'ID системы',
						children: data.user.userId,
					},
				];
			}
			else {
				items = [
					{
						key: '2',
						label: 'Фамилия',
						children: data.user?.surname,
					},
					{
						key: '3',
						label: 'Имя',
						children: data.user?.name,
					},
					{
						key: '4',
						label: 'Отчество',
						children: data.user?.last_name,
					},
					{
						key: '5',
						label: 'Отдел',
						children: data.user?.department,
					},
					{
						key: '6',
						label: 'Должность',
						children: data.user?.position,
					},
					{
						key: '13',
						label: 'Блокировка',
						children: data.user?.is_blocked ? "Да" : "Нет",
					},
					{
						key: '14',
						label: 'ID системы',
						children: data.user?.userId,
					},
				];
			}
			setDescription(items);
			setUser(data);
			setLoading(false);
		})
	}

    // Fail
    const onScanFail = (err: string | Error) => {
        // 🖨 Print the "err" to browser console.
        console.log(err);
    };

    useEffect(() => {
		if (videoEl?.current && !scanner.current) {
            // 👉 Instantiate the QR Scanner
            scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
                onDecodeError: onScanFail,
                // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
                preferredCamera: "environment",
                // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
                highlightScanRegion: true,
                // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
                highlightCodeOutline: true,
                // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
                overlay: qrBoxEl?.current || undefined,
            });
		}
        // 🧹 Clean up on unmount.
        // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
        return () => {
            if (!videoEl?.current) {
                scanner?.current?.stop();
            }
        };
    }, []);

	//scannerOn
	useEffect(() => {
		if(scannerOn)
		{
			// 🚀 Start QR Scanner
			scanner?.current
				?.start()
				.then(() => setQrOn(true))
				.catch((err) => {
					if (err) setQrOn(false);
				});
		}
		else {
			scanner?.current?.stop();
		}
    }, [scannerOn]);

    // ❌ If "camera" is not allowed in browser permissions, show an alert.
    useEffect(() => {
        if (!qrOn)
            alert(
                "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
            );
    }, [qrOn]);

    return (
        <>
			<div className="qr-reader">
				<video ref={videoEl}></video>
			</div>
			{!scannerOn && <Button key="submit" type="primary" onClick={ () => setScannerOn(true) }>Включить сканер</Button>}
			{scannerOn && <Button key="submit" onClick={ () => setScannerOn(false) }>Выключить сканер</Button>}
			<Modal title="Информация" open={isModalOpen} onOk={handleScan} onCancel={handleCancel}
			        footer={[
						<Button key="back" onClick={handleCancel}>
						  Закрыть
						</Button>,
						<Button key="submit" type="primary" loading={loading} onClick={handleScan}>
						  Скан на {user?.isEntered ? "выход" : "вход"}
						</Button>
					  ]}>
				{loading && <Skeleton />}
				{!loading && user &&
					<Descriptions items={description} />
				}
				{!loading && user?.photo_path &&
					<Image
						width={400}
						src={`/assets/${user?.photo_path}`}
						fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
					/>
				}
			</Modal>
        </>
    );
}