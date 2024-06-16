'use client';

import { Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";

export default function Page() {
    const [stats, setStats] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
		fetch('/api/getStats')
		.then((res) => res.json())
		.then((data) => {
            setStats(data)
			setLoading(false)
		})
		.catch((e) => {
			setLoading(false)
		})
    }, [])

    return (
        <Row gutter={16}>
            <Col span={12}>
                <Statistic title="Всего сотрудников" value={stats?.employee?.all} loading={loading} />
            </Col>
            <Col span={12}>
                <Statistic title="На объекте" value={stats?.employee?.entered} loading={loading} />
            </Col>
            <Col span={12}>
                <Statistic title="На перерыве" value={stats?.employee?.break} loading={loading} />
            </Col>
            <Col span={12}>
                <Statistic title="Всего гостей на объекте" value={stats?.guest?.entered} loading={loading} />
            </Col>
        </Row>
    )
}