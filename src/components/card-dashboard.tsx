'use client'

import { Card, CardContent, CardTitle } from "./ui/card"


type DashboardProps = {
  value: number | string; 
  label: string;          
  iconColor?: string;   
  icon: React.ReactNode;
}

const CardDashboard = ({ value, label, icon, iconColor = "text-blue-500" }: DashboardProps) => {
  return (
    <Card className="flex flex-col items-start justify-between py-8 px-5 w-full border border-gray-100 shadow-sm bg-white rounded-xl hover:shadow-md transition-shadow">
      <div className="flex flex-col items-start gap-2 w-full">
        <div className={`p-0 ${iconColor}`}>
          {icon}
        </div>
        <CardTitle className="text-sm font-medium text-gray-500">
          {label}
        </CardTitle>
      </div>
      <CardContent className="p-0 mt-2">
        <span className="text-4xl font-bold text-gray-900">
          {value}
        </span>
      </CardContent>
    </Card>
  )
}

export default CardDashboard