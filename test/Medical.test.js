const Medical = artifacts.require('./Medical.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Medical', ([deployer, seller, buyer]) => {
  let medical

  before(async () => {
    medical = await Medical.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await medical.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await medical.pat_name()
      assert.equal(name, 'Secured Medical System')
    })
  })

  describe('patient', async () => {
    let result, patCount

    before(async () => {
      result = await medical.addMedicine('Shail Shah','xyz', web3.utils.toWei('1', 'Ether'), { from: seller })
      patCount = await medical.patCount()
    })

    it('creates patient', async () => {
      // SUCCESS
      assert.equal(patCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), patCount.toNumber(), 'id is correct')
      assert.equal(event.pat_name, 'Shail Shah', 'pat_name is correct')
      assert.equal(event.medi_name, 'xyz', 'medi_name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.purchased, false, 'purchased is correct')

      // FAILURE: Product must have a name
      await await medical.addMedicine('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
      // FAILURE: Product must have a price
      await await medical.addMedicine('Shail Shah','xyz', 0, { from: seller }).should.be.rejected;
    })

     it('sells medicine', async () => {
  // Track the seller balance before purchase
  let oldSellerBalance
  oldSellerBalance = await web3.eth.getBalance(seller)
  oldSellerBalance = new web3.utils.BN(oldSellerBalance)

  // SUCCESS: Buyer makes purchase
  result = await medical.purchaseMedicine(patCount, { from: buyer, value: web3.utils.toWei('1', 'Ether')})

  // Check logs
  const event = result.logs[0].args
  assert.equal(event.id.toNumber(), patCount.toNumber(), 'id is correct')
  assert.equal(event.pat_name, 'Shail Shah','pat_name is correct')
  assert.equal(event.medi_name, 'xyz', 'medi_name is correct')
  assert.equal(event.price, '1000000000000000000', 'price is correct')
  assert.equal(event.owner, buyer, 'owner is correct')
  assert.equal(event.purchased, true, 'purchased is correct')

  // Check that seller received funds
  let newSellerBalance
  newSellerBalance = await web3.eth.getBalance(seller)
  newSellerBalance = new web3.utils.BN(newSellerBalance)

  let price
  price = web3.utils.toWei('1', 'Ether')
  price = new web3.utils.BN(price)

  const exepectedBalance = oldSellerBalance.add(price)

  assert.equal(newSellerBalance.toString(), exepectedBalance.toString())

  // FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
  await medical.purchaseMedicine(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;      // FAILURE: Buyer tries to buy without enough ether
  // FAILURE: Buyer tries to buy without enough ether
  await medical.purchaseMedicine(patCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
  // FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
  await medical.purchaseMedicine(patCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
  // FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
  await medical.purchaseMedicine(patCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
})
  })
  })
