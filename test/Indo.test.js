const chai = require('chai');

const BN = web3.utils.BN;
const chaiBN = require('chai-bn')(BN);
chai.use(chaiBN);

const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const { expect } = chai;

const Indo = artifacts.require('Indo');

contract('Indo', (addresses) => {
  const [deployerAddress, ownerAddress, randomAddress] = addresses;
  let instance;

  before(async () => {
    instance = await Indo.deployed();
    await instance.transferOwnership(ownerAddress, { from: deployerAddress });
  })

  describe('constructor', () => {
    it('should have correct name', async () => {
      const name = await instance.name({ from: randomAddress });
      expect(name).to.be.equal('Indo Coffee Snoop Dogg');
    })

    it('should have correct symbol', async () => {
      const symbol = await instance.symbol({ from: randomAddress });
      expect(symbol).to.be.equal('INDO');
    })

    it('should have correct balance to claim', async () => {
      const maxSupply = web3.utils.toWei('4000000000')
      const balance = await instance.balanceOf(instance.address, { from: randomAddress });
      expect(balance).to.be.bignumber.equal(maxSupply);
    })

    it('should not paused', async () => {
      const paused = await instance.paused({ from: randomAddress });
      expect(paused).to.be.equal(false);
    })
  })

  describe('claimTokens', () => {
    it('should not allow random address to claim', async () => {
      const fn = instance.claimTokens({ from: randomAddress });
      return expect(fn).to.be.rejectedWith('Ownable: caller is not the owner');
    })

    it('should allow owner to claim initial tokens', async () => {
      const maxSupply = web3.utils.toWei('4000000000')
      const balanceBef = await instance.balanceOf(ownerAddress, { from: randomAddress });
      expect(balanceBef).to.be.bignumber.equal(new BN('0'));

      await instance.claimTokens({ from: ownerAddress });
      const balanceAft = await instance.balanceOf(ownerAddress, { from: randomAddress });
      expect(balanceAft).to.be.bignumber.equal(maxSupply);
    })
  })

  describe('pause', () => {
    it('should not allow random address to pause', async () => {
      const fn = instance.pause({ from: randomAddress });
      return expect(fn).to.be.rejectedWith('Ownable: caller is not the owner');
    })

    it('should allow owner to pause', async () => {
      const amount = web3.utils.toWei('1');
      await instance.pause({ from: ownerAddress });
      const fn = instance.transfer(randomAddress, amount, { from: ownerAddress });
      return expect(fn).to.be.rejectedWith('ERC20Pausable: token transfer while paused');
    })
  })

  describe('unpause', () => {
    it('should not allow random address to unpause', async () => {
      const fn = instance.unpause({ from: randomAddress });
      return expect(fn).to.be.rejectedWith('Ownable: caller is not the owner');
    })

    it('should allow owner to unpause', async () => {
      const amount = web3.utils.toWei('1');
      await instance.unpause({ from: ownerAddress });
      const fn = instance.transfer(randomAddress, amount, { from: ownerAddress });
      return expect(fn).to.be.fulfilled;
    })
  })
})