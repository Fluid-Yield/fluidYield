import { bscTestnet, bsc } from "viem/chains";

export const fyChain = bscTestnet;
export const fyChainId = fyChain.id;
export const fyRpcUrl = bscTestnet.rpcUrls.default.http[0];
export const bscRpcUrl = bsc.rpcUrls.default.http[0];
