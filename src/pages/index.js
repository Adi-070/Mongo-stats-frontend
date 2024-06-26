import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie, Bubble, Radar } from 'react-chartjs-2';

import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Updated for Heroicons v2

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

const Home = () => {
  const [data, setData] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('https://mongo-stats-backend.vercel.app/data');
      setData(result.data);
    };
    fetchData();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const lineChartData = {
    labels: data.map(item => new Date(item.published).toLocaleDateString()), // Assuming 'published' is a date field
    datasets: [
      {
        label: 'Intensity Over Time',
        data: data.map(item => item.intensity),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: data.map(item => item.sector),
    datasets: [
      {
        label: 'Relevance by Sector',
        data: data.map(item => item.relevance),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: [...new Set(data.map(item => item.sector))],
    datasets: [
      {
        data: Object.values(data.reduce((acc, item) => {
          acc[item.sector] = (acc[item.sector] || 0) + 1;
          return acc;
        }, {})),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const bubbleChartData = {
    datasets: data.map(item => ({
      label: item.title,
      data: [{ x: item.likelihood, y: item.intensity, r: item.relevance * 2 }],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
    })),
  };

  const radarChartData = {
    labels: data.map(item => item.sector),
    datasets: [
      {
        label: 'Impact by Sector',
        data: data.map(item => item.impact),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const horizontalBarChartData = {
    labels: data.map(item => item.topic),
    datasets: [
      {
        label: 'Intensity by Topic',
        data: data.map(item => item.intensity),
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        indexAxis: 'y',
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">MongoDB Dashboard</h1>
        <button onClick={toggleMenu} className="md:hidden">
          {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      <div className={`${menuOpen ? 'block' : 'hidden'} md:flex md:flex-row mb-8`}>
        <nav className="flex flex-col md:flex-row md:space-x-24">
          <a href="#lineChart" className="py-2 px-4 hover:bg-gray-200">Intensity Over Time</a>
          <a href="#barChart" className="py-2 px-4 hover:bg-gray-200">Relevance by Sector</a>
          <a href="#pieChart" className="py-2 px-4 hover:bg-gray-200">Sector Distribution</a>
          <a href="#bubbleChart" className="py-2 px-4 hover:bg-gray-200">Title</a>
          <a href="#radarChart" className="py-2 px-4 hover:bg-gray-200">Impact by Sector</a>
          <a href="#horizontalBarChart" className="py-2 px-4 hover:bg-gray-200">Intensity by Topic</a>
        </nav>
      </div>

      <div id="lineChart" className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Intensity Over Time</h2>
        <Line data={lineChartData} />
      </div>
      <div id="barChart" className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Relevance by Sector</h2>
        <Bar data={barChartData} />
      </div>
      <div id="pieChart" className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Sector Distribution</h2>
        <Pie data={pieChartData} />
      </div>
      <div id="bubbleChart" className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Title</h2>
        <Bubble data={bubbleChartData} />
      </div>
      <div id="radarChart" className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Impact by Sector</h2>
        <Radar data={radarChartData} />
      </div>
      <div id="horizontalBarChart" className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Intensity by Topic</h2>
        <Bar data={horizontalBarChartData} />
      </div>
    </div>
  );
};

export default Home;
