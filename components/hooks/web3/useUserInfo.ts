import { CryptoHookFactory } from '@_types/hooks';
import { MetaType, NftIdentity, TeacherMeta } from '@_types/nftIdentity';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import CONST from '@config/constants.json';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

type UseUserInfoResponse = {
  applyTeacher: (metadata: string) => void;
};

type UserInfo = {
  role: number;
  registerFee?: number;
  nft?: NftIdentity;
  isExpired?: boolean;
  isRequestSent?: boolean;
  registration?: TeacherMeta;
};

type UserInfoHookFactory = CryptoHookFactory<UserInfo, UseUserInfoResponse>;

export type UseUserInfoHook = ReturnType<UserInfoHookFactory>;

const { ROLES } = CONST;

export const hookFactory: UserInfoHookFactory =
  ({ contracts }) =>
  () => {
    const _contracts = contracts;
    const [applyTeacherFee, setApplyTeacherFee] = useState(
      ethers.BigNumber.from(0)
    );

    const { data, ...swr } = useSWR(
      contracts ? 'web3/useUserInfo' : null,
      async () => {
        const role = (await contracts!.nftIdentities.getRole()).toNumber();
        const hasNftIdentity = [ROLES.STUDENT, ROLES.TEACHER].includes(role);

        if (hasNftIdentity) {
          const {
            result0: nftIdentityRes,
            result1: metadataURI,
            result2: isExpired,
            result3: isRequestSent,
          } = await contracts!.nftIdentities.getOwnedNft();
          const metaRes = await fetch(metadataURI);
          const meta = (await metaRes.json()) as MetaType;
          const nftIdentity: NftIdentity = {
            tokenId: nftIdentityRes.tokenId.toNumber(),
            expiredAt: nftIdentityRes.expiredAt.toNumber(),
            register: nftIdentityRes.register,
            meta,
          };

          return {
            role,
            nftIdentity,
            isExpired,
            isRequestSent,
          };
        } else if (role === ROLES.REGISTERED) {
          const { documentURI } = await contracts.nftIdentities.getRegisteredInfo()
          const documentRes = await fetch(documentURI);
          const registration = await documentRes.json();
          
          return {
            role,
            registration,
          }
        } else {
          const _applyTeacherFee = await contracts!.nftIdentities.registerFee();
          setApplyTeacherFee(_applyTeacherFee);

          return {
            role,
          };
        }
      }
    );

    const applyTeacher = useCallback(
      async (metadataURI: string) => {
        try {
          const tx = await _contracts.nftIdentities?.registerNftIdentity(
            ROLES.TEACHER,
            metadataURI,
            {
              value: applyTeacherFee,
            }
          );

          await toast.promise(tx!.wait(), {
            pending: 'Processing transaction...',
            success: 'Request sent! Waiting for validating!',
            error: 'Processing error!',
          });
        } catch (e: any) {
          console.error(e);
        }
      },
      [_contracts, applyTeacherFee]
    );

    return {
      ...swr,
      data,
      applyTeacher,
    };
  };
