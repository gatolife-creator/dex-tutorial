const Dai = artifacts.require("Dai");
const Link = artifacts.require("Link");
const Comp = artifacts.require("Comp");

const BN = require("bn.js");
const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-bn")(BN));

const truffleAssert = require("truffle-assertions");

contract("ERC20", (accounts) => {
  let dai, link, comp;

  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];

  before(async () => {
    dai = await Dai.deployed();
    link = await Link.deployed();
    comp = await Comp.deployed();
  });

  it("should return token names and symbols", async () => {
    expect(await dai.name()).to.equal("Dai");
    expect(await dai.symbol()).to.equal("DAI");
    expect(await link.name()).to.equal("Chainlink");
    expect(await link.symbol()).to.equal("LINK");
    expect(await comp.name()).to.equal("Compound");
    expect(await comp.symbol()).to.equal("COMP");
  });

  it("should return total supply", async () => {
    expect(await dai.totalSupply()).to.be.a.bignumber.that.equals(
      web3.utils.toWei(web3.utils.toBN(10 ** 10), "ether")
    );
    expect(await link.totalSupply()).to.be.a.bignumber.that.equals(
      web3.utils.toWei(web3.utils.toBN(10 ** 6), "ether")
    );
    expect(await comp.totalSupply()).to.be.a.bignumber.that.equals(
      web3.utils.toWei(web3.utils.toBN(10 ** 4), "ether")
    );
  });

  it("should revert when trying to transfer more than balance", async () => {
    const ownerBalance = await dai.balanceOf(owner);
    const transferAmount = ownerBalance.add(new BN(1));
    await truffleAssert.reverts(dai.transfer(alice, transferAmount));

    const ownerBalance2 = await link.balanceOf(owner);
    const transferAmount2 = ownerBalance2.add(new BN(1));
    await truffleAssert.reverts(link.transfer(alice, transferAmount2));

    const ownerBalance3 = await comp.balanceOf(owner);
    const transferAmount3 = ownerBalance3.add(new BN(1));
    await truffleAssert.reverts(comp.transfer(alice, transferAmount3));
  });
});
