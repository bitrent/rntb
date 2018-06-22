var TokenManager = artifacts.require("./RNTBTokenManager.sol");
var RNTBToken = artifacts.require("./RNTBToken.sol");
var RNTMultiSigWallet = artifacts.require("./RNTMultiSigWallet.sol");

module.exports = function(deployer) {
    deployer.deploy(TokenManager, RNTMultiSigWallet.address, RNTBToken.address);
};