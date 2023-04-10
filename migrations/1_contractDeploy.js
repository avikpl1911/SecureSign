const Identity = artifacts.require("IdentityManagement");

module.exports = async function (deployer) {
  await deployer.deploy(Identity);
};
