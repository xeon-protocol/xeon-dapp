'use client';
import { Box, Image } from '@chakra-ui/react';

import { FaHourglassHalf } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ProgressBar from './ProgressBar';

function CenterNav({ setShowPositions, setShowDiscover, setShowBookmarks }) {
  const data = [
    {
      name: 'Point 1',
      StartPrice: 0.00000000027,
      CurrentPrice: 0.00000000027,
      TargetPrice: 0.00000000027,
    },
    {
      name: 'Point 2',
      StartPrice: 0.000000000275,
      CurrentPrice: 0.00000000027,
      TargetPrice: 0.00000000027,
    },
    {
      name: 'Point 3',
      StartPrice: 0.00000000029,
      CurrentPrice: 0.0000000003,
      TargetPrice: 0.00000000028,
    },
    {
      name: 'Point 4',
      StartPrice: 0.0000000003,
      CurrentPrice: 0.00000000031,
      TargetPrice: 0.00000000033,
    },
  ];
  const formatNumber = (number) => {
    const formattedNumber = number.toLocaleString('fullwide', {
      useGrouping: false,
      minimumFractionDigits: 11,
    });
    return formattedNumber;
  };

  const yAxisTicks = [];
  for (let i = 0.00000000027; i <= 0.00000000033; i += 0.00000000001) {
    yAxisTicks.push(parseFloat(i.toFixed(11)));
  }

  return (
    <Box position="relative">
      <div className=" absolute top-0 left-0 right-0 px-2 lg:px-2 2xl:px-6">
        <div className="flex justify-between  ">
          <p className="text-sm md:text-xl text-grey">{`{ >GAIN SECTION }`}</p>
          <Image src="/icon.png" alt="container" my={10} />
        </div>
        <div className="flex justify-between mt-0 text-grey ">
          <p>Time to expiry...</p>
          <p className="flex items-center">
            {`{ 3962 hrs`}
            <span className="ml-1">
              <FaHourglassHalf />
            </span>
            {`}`}
          </p>
        </div>
        <div className="mt-5">
          <ProgressBar progress={15} />
        </div>
        <div className="flex gap-4 items-center ">
          <button
            _hover={{ scale: 1.1 }}
            className="text-white bg-floral flex items-center justify-center gap-2 p-2 mt-5 w-full rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
            p={8}
            variant="solid"
          >
            <MdRefresh color="white" /> Refresh
          </button>
          <div className="flex h-12 w-12 rounded-full border-[1px] border-[#6c6c6c] justify-center items-center mt-5">
            <p className="text-light-purple">35</p>
          </div>
        </div>
        <ResponsiveContainer className={'mt-5'} width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={formatNumber}
              ticks={yAxisTicks}
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip formatter={(value) => formatNumber(value)} />
            <Legend />
            <Line type="monotone" dataKey="StartPrice" stroke="#8884d8" />
            <Line type="monotone" dataKey="CurrentPrice" stroke="#82ca9d" />
            <Line
              type="monotone"
              dataKey="TargetPrice"
              stroke="#ff7300"
              dot={false}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Image
        mb={10}
        w={'100%'}
        height={'700px'}
        src="/dashboard-center.webp"
        alt="logo"
      />
    </Box>
  );
}

export default CenterNav;
