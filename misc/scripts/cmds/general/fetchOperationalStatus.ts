import { task } from "hardhat/config";
import { initProvider, initChain } from "../../../libs/chain";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "ethers";

/**
 * @notice This script is used to fetch the operational status of the CrocSwapDex contract.
 *
 * @summary After performing either:
 *          - emergency halt
 *          - restoring operations
 *
 *          This script captures the state of the hot path and safe mode:
 *          - Fetches the event logs
 *          - Parses the events
 *          - Sorts the events by blocknumber
 *          - Prints to the console
 *
 * @requires process.env.CHAIN_ID to be exposed to the script
 * @requires process.env.INFURA_API_KEY to be exposed to the script
 * @requires process.env.WALLET_KEY to be exposed to the script
 *
 * @example usage: npx hardhat fetchOperationalStatus --from <startingBlock> --network <network>
 */

type FormattedEvent = {
  blockNumber: number;
  transactionHash: string;
  [key: string]: any;
};


task("fetchOperationalStatus", "Fetches the operational status of the CrocSwapDex contract.")
  .addParam(
    "from",
    "Starting Block"
  )
  .setAction(async (taskArgs, hre) => {
    await fetchAllEvents(taskArgs.from, hre);
  });



async function parseEvents(
  logs: any[],
  blockNumber: number,
  transactionHash: string,
) {
  const CrocEvents = require("../../../../artifacts/contracts/CrocEvents.sol/CrocEvents.json");

  const contractInterface = new ethers.utils.Interface(CrocEvents.abi);
  const decodedLogs: FormattedEvent[] = [];


  for (const log of logs) {
    try {
      const parsedLog = contractInterface.parseLog(log);
      if (parsedLog.name === "SafeMode" || parsedLog.name === "HotPathOpen") {
        const formattedEvent: FormattedEvent = {
          blockNumber,
          transactionHash,
          [parsedLog.name]: parsedLog.args,
        };
        decodedLogs.push(formattedEvent);
      }
    } catch (error) {
      console.error("Error parsing log:", error);
    }
  }

  return decodedLogs;
}

async function fetchAllEvents(fromBlock: number = 5000000, hre: HardhatRuntimeEnvironment) {
  const chainId = process.env.CHAIN_ID

  const { provider: readOnlyProvider } = initProvider(chainId);
  const { addrs } = initChain(chainId);


  const crocSwapDexAbi = (
    await hre.ethers.getContractFactory("CrocSwapDex")
  ).interface.format(hre.ethers.utils.FormatTypes.full);
  const contract = new ethers.Contract(
    addrs.dex,
    crocSwapDexAbi,
    readOnlyProvider
  );


  console.log();
  console.log(`Fetching events from ${fromBlock} to latest`);
  console.log();


  const logs = await contract.queryFilter("*", Number(fromBlock), "latest");
  const processedEvents: FormattedEvent[] = [];

  for (const log of logs) {
    const events = await parseEvents(
      [log],
      log.blockNumber,
      log.transactionHash,
    );
    processedEvents.push(...events);
  }

  /** 
   * @notice Removes duplicates.
   * @dev Found that the same transactionHash can be emitted multiple times.
   */
  processedEvents.forEach((event, index) => {
    processedEvents.forEach((event2, index2) => {
      if (
        index !== index2 &&
        event.blockNumber === event2.blockNumber &&
        event.transactionHash === event2.transactionHash &&
        event.SafeMode &&
        event2.SafeMode
      ) {
        processedEvents.splice(index2, 1);
      }
    });
  });

  console.log(processedEvents.sort((a, b) => b.blockNumber - a.blockNumber));
}


