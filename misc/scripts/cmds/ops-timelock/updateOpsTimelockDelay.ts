import { BigNumber, BigNumberish, ethers } from "ethers";
import { TimelockAccepts } from "../../../../typechain";
import { initChain, refContract } from "../../../libs/chain";
import { populateTimelockCalls } from "../../../libs/governance";
import { fetchTimelockDelay } from "../../../libs/timelockDelay";
import { task } from "hardhat/config";

/**
 * @notice This script is used to update the delay in the Ops Timelock contract.
 *
 * @requires multisigOps to be the tx origin
 * 
 * @requires process.env.CHAIN_ID to be exposed to the script
 * @requires process.env.INFURA_API_KEY to be exposed to the script
 * @requires process.env.WALLET_KEY to be exposed to the script
 *
 * @example usage: npx hardhat updateOpsTimelockDelay --delay <newDelayInSeconds> --network <network>
 */

task("updateOpsTimelockDelay", "Update the delay in the Ops Timelock contract.")
  .addOptionalParam("delay", "New delay in seconds")
  .setAction(async (taskArgs) => {
    const newDelay = ethers.BigNumber.from(taskArgs.delay);
    await updateDelay(newDelay);
  });

const updateDelay = async (newDelay: BigNumber): Promise<void> => {
  const { addrs, wallet: authority } = initChain();

  const multisigAddr = addrs.govern.multisigOps;
  const timelockAddr = addrs.govern.timelockOps;

  const tag = `${newDelay.toNumber()} seconds`;

  /**
   * @notice Prepare contract instance
   */
  const timelock = (await refContract(
    "TimelockAccepts",
    timelockAddr,
    authority
  )) as TimelockAccepts;

  /**
   * @notice Fetch the current time-lock min delay
   *
   * @dev If this returns 0, then the calls can be batched
   */
  const currentDelay = await fetchTimelockDelay(timelockAddr, authority);
  console.log(`Current ops timelock delay: ${currentDelay}`);

  /**
   * @notice Generate the calldata for the updateDelay method
   */
  const delayCall = await timelock.populateTransaction.updateDelay(newDelay);
  console.log(`Calldata for updating delay: ${delayCall}`);

  /**
   * @notice Validate the new delay cannot exceed 7 days
   */
  if (newDelay.toNumber() > 7 * 3600 * 24) {
    throw new Error("Timelock delay exceeds seven days");
  }

  /**
   * @notice Prepare the resolution Instructions
   *
   * @dev We are not calling the `treasuryResolution` function because it will prepare and forward calls to a chosen proxy. We are calling `populateTimelockCalls` to generate the calldata that will be called directly on the `CrocPolicy` contract
   */
  const timelockCalls = await populateTimelockCalls(
    timelock,
    timelockAddr,
    delayCall.data as string,
    currentDelay
  );

  console.log("----");
  console.log("Presenting instructions for setting ops timelock delay");
  console.log();
  console.log(
    `Description: Change will the update the ops timelock from ${currentDelay} to ${tag}`
  );
  console.log(`Execution instructions for updating timelock delay`);
  console.log();
  console.log(`Step 1: Use the Gnosis Safe at ${multisigAddr}`);
  console.log(`Transaction to timelock contract at ${timelockAddr}`);
  console.log(`(Message value: 0)`);
  console.log(`With the following calldata: `);
  console.log(timelockCalls.scheduleCalldata);
  console.log();
  console.log(`Step 2: Wait at least ${timelockCalls.delay}`);
  console.log(`Use same Gnosis Safe at ${multisigAddr}`);
  console.log(
    `Transaction to timelock contract at ${timelockCalls.timelockAddr}`
  );
  console.log(`(Message value: 0)`);
  console.log(`With the following calldata: `);
  console.log(timelockCalls.execCalldata);
  console.log("-----");
};
