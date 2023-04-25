const NftIdentities = artifacts.require('NftIdentities');
const NftSchool = artifacts.require('NftSchool');

module.exports = function (deployer) {
  const KNOWLEDGE_BLOCKS = {
    GENERAL: {
      id: 1,
      credits: 56,
    },
    FOUNDATION: {
      id: 2,
      credits: 38,
    },
    SPECIALIZED: {
      id: 3,
      credits: 34,
    },
    GRADUATION: {
      id: 4,
      credits: 10,
    },
  };

  const knowledgeBlocks = Object.values(KNOWLEDGE_BLOCKS).reduce(
    (prev, { id, credits }) => [
      [...prev[0], id],
      [...prev[1], credits],
    ],
    [[], []]
  );

  deployer.deploy(
    NftSchool,
    NftIdentities.address,
    ...knowledgeBlocks
  );
};
