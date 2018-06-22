const EVMRevert = require('./helpers/EVMRevert');
const uuidParser = require('./helpers/uuidParser.js');
const BigNumber = web3.BigNumber;

const expect = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .expect;

const Manager = artifacts.require("RNTBTokenManager");
const PricingStrategy = artifacts.require("TokensPricingStrategy");
const Token = artifacts.require("RNTBToken");

function hex2a(hexx) { 
    var hex = hexx.toString(); //force conversion
    var str = '';
    for (var i = 2; i < hex.length; i += 2) {
        let hexValue = hex.substr(i, 2);
        if (hexValue != "00" && hexValue != "0x") {
            str += String.fromCharCode(parseInt(hexValue, 16));
        }
    }
    return str;
}

contract('RNTBTokenManager', async (accounts) => {
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const wallet = accounts[9];
    const uuid1 = uuidParser.parse("76061c06-8e01-41ac-bac1-547a41d9c1f3");
    const uuid2 = uuidParser.parse("76061c06-8e01-41ac-bac1-547a41d9c1f4");
    
    
    beforeEach(async function deployContracts() {
        this.currentTest.token = await Token.new();
        this.currentTest.pricing = await PricingStrategy.new();
        this.currentTest.manager = await Manager.new(wallet, this.currentTest.token.address);
    });

    it("TOKEN_MANAGER_1 - register() - Check users can connect their address to uuids", async function () {
        await this.test.pricing.setTokenPriceInWei(new BigNumber("100"));
        await this.test.manager.setPricingStrategy(this.test.pricing.address);
        await this.test.token.approve(this.test.manager.address, new BigNumber("10000000e18"));

        await this.test.manager.register(uuid1, {from: user1});
        const userUuid = await this.test.manager.users.call(user1);
        await expect(userUuid.valueOf()).to.be.equal(uuid1);
    });


    it("TOKEN_MANAGER_2 - buyTokens() - Check users can buy tokens", async function () {
        await this.test.pricing.setTokenPriceInWei(new BigNumber("100"));
        await this.test.manager.setPricingStrategy(this.test.pricing.address);
        await this.test.token.approve(this.test.manager.address, new BigNumber("10000000e18"));

        await this.test.manager.buyTokens({from: user1, value: 100});
        const userBalance = await this.test.token.balanceOf.call(user1);
        await expect(userBalance.valueOf()).to.be.equal(new BigNumber("1e18").valueOf());
    });

    it("TOKEN_MANAGER_3 - setPricingStrategy() - Check that owner can set pricing startegy", async function () {
        await this.test.manager.setPricingStrategy(this.test.pricing.address);
    });

    it("TOKEN_MANAGER_4 - setPricingStrategy() - Check that only owner can set pricing startegy", async function () {
        await expect(this.test.manager.setPricingStrategy(this.test.pricing.address, {from: user1})).to.eventually.be.rejectedWith(EVMRevert);
    });

    it("TOKEN_MANAGER_5 - setPricingStrategy() - Check that owner can reset pricing strategy", async function () {
        await this.test.manager.setPricingStrategy(this.test.pricing.address);
        await this.test.manager.setPricingStrategy(this.test.pricing.address);
    });
});
