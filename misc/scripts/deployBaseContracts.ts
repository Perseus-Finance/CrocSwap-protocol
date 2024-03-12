
import {ethers} from "hardhat";
import dotenv from "dotenv";
// import {CROC_ADDRS, CrocAddrs}"../../misc/constants/addrs";
dotenv.config();




  // deploy script for dex

    async function deploy() {
        const signer = await ethers.getSigner("0x0B5E36f5462B80b138e55Dce3a81F154876D8fe6");

        const dexFactory = await ethers.getContractFactory("CrocSwapDex");
        const dex = await dexFactory.connect(signer).deploy();
        await dex.deployed();

        console.log("CrocSwapDex deployed to:", dex.address);
        // deploy CrocSwapDeployer
        const factory = await ethers.getContractFactory("CrocDeployer");
        const deployer = await factory.connect(signer).deploy("0x0B5E36f5462B80b138e55Dce3a81F154876D8fe6");
        await deployer.deployed();

        console.log("CrocSwapDeployer deployed to:", deployer.address);

       

        // deploy CrocPolicy
        const policyFactory = await ethers.getContractFactory("CrocPolicy");
        const policy = await policyFactory.connect(signer).deploy(dex.address);
        await policy.deployed();

        console.log("CrocPolicy deployed to:", policy.address);

        // deploy ColdPath
        const coldPathFactory = await ethers.getContractFactory("ColdPath");
        const coldPath = await coldPathFactory.connect(signer).deploy();
        await coldPath.deployed();

        console.log("ColdPath deployed to:", coldPath.address);

        // deploy CrocSwapRouter
        const routerFactory = await ethers.getContractFactory("CrocSwapRouter");
        const router = await routerFactory.connect(signer).deploy(dex.address);
        await router.deployed();

        console.log("CrocSwapRouter deployed to:", router.address);

        // deploy CrocQuery
        const queryFactory = await ethers.getContractFactory("CrocQuery");
        const query = await queryFactory.connect(signer).deploy(dex.address);
        await query.deployed();

        console.log("CrocQuery deployed to:", query.address);

        // deploy CrocImpact

        const impactFactory = await ethers.getContractFactory("CrocImpact");
        const impact = await impactFactory.connect(signer).deploy(dex.address);
        await impact.deployed();

        console.log("CrocImpact deployed to:", impact.address);

        // deploy HotPath
        const hotPathFactory = await ethers.getContractFactory("HotPath");
        const hotPath = await hotPathFactory.connect(signer).deploy();
        await hotPath.deployed();

        console.log("HotPath deployed to:", hotPath.address);

        //deploy KnockoutPath
        const knockoutPathFactory = await ethers.getContractFactory("KnockoutLiqPath");
        const knockoutPath = await knockoutPathFactory.connect(signer).deploy();
        await knockoutPath.deployed();

        console.log("KnockoutPath deployed to:", knockoutPath.address);

        // deploy LongPath
        const longPathFactory = await ethers.getContractFactory("LongPath");
        const longPath = await longPathFactory.connect(signer).deploy();
        await longPath.deployed();

        console.log("LongPath deployed to:", longPath.address);

        // deploy MicroPaths

        const microPathsFactory = await ethers.getContractFactory("MicroPaths");
        const microPaths = await microPathsFactory.connect(signer).deploy();
        await microPaths.deployed();

        console.log("MicroPaths deployed to:", microPaths.address);

        // deploy WarmPath

        const warmPathFactory = await ethers.getContractFactory("WarmPath");
        const warmPath = await warmPathFactory.connect(signer).deploy();
        await warmPath.deployed();

        console.log("WarmPath deployed to:", warmPath.address);

        // deploy CrocEvents

        const eventsFactory = await ethers.getContractFactory("CrocEvents");
        const events = await eventsFactory.connect(signer).deploy();
        await events.deployed();

        console.log("CrocEvents deployed to:", events.address);

        // deploy CrocShell

        const shellFactory = await ethers.getContractFactory("CrocShell");
        const shell = await shellFactory.connect(signer).deploy();
        await shell.deployed();

        console.log("CrocShell deployed to:", shell.address);

        //deploy CrocSwapRouterBypass

        const routerBypassFactory = await ethers.getContractFactory("CrocSwapRouterBypass");
        const routerBypass = await routerBypassFactory.connect(signer).deploy("0xbfd7187B085353A451af2A93eB24792210E469F7");
        await routerBypass.deployed();

        console.log("CrocSwapRouterBypass deployed to:", routerBypass.address);

        // deploy KnockoutFlagPath

        const knockoutFlagPathFactory = await ethers.getContractFactory("KnockoutFlagPath");
        const knockoutFlagPath = await knockoutFlagPathFactory.connect(signer).deploy();
        await knockoutFlagPath.deployed();

        console.log("KnockoutFlagPath deployed to:", knockoutFlagPath.address);

        //deploy TimelockAccepts

        const timelockAcceptsTreFactory = await ethers.getContractFactory("TimelockAccepts");
        const timelockAcceptsTre = await timelockAcceptsTreFactory.connect(signer).deploy(60000000000,["0x969c8407D311728C4960FDF8cDF5D65c65fC41A7"],["0x969c8407D311728C4960FDF8cDF5D65c65fC41A7"]);
        await timelockAcceptsTre.deployed();

        console.log("TimelockAcceptsTre deployed to:", timelockAcceptsTre.address);

        const timelockAcceptsEmeFactory = await ethers.getContractFactory("TimelockAccepts");
        const timelockAcceptsEme = await timelockAcceptsEmeFactory.connect(signer).deploy(60000000000,["0x803291D2581C17de29FecA7C64b309e241988e2C"],["0x803291D2581C17de29FecA7C64b309e241988e2C"]);
        await timelockAcceptsEme.deployed();

        console.log("TimelockAcceptsEme deployed to:", timelockAcceptsEme.address);

        const timelockAcceptsOpsFactory = await ethers.getContractFactory("TimelockAccepts");
        const timelockAcceptsOps = await timelockAcceptsOpsFactory.connect(signer).deploy(60000000000,["0x3804853599Be366b297fB9125C99B3E218fE8233"],["0x3804853599Be366b297fB9125C99B3E218fE8233"]);
        await timelockAcceptsOps.deployed();

        console.log("TimelockAcceptsOps deployed to:", timelockAcceptsOps.address);



    }

deploy()

