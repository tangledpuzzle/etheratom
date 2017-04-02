'use babel'
// methods.js are collection of various functions used to execute calls on web3

import Web3 from 'web3'
import { MessagePanelView, PlainMessageView, LineMessageView } from 'atom-message-panel'

export default class Web3Helpers {
	constructor(web3) {
		this.web3 = web3;
	}
	compileWe3(source, callback) {
		this.web3.eth.compile.solidity(source, (err, output) => {
			if(err) {
				console.log(err);
			} else {
				callback(null, output);
			}
		});
	}
	create(coinbase, password, abi, code, constructorParams, contractName, estimatedGas, callback) {
		return new Promise((resolve, reject) => {
			if(coinbase && password) {
				this.web3.eth.defaultAccount = coinbase;
				this.web3.personal.unlockAccount(this.web3.eth.defaultAccount, password, (error, success) => {
					if(error) {
						callback(error);
					} else {
						let contract;
						contarct = this.web3.eth.contract(abi);
						console.log(contarct);
						contarct.new(constructorParams.toString(), {
							from: this.web3.eth.defaultAccount,
							data: code,
							gas: estimatedGas
						}, (error, contractInst) => {
							if(error) {
								callback(error);
							} else {
								console.log(contractInst);
								/*if(contractInst.address) {
									var res = contractInst.greet();
									console.log(res);
								}*/
								callback(null, contractInst);
							}
						});
					}
				});
				/*this.web3.eth.contract(abi)["new"](constructorParams.toString(), {
					data: code,
					from: this.web3.eth.defaultAccount,
					gas: estimatedGas
				}, (error, contract) => {
					if(error) {
						callback(error);
					} else {
						console.log(contract);
						if(contract.address) {
							var res = contract.greet();
							console.log(res);
						}
						callback(null, contract);
					}
				});*/
			} else {
				callback('Error: No password provided.');
			}
		});
	}
	call(password, myContract, methodName, params, callback) {
		let result;
		if(params.length > 0) {
			this.web3.personal.unlockAccount(this.web3.eth.defaultAccount, password);
			result = myContract[methodName].apply(this, params);
			callback(null, result);
		} else {
			this.web3.personal.unlockAccount(this.web3.eth.defaultAccount, password);
			result = myContract[methodName]();
			callback(null, result);
		}
		//that.showOutput(that.myContract.address, result);
	}
	constructFunctions(contractABI, callback) {
		let contractFunction, k, len, results;
		results = [];
		for(k = 0, len = contractABI.length; k < len; k++) {
			contractFunction = contractABI[k];
			if(contractFunction.type = 'function' && contractFunction.name !== null && contractFunction.name !== void 0) {
				results.push(this.createChilds(contractFunction, (error, childInputs) => {
					if(!error) {
						callback(null, [contractFunction.name, childInputs]);
					} else {
						callback(null, [null, null]);
					}
				}));
			} else {
				results.push(void 0);
			}
		}
	}
	createChilds(contractFunction, callback) {
		let i, reactElements;
		reactElements = [];
		i = 0;
		if(contractFunction.inputs.length > 0) {
			while(i < contractFunction.inputs.length) {
				reactElements[i] = [contractFunction.inputs[i].type, contractFunction.inputs[i].name];
				i++;
			}
		}
		callback(null, reactElements);
	}
	argsToArray(reactElements, methodName, callback) {
		let args;
		args = new Array();
		this.asyncLoop(reactElements[methodName].childNodes.length, ((cycle) => {
			if(reactElements[methodName][cycle.iteration()].type !== 'submit') {
				args.push(reactElements[methodName][cycle.iteration()].value);
			}
			cycle.next();
		}), () => {
			callback(null, args);
		});
	}
	showPanelError(err_message) {
		let messages;
		messages = new MessagePanelView({
			title: 'Etheratom report'
		});
		messages.attach();
		messages.add(new PlainMessageView({
			message: err_message,
			className: 'red-message'
		}));
	}
	asyncLoop(iterations, func, callback) {
		let cycle, done, index;
		index = 0;
		done = false;
		cycle = {
			next: function() {
				if(done) {
					return;
				}
				if(index < iterations) {
					index++;
					return func(cycle);
				} else {
					done = true;
					return callback();
				}
			},
			iteration: function() {
				return index - 1;
			},
			break: function() {
				done = true;
				return callback();
			}
		};
		cycle.next();
		return cycle;
	}
}