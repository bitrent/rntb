var PricingStrategy = artifacts.require("./TokensPricingStrategy.sol");

module.exports = function(deployer) {
    deployer.deploy(PricingStrategy);
};