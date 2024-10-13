import "@src/app.css";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  Phone,
  Clock,
  SmilePlus,
  Bot,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';

// Define types for your data
interface CallData {
  week: string;
  calls: number;
  call_duration: string;
  call_start_time: Date;
}

interface Analysis {
  totalCalls: number;
  avgCallDuration: number;
  customerSatisfaction: number;
  weeklyCallVolume: Record<number, number>;
}

const dt: CallData[] = [
  { week: "Week 1", calls: 1000, call_duration: "5 min", call_start_time: new Date() },
  { week: "Week 2", calls: 1500, call_duration: "6 min", call_start_time: new Date() },
  { week: "Week 3", calls: 1200, call_duration: "4 min", call_start_time: new Date() },
  { week: "Week 4", calls: 1800, call_duration: "7 min", call_start_time: new Date() },
];

// const GET_CALL_DATA_URL = "https://6274-2603-8080-8f0-b730-75a5-419f-c6a6-892b.ngrok-free.app/callData"
const GET_CALL_DATA_URL = "http://localhost:3000/callData"

// Component for metric cards
const MetricCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: any }) => (
  <Card className="bg-gray-800 border-gray-700 hover:border-emerald-500 transition-all duration-300 transform hover:scale-105">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
        </div>
        <Icon className="h-8 w-8 text-emerald-400" />
      </div>
    </CardContent>
  </Card>
);

// Component for action cards
const ActionCard = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <Card className="bg-gray-800 border-gray-700 hover:border-emerald-500 transition-all duration-300 transform hover:scale-105 cursor-pointer">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <Icon className="h-6 w-6 text-emerald-400" />
      </div>
    </CardContent>
  </Card>
);

const processData = (data) => {
  return data.map((item) => ({
    week: moment(item.call_start_time).week(),
    calls: 1, // Assuming each item represents one call
    call_duration: parseInt(item.call_duration.split(' ')[0]) // Extract minutes from "10 minutes"
  })).reduce((acc, curr) => {
    const weekIndex = acc.findIndex((item) => item.week === curr.week);
    if (weekIndex !== -1) {
      acc[weekIndex].calls++;
      acc[weekIndex].call_duration += curr.call_duration;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);
};

// Main dashboard component
function Dashboard() {
  const [data, setData] = useState<CallData[]>(dt);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [graphData, setGraphData] = useState([]);

  // Calculate average call duration
  const calculateAvgCallDuration = (data: CallData[]): number => {
    
    const totalDuration = data.reduce((sum, call) => {
      const durationParts = call.call_duration.split(" ")[0];
      return sum + parseInt(durationParts, 10);
    }, 0);

    return totalDuration / data.length; // Average in minutes
  };

  // Perform all calculations based on data
  const performCalculations = (data: CallData[]): void => {
    const totalCalls = data.length;
    const avgCallDuration = calculateAvgCallDuration(data);
    const customerSatisfaction = 95; // Assuming a static value
    const weeklyCallVolume = calculateWeeklyCallVolume(data);

    setAnalysis({
      totalCalls,
      avgCallDuration,
      customerSatisfaction,
      weeklyCallVolume,
    });
  };

  // Function to calculate the week number from a date
  function getWeek(date: Date): number {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
  }

  // Calculate weekly call volume
  const calculateWeeklyCallVolume = (data: CallData[]): Record<number, number> => {
    const weeklyVolume: Record<number, number> = {};
    data.forEach((call) => {
      const weekNumber = getWeek(new Date(call.call_start_time));
      weeklyVolume[weekNumber] = (weeklyVolume[weekNumber] || 0) + 1;
    });

    return weeklyVolume;
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(GET_CALL_DATA_URL);
        console.log(response.data);
        setData(response.data);
        performCalculations(response.data);
        const processedData = processData(response.data);
        setGraphData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <span className="flex justify-start items-center mb-8">
        <Link to="/">
          <div className="transform transition-all duration-500 hover:scale-110 mr-5 relative top-[2px]">
            <svg
              className="w-8 h-8 text-emerald-400 animate-pulse"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
        </Link>
        <h1 className="text-4xl font-bold animate-fade-in-down">
          Here are your Insights
        </h1>
      </span>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Total Calls" value={analysis?.totalCalls ?? "Loading..."} icon={Phone} />
        <MetricCard title="Avg. Call Duration" value={`${analysis?.avgCallDuration.toFixed(2) ?? "0"} min`} icon={Clock} />
        <MetricCard title="Customer Satisfaction" value={`${analysis?.customerSatisfaction ?? 0}%`} icon={SmilePlus} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/businesssetup">
          <ActionCard title="Manage Bot Data" icon={Bot} />
        </Link>
        <Link to="/vieworders">
          <ActionCard title="View Orders" icon={ShoppingCart} />
        </Link>
      </div>

      <Card className="bg-gray-800 border-gray-700 p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Weekly Call Volume</h2>
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none" }} itemStyle={{ color: "#10B981" }} />
              <Line
                type="monotone"
                dataKey="calls"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "#10B981", strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
