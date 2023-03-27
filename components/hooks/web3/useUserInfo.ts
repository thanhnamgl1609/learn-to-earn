import { CryptoHookFactory } from '@_types/hooks';
import {
  MetaType,
  NftIdentity,
  RegistrationInfo,
  RegistrationInfoMeta,
  TeacherMeta,
} from '@_types/nftIdentity';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import CONST from '@config/constants.json';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import moment from 'moment';

type UseUserInfoResponse = {
  applyTeacher: (metadata: string) => void;
};

type UserInfo = {
  role: number;
  registerFee?: number;
  nftIdentity?: NftIdentity;
  isExpired?: boolean;
  isRequestSent?: boolean;
  registration?: RegistrationInfoMeta;
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
          const response = await contracts!.nftIdentities.getOwnedNft();
          const {
            0: nftIdentityRes,
            1: metadataURI,
            2: isExpired,
            3: isRequestSent,
          } = response;
          const metaRes = await fetch(metadataURI);
          const meta = (await metaRes.json()) as MetaType;
          const nftIdentity: NftIdentity = {
            tokenId: nftIdentityRes.tokenId.toNumber(),
            expiredAt: moment
              .unix(nftIdentityRes.expiredAt.toNumber())
              .toDate(),
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
          const { documentURI } =
            await contracts.nftIdentities.getRegisteredInfo();
          const documentRes = await fetch(documentURI);
          const registration = await documentRes.json();

          return {
            role,
            registration,
          };
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
          error: 'Error when sending request!',
        });
      },
      [_contracts, applyTeacherFee]
    );

    return {
      ...swr,
      data,
      applyTeacher,
    };
  };
