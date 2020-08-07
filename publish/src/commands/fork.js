'use strict';

const { getUsers } = require('../../../index.js');
const ganache = require('ganache-core');

const forkChain = async ({ network, blockNumber }) => {
	// TODO: Remove or improve
	console.log(`Forking ${network}...`);

	// TODO: Validate incoming network?

	const protocolDaoAddress = getUsers({ network, user: 'owner' }).address;
	console.log(`Unlocking account ${protocolDaoAddress} (protocolDAO)`);

	const providerUrl = `https://${network}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
	const server = ganache.server({
		fork: providerUrl,
		gasLimit: 12e6,
		keepAliveTimeout: 0,
		unlocked_accounts: [protocolDaoAddress],
		logger: console,
		network_id: 1, // TODO: Dynamically set according to network?
	});

	// TODO: port as option.
	// TODO: what is "blockchain"?
	server.listen(8545, (error, chain) => {
		if (error) {
			console.error(error);
			process.exit(1);
		} else {
			console.log(`Successfully forked ${network} at block ${chain.blockchain.forkBlockNumber}`);
			console.log('Waiting for txs...');
		}
	});
};

module.exports = {
	forkChain,
	cmd: program =>
		program
			.command('fork')
			.description('Starts a local chain, forking the specified network.')
			.option(
				'-n, --network <value>',
				'Network name. E.g: mainnet, ropsten, rinkeby, etc.',
				'mainnet'
			)
			.option(
				'-b, --block-number <value>',
				'Block number to perform the fork on. Latest block is used if -1.',
				-1
			)
			.action(forkChain),
};