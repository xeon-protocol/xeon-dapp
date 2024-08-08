import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { baseSepolia } from 'viem/chains';
import { transport } from './smartAccount.js';

export const cloudPaymaster = createPimlicoPaymasterClient({
  chain: baseSepolia,
  transport,
  entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
});
