"use client"

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts"
import { ChartData } from "@/actions/dashboard"

interface OverviewChartProps {
    data: ChartData[]
}

interface CustomTooltipProps {
    active?: boolean
    payload?: { value: number }[] 
    label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0) {
        return (
            <div className="bg-white border border-slate-200 shadow-lg rounded-xl p-3 min-w-[150px]">
                <p className="font-bold text-slate-800 text-sm mb-2">{label}</p>
                <div className="flex items-center gap-2">
                    <span className="block w-2 h-2 rounded-full bg-blue-600"></span>
                    <p className="text-sm text-slate-600">
                        Média: <span className="font-bold text-slate-900">{payload[0].value}</span>
                    </p>
                </div>
            </div>
        )
    }
    return null
}

export function OverviewChart({ data }: OverviewChartProps) {
    if (data.length === 0) {
        return (
            <div className="h-[350px] w-full flex flex-col items-center justify-center text-slate-400 gap-2 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                <p className="text-sm font-medium">Dados insuficientes</p>
                <p className="text-xs">O gráfico aparecerá quando houver notas lançadas.</p>
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

                <XAxis
                    dataKey="nome"
                    stroke="#64748B"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: string) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                />

                <YAxis
                    stroke="#64748B"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9', radius: 4 }} />

                <Bar
                    dataKey="notaMedia"
                    fill="#2563EB"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    activeBar={{ fill: "#1D4ED8" }}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}