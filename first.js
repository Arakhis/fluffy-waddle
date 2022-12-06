
const btcjs = require('bitcoinjs-lib');
const bip39 = require('bip39');
const bip32 = require('bip32');
const bip32u = require('bip32-utils');
const dhttp = require('dhttp');

let COIN = 'BTC';

function login(mnemo) {
	const hdKey = prepareHdKey(mnemo);
	
	const account = prepareAccount(hdKey);
	let baseInfo = getBaseInfo(hdKey);
	
	//code
}

function prepareHdKey(mnemo) {
	const seed = bip39.mnemonicToSeed(mnemo);
	const hdKey = bip32.fromSeed(seed);	
	return hdKey;
	//code
}

function prepareAccount(hdKey) {
	let segwitHdKey = hdKey.deriveHardened(84);
	let witnessV0HdKey = hdKey.deriveHardened(86);
	let witnessV1HdKey = hdKey.deriveHardened(88);
	let segwit = segwitHdKey.derive(0);
	let witnessV0 = witnessV0HdKey.derive(0);
	let witnessV1 = witnessV1HdKey.derive(0);
	let account = new bip32u.Account([
		new bip32u.Chain(segwit.neutered()),
		new bip32u.Chain(witnessV0.neutered()),
		new bip32u.Chain(witnessV1.neutered()),		
	]);
	return account;
}

function getBaseInfo(hdKey) {
	let xpub = hdKey.neutered().toBase58();
	let results = dhttp({
		method: 'GET',
		url: 'https://blockchain.info/multiaddr?active=' + xpub,
	});
	return results;
	//code
}

function calcBalance(baseInfo) {
	if (baseInfo.wallet.n_tx == 0) {
		let balance = 0;
		return balance;
	} else {
		let recieved = baseInfo.wallet.total_recieved;
		let sent = baseInfo.wallet.total_sent;
		let balance = (+recieved - +sent) / 1e-10;
		return balance;
	}
}

function lastFiveTxs(baseInfo) {
	let num_txs = +baseInfo.wallet.n_tx;
	let lastTxs = [];
	if (num_txs < 5) {
		let i = 0;
		while (i < num_txs) {
			lastTxs[i] = baseInfo.txs[i];
		}
		for (const tx in baseInfo.txs){
			
	} else if (num_txs > 5) {
		
	}
	for (const tx in baseInfo.txs){
		lastTxs[tx] = {
			time: tx.time,
			amount: tx.result / 1e-10,
			id: tx.tx_id,
			size: tx.size,
			fee: tx.fee / self.size,
			};

	}
	return lastTxs;

}

function changeTopAddresses(account) {
	let topAddresses = {
		segwit: account.nextChainAddress(0),
		witnessV0: account.nextChainAddress(1),
		witnessV1: account.nextChainAddress(2),
	};
	return topAddresses;
	//code
}

