import { IHandler } from '@_types/api';
import REQUEST_CONST from 'config/request.json';
import { usersRepo } from 'domain/repositories';
import { run, withSession } from '@api/utils';
import { createError } from '@api/utils/create-error';
import { ENV } from '@config/env';
import { contract } from '@api/utils/load-contract';
import { addressCheck, isOwner } from '@api/middleware';
import { formatNftIdentity } from '@hooks/web3/formatter';
import { TIMEOUT } from 'utils';

const { METHOD } = REQUEST_CONST;

const get: IHandler = async (req, res) => {
  const { account, tokenId } = req.query;
  const isOwner = account === ENV.OWNER;
  if (!isOwner && !tokenId) throw createError(400);

  const result = await usersRepo.get({
    tokenId: isOwner ? 0 : parseInt(tokenId as string),
  });

  res.sendData(200, result || {});
};

const post: IHandler = async (req, res) => {
  const {
    address: account,
    data: { applicant, role, meta },
  } = req.body;

  const nftIdentityResponse =
    await contract.nftIdentities.getNftOfMemberWithRole(
      parseInt(role),
      applicant as string,
      {
        from: account,
      }
    );
  const nftIdentity = await formatNftIdentity(nftIdentityResponse, {
    useProxy: false,
    timeout: TIMEOUT / 2,
  });
  const result = await usersRepo.upsert(nftIdentity, meta);

  res.sendData(200, result);
};

export default withSession(
  run({
    [METHOD.GET]: get,
    [METHOD.POST]: [addressCheck, isOwner, post],
  })
);
