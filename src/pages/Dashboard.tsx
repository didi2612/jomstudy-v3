import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Line } from 'react-chartjs-2';
import {
  CloudIcon,
} from '@heroicons/react/24/outline';
import{

} from '@heroicons/react/24/solid';
import { FiThermometer, FiDroplet  } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SensorData {
  box_id: string;
  h2: number;
  co2: number;
  gas: number;
  temperature: number;
  quality: number | null;
  humidity: number;
  alert: boolean;
  created_at: string;
}

function Dashboard() {
  const [data, setData] = useState<SensorData[]>([]);
  const [selectedBox, setSelectedBox] = useState<string>('');
  const [shownAlerts, setShownAlerts] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    try {
      const { data: boxIds, error: boxError } = await supabase
        .from('environment_data')
        .select('box_id')
        .neq('box_id', null)
        .order('created_at', { ascending: false });

      if (boxError) throw boxError;

      const uniqueBoxIds = Array.from(new Set(boxIds.map(entry => entry.box_id)));

      const promises = uniqueBoxIds.map(async (boxId) => {
        const { data, error } = await supabase
          .from('environment_data')
          .select('*')
          .eq('box_id', boxId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) return [];

        return data;
      });

      const results = await Promise.all(promises);
      const allData = results.flat();
      setData(allData);

      if (!selectedBox && uniqueBoxIds.length > 0) {
        setSelectedBox(uniqueBoxIds[0]);
      }

      uniqueBoxIds.forEach((boxId) => {
        const latestEntry = allData.find((entry) => entry.box_id === boxId);
        const isAlert = latestEntry?.alert ?? false;

        if (isAlert && !shownAlerts[boxId]) {
          toast.warning(`⚠️ Alert for Box ${boxId}: Gas or CO₂ levels abnormal`, {
            position: "top-right",
            autoClose: 5000,
          });
          setShownAlerts((prev) => ({ ...prev, [boxId]: true }));
        } else if (!isAlert && shownAlerts[boxId]) {
          toast.dismiss();
          setShownAlerts((prev) => ({ ...prev, [boxId]: false }));
        }
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [selectedBox]);

  

  const groupedData = data.reduce((acc, entry) => {
    if (!acc[entry.box_id]) acc[entry.box_id] = [];
    acc[entry.box_id].push(entry);
    return acc;
  }, {} as Record<string, SensorData[]>);

  const renderChart = (boxId: string, boxData: SensorData[]) => {
    const reversedData = [...boxData].reverse();
    
    const allGasNull = reversedData.every((entry) => entry.gas == null);
    const labels = reversedData.map((entry) =>
      new Date(entry.created_at).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // This ensures the time is in 24-hour format
      timeZone: 'Asia/Kuala_Lumpur', // Ensure the time stays in UTC
    })
    );
  
    const chartConfig = (
  label: string,
  color: string,
  dataKey: keyof SensorData
) => ({
  labels,
  datasets: [
    {
      label,
      data: reversedData.map((entry) => entry[dataKey]),
      borderColor: color,
      backgroundColor: `${color}33`,
      fill: true,
      tension: 0.3,
    },
  ],
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#333' },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: label, // <-- dynamic Y-axis label
          color: '#333',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#333',
        },
      },
      x: {
        ticks: {
          color: '#333',
        },
      },
    },
  },
});

  
    const allCO2Null = reversedData.every((entry) => entry.co2 === null);
  
   return (
      <div key={boxId} className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* H₂ or CO₂ */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-[#00968F] mb-4">
              {allCO2Null ? 'H₂ Concentration (ppm)' : 'CO₂ (MG-811)'}
            </h3>
            <div className="h-[300px]">
              <Line
  data={chartConfig(
    allCO2Null ? 'H₂ (%)' : 'CO₂ (ppm)',
    '#00968F',
    allCO2Null ? 'h2' : 'co2'
  )}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#333' },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time', // X-axis label
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#333',
        },
      },
      y: {
        title: {
          display: true,
          text: allCO2Null ? 'H₂ (ppm)' : 'CO₂ (ppm)', // Y-axis label
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#333',
        },
      },
    },
  }}
/>

            </div>
          </div>

          {/* Gas or Air Quality */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-[#00B0A8] mb-4">
              {allGasNull ? 'CO₂ (MQ-135)' : 'Gas Concentration (H₂)'}
            </h3>
            <div className="h-[300px]">
           <Line
  data={chartConfig(
    allGasNull ? 'CO₂(ppm)' : 'Gas(ppm)',
    '#00B0A8',
    allGasNull ? 'quality' : 'gas'
  )}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time', // X-axis label
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: allGasNull ? 'CO₂ (ppm)' : 'Gas (ppm)', // Y-axis label
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
  }}
/>


            </div>
          </div>

          {/* Temperature */}
          {/* Temperature */}
<div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
  <h3 className="text-lg font-semibold text-[#FF6347] mb-4">Temperature (°C)</h3>
  <div className="h-[300px]">
    <Line
      data={chartConfig('Temperature (°C)', '#FF6347', 'temperature')}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Temperature (°C)',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
        },
      }}
    />
  </div>
</div>


          {/* Humidity */}
          {/* Humidity */}
<div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
  <h3 className="text-lg font-semibold text-[#1E90FF] mb-4">Humidity (%)</h3>
  <div className="h-[300px]">
    <Line
      data={chartConfig('Humidity (%)', '#1E90FF', 'humidity')}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Humidity (%)',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
        },
      }}
    />
  </div>
</div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#00A19C] p-6 md:p-10">
      <ToastContainer />
      <header className="mb-4">
        <h1 className="text-2xl uppercase font-bold text-white">Dashboard</h1>
      </header>

      <section className="mb-6">
        <label htmlFor="boxSelect" className="text-lg text-white font-semibold mr-4">Select Box:</label>
        <select
          id="boxSelect"
          value={selectedBox}
          onChange={(e) => setSelectedBox(e.target.value)}
          className="border p-2 rounded-lg"
        >
          {Object.keys(groupedData).map((boxId) => (
            <option key={boxId} value={boxId}>{boxId}</option>
          ))}
        </select>
      </section>

      {selectedBox && groupedData[selectedBox] && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* H2/CO2 Box */}
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 border border-gray-200">
              <CloudIcon className="h-8 w-8 text-[#00968F]" />
              <div>
                <h4 className="text-sm font-medium text-gray-600">
                  {groupedData[selectedBox][0]?.h2 != null ? 'H₂ ppm (MQ-8)' : 'CO₂ (MG-811)'}
                </h4>
                <p className="text-xl font-semibold text-[#00968F]">
                  {groupedData[selectedBox][0]?.co2 ?? groupedData[selectedBox][0]?.h2 ?? 'N/A'}
                </p>
              </div>
            </div>

            {/* Gas/Air Quality Box */}
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 border border-gray-200">
              <CloudIcon   className="h-8 w-8 text-[#00B0A8]" />
              <div>
                <h4 className="text-sm font-medium text-gray-600">
                  {groupedData[selectedBox][0]?.gas != null ? 'Gas (H₂)' : 'CO₂ (MQ-135)'}
                </h4>
                <p className="text-xl font-semibold text-[#00B0A8]">
                  {groupedData[selectedBox][0]?.gas ?? groupedData[selectedBox][0]?.quality ?? 'N/A'}
                </p>
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 border border-gray-200">
              <FiThermometer   className="h-8 w-8 text-[#FF6347]" />
              <div>
                <h4 className="text-sm font-medium text-gray-600">Temperature (DHT-22)</h4>
                <p className="text-xl font-semibold text-[#FF6347]">
                  {groupedData[selectedBox][0]?.temperature ?? 'N/A'}°C
                </p>
              </div>
            </div>

            {/* Humidity */}
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 border border-gray-200">
              <FiDroplet   className="h-8 w-8 text-[#1E90FF]" />
              <div>
                <h4 className="text-sm font-medium text-gray-600">Humidity (DHT-22)</h4>
                <p className="text-xl font-semibold text-[#1E90FF]">
                  {groupedData[selectedBox][0]?.humidity ?? 'N/A'}%
                </p>
              </div>
            </div>
          </div>

          {renderChart(selectedBox, groupedData[selectedBox])}
        </>
      )}
    </div>
  );
}

export default Dashboard;