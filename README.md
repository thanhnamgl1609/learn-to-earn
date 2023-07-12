# learn-to-earn

## Deployment Note

### Deploy contract

Command: `truffle deploy`

Contracts will be deployed in order below:

   1. Nft Identities
   2. School
   3. Nft Class Registration
   4. Nft Complete Courses
   5. Nft Graduation

To know exactly how contracts are deployed, please check the sorted files in folder **migrations**

Note:

- 1_deploy_identities: includes the `school_account` which receives ETH when student register class.
- 2_deploy_school: includes the initialized `knowledge_blocks`, should change if needed.
- 3_deploy_nft_registration: includes the `school_account` which receives ETH when student register class.

### Deploy Decentralized Application

- `.env.development`: check variable value

## Core functions

1. NftIdentities - ERC1155: Manage identity for students and teachers

   - Register identity in system
   - Get identity for teachers and students

   - Approve, reject registration
   - Extend the expired time for nft

   - Deposit nft identity to interact with system
   - Withdraw owned nft identity

2. NftSchool - ERC1155: Manage (~CRUD) school state

   - current academic year
   - requirements for graduation
   - courses and classes (instance of course) for registration
   - class registration time start and end

3. NftCertificates - ERC1155: Manage scoreboard, certificates of class completion and graduation
   - register class (currently cannot change registered class)
   - update score by teacher
   - exchange nft complete course when course complete
   - exchange nft graduation when student has enough credits

Each function in NftCertificates asks students and teachers to deposit their nftIdentities before executing.

## Test smart contract

Including 2 files:

    - 1_school.test.js: Test for registering, approving, rejecting teachers and creating courses
    - 2_course.test.js: Test for granting NFT course and exchanging NFT graduation

Command: `truffle test`

## Models

Folder **images/models** include the use-case model and smart contract diagrams.
