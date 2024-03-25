/* 
   The following script is responsible for validating the deployment of the Croc contracts by comparing the deployed byte coode to the onchain byte code.
*/

import { initProvider, validateDeploy } from "../libs/chain";

const deploymnetChainId = "0xaa36a7";
let { addrs, provider: provider } = initProvider(deploymnetChainId);

async function validate() {
  console.log(
    "------------------------------------------------------------------"
  );

  console.log("Validating Core Contracts...");

  let pending = [
    validateDeploy(addrs.cold, "ColdPath", provider),
    validateDeploy(addrs.hot, "HotProxy", provider),
    validateDeploy(addrs.long, "LongPath", provider),
    validateDeploy(addrs.micro, "MicroPaths", provider),
    validateDeploy(addrs.warm, "WarmPath", provider),
    validateDeploy(addrs.knockout, "KnockoutLiqPath", provider),
    validateDeploy(addrs.koCross, "KnockoutFlagPath", provider),
    validateDeploy(addrs.dex, "CrocSwapDex", provider),
    validateDeploy(addrs.policy, "CrocPolicy", provider, addrs.dex),
  ];

  await Promise.all(pending);
  console.log();

  console.log("Validating Peripheral Contracts...");

  pending = [
    validateDeploy(addrs.impact, "CrocImpact", provider, addrs.dex),
    validateDeploy(addrs.query, "CrocQuery", provider, addrs.dex),
  ];

  await Promise.all(pending);
  console.log();
}

validate();
