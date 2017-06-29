const crypto = require('crypto');


const Fundraiser = artifacts.require("./Fundraiser.sol");

var generateValidTZAddr = function () {
  function sha256Sum(data) {
    const sha256 = crypto.createHash("sha256");
    sha256.update(data);
    return sha256.digest();
  }
  var bytes = crypto.randomBytes(20);
  var checksum = sha256Sum(sha256Sum(bytes)).slice(0, 4);
  return Buffer.concat([bytes, checksum]).toString('hex');
}


contract('Fundraiser', function (accounts) {
  it("should test Open and Deposit", function () {

    var contractInstance;
    return Fundraiser.deployed().then(function (instance) {
      contractInstance = instance;
      return instance.Open({
        from: accounts[0]
      })
      .then(function (txid) {
      })
      .then(function(){
        return contractInstance.Open({from:accounts[1]})
      })
      .then(function(txid) {
        var tzAddr = generateValidTZAddr()
        return contractInstance.Contribute(tzAddr,{from:accounts[2],amount:100})
      }).then(function(txid){
        assert.isOk(txid)
      })
      .catch(function (err) {
      });
    })
  });
  it("should throw on Open from the wrong account", function () {

    var contractInstance;
    return Fundraiser.deployed().then(function (instance) {
      contractInstance = instance;
      return instance.Open({
        from: accounts[3]
      })
      .then(function (txid) {
        assert.isNotOk(txid,"Should throw error")
      })
      .catch(function (err) {
        assert.isOk(err, "Fails to generat error")
      });
    })
  });
  it("should test throwing on invalid TZ Address", function () {

    var contractInstance;
    return Fundraiser.deployed().then(function (instance) {
      contractInstance = instance;
      return instance.Open({
        from: accounts[0]
      })
      .then(function (txid) {
      })
      .then(function(){
        return contractInstance.Open({from:accounts[1]})
      })
      .then(function(txid) {
        var tzAddr =crypto.randomBytes(24)
        return contractInstance.Contribute(tzAddr,{from:accounts[2],amount:100})
      })
      .then(function (txid) {
        assert.isNotOk(txid,"Should throw error")
      })
      .catch(function (err) {
        assert.isOk(err);
      });
    })
  });

})