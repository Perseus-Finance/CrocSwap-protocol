
import {ethers} from "hardhat";
import dotenv from "dotenv";
// import {CROC_ADDRS, CrocAddrs}"../../misc/constants/addrs";
dotenv.config();




  // deploy script for dex

    async function deploy() {
        const signer = await ethers.getSigner("0x0B5E36f5462B80b138e55Dce3a81F154876D8fe6");

       

        // //deploy TimelockAccepts

        // const timelockAcceptsTreFactory = await ethers.getContractFactory("TimelockAccepts");
        // const timelockAcceptsTre = await timelockAcceptsTreFactory.connect(signer).deploy(1,["0x969c8407D311728C4960FDF8cDF5D65c65fC41A7"],["0x969c8407D311728C4960FDF8cDF5D65c65fC41A7"]);
        // await timelockAcceptsTre.deployed();

        // console.log("TimelockAcceptsTre deployed to:", timelockAcceptsTre.address);

        // const timelockAcceptsEmeFactory = await ethers.getContractFactory("TimelockAccepts");
        // const timelockAcceptsEme = await timelockAcceptsEmeFactory.connect(signer).deploy(1,["0x803291D2581C17de29FecA7C64b309e241988e2C"],["0x803291D2581C17de29FecA7C64b309e241988e2C"]);
        // await timelockAcceptsEme.deployed();

        // console.log("TimelockAcceptsEme deployed to:", timelockAcceptsEme.address);

        // const timelockAcceptsOpsFactory = await ethers.getContractFactory("TimelockAccepts");
        // const timelockAcceptsOps = await timelockAcceptsOpsFactory.connect(signer).deploy(1,["0x3804853599Be366b297fB9125C99B3E218fE8233"],["0x3804853599Be366b297fB9125C99B3E218fE8233"]);
        // await timelockAcceptsOps.deployed();

        // console.log("TimelockAcceptsOps deployed to:", timelockAcceptsOps.address);

        //deploy croc swap router
        const crocSwapRouterFactory = await ethers.getContractFactory("CrocSwapRouter");
        const crocSwapRouter = await crocSwapRouterFactory.connect(signer).deploy("0x561f094621faC97faAf474873011632F49aa2Bfb");
        await crocSwapRouter.deployed();

        console.log("CrocSwapRouter deployed to:", crocSwapRouter.address);

        //deploy croc swap router bypass
        const crocSwapRouterBypassFactory = await ethers.getContractFactory("CrocSwapRouterBypass");
        const crocSwapRouterBypass = await crocSwapRouterBypassFactory.connect(signer).deploy("0x561f094621faC97faAf474873011632F49aa2Bfb");
        await crocSwapRouterBypass.deployed();

        console.log("CrocSwapRouterBypass deployed to:", crocSwapRouterBypass.address);




    }

deploy()

