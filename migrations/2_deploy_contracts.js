const voting = artifacts.require('./voting.sol')
const voting_manage = artifacts.require('./voting_manage.sol')
const fs = require('fs')

module.exports = function (deployer) {
  deployer.deploy(voting,0,1000)
    .then(() => {
      if (voting._json) {
        fs.writeFile(
          'deployedABI',
          JSON.stringify(voting._json.abi),
          (err) => {
            if (err) throw err
            console.log("파일에 ABI 입력 성공");
          })
      }
      fs.writeFile(
        'deployedAddress',
        voting.address,
        (err) => {
          if (err) throw err
          console.log("파일에 주소 입력 성공");
        })
    })
    deployer.deploy(voting_manage)
    .then(() => {
      if (voting_manage._json) {
        fs.writeFile(
          'deployedABI_manage',
          JSON.stringify(voting_manage._json.abi),
          (err) => {
            if (err) throw err
            console.log("파일에 ABI 입력 성공");
          })
      }

      fs.writeFile(
        'deployedAddress_manage',
        voting_manage.address,
        (err) => {
          if (err) throw err
          console.log("파일에 주소 입력 성공");
        })
    })
}