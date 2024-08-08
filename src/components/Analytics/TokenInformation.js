'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaCoins, FaExchangeAlt, FaFire, FaList } from 'react-icons/fa';
import { FaRepeat } from 'react-icons/fa6';
import { IoMdDocument } from 'react-icons/io';
import { TbDecimal } from 'react-icons/tb';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

function TokenInformation() {
  const glitchVariants = {
    visible: {
      textShadow: [
        '1px 1px 0px lime',
        '-1px -1px 0px purple',
        '1px -1px 0px lime',
        '-1px 1px 0px lime',
        '2px 2px 2px lime',
      ],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: 'mirror',
      },
    },
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const data = [
    { name: 'Burnt Supply', value: 2 },
    { name: 'Circulating Supply', value: 10 }, // example values, replace with actual data
  ];

  const COLORS = ['#FF8042', '#0088FE'];

  return (
    <div className="px-8 pt-8 md:px-10 max-w-screen-2xl mx-auto text-grey">
      <motion.h1 className="text-3xl text-grey">
        <motion.span
          variants={glitchVariants}
          initial="hidden"
          whileInView={{ opacity: 1, x: 0 }}
          animate={'visible'}
        >
          Token
        </motion.span>{' '}
        Information
      </motion.h1>
      <div className="flex flex-col md:flex-row mt-10 gap-20">
        <div className="border border-muted rounded-xl p-5 w-full ">
          <div className="flex justify-between">
            <p className="text-lg mb-3 flex items-center gap-2">
              <span>
                <IoMdDocument className="text-lime" />
              </span>
              Contact Address
            </p>
            <p className="text-lg text-grey">0xDb904...772Ad9797</p>
          </div>
          <div className="flex justify-between">
            <p className="text-lg mb-3 flex items-center gap-2">
              <span>
                <TbDecimal className="text-lime" />
              </span>
              Decimal
            </p>
            <p className="text-lg text-grey">18</p>
          </div>
          <div className="flex justify-between">
            <p className="text-lg mb-3 flex items-center gap-2">
              <span>
                <FaCoins className="text-lime" />
              </span>
              Token Symbol
            </p>
            <p className="text-lg text-grey">XEON</p>
          </div>
          <div className="flex justify-between">
            <p className="text-lg mb-3 flex items-center gap-2">
              <span>
                <FaExchangeAlt className="text-lime" />
              </span>
              Swap Tax
            </p>
            <p className="text-lg text-grey">10%</p>
          </div>
        </div>
        <div className="border border-muted rounded-xl p-5 w-full ">
          <div className="flex justify-between">
            <p className="text-lg mb-3 flex items-center gap-2">
              <span>
                <IoMdDocument className="text-lime" />
              </span>
              Token Price(USD)
            </p>
            <p className="text-lg text-grey">0.0000014</p>
          </div>
          <div className="flex justify-between">
            <p className="text-lg mb-3 flex items-center gap-2">
              <span>
                <FaList className="text-lime" />
              </span>
              Total Supply
            </p>
            <p className="text-lg text-grey">$100000000.00</p>
          </div>
          <div className="flex justify-between">
            <p className="text-lg mb-3 flex items-center gap-2">
              <span>
                <FaFire className="text-lime" />
              </span>
              Burnt Supply
            </p>
            <p className="text-lg text-grey">$0.00</p>
          </div>
          <div className="flex justify-between">
            <p className="text-lg mb-3 flex items-center gap-2">
              <span>
                <FaRepeat className="text-lime" />
              </span>
              Circulating Supply
            </p>
            <p className="text-lg text-grey">10%</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row mt-10 gap-20">
        <div className="w-full h-96">
          {isClient && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="w-full">
          <h4 className="text-lg mb-2">* This Token is Deflationary!</h4>
          <p>XEON is the native token of our Ecosystem.</p>
          <p>
            Fundamental for tokenizing income rights whilst stimulating protocol
            revenue.
          </p>
          <p>
            Token utility within the protocol includes: <br />
            Stake to gain hedge mining rights, <br />
            Stake to provide native lending collateral, <br />
            Stake to provide native hedge liquidity, <br />
            Stake to claim portion of revenue share.
          </p>
          <p>
            Read more on{' '}
            <a
              href="#jump-to-section"
              className="walletStateLink text-blue-500"
            >
              <text textAnchor="middle" style={{ color: '#188dd6' }}>
                token-utility...{' '}
                <i className="fa fa-link" aria-hidden="true"></i>
              </text>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TokenInformation;
