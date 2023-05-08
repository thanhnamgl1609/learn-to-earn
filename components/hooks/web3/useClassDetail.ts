import useSWR, { SWRResponse } from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { Class } from '@_types/school';
import { NftIdentity } from '@_types/nftIdentity';
import { formatClassResponse, formatNftIdentities } from './formatter';
import { useApi } from '@hooks/common';

type UseClassDetailResponse = {
  studentList: NftIdentity[];
  studentListSWR: Omit<SWRResponse, 'data'>;
};

type ClassDetailHookFactory = CryptoHookFactory<
  Class,
  UseClassDetailResponse,
  UseClassDetailParams
>;

export type UseClassDetailParams = {
  id: number;
  withStudentList?: boolean;
};

export type UseClassDetailHook = ReturnType<ClassDetailHookFactory>;

export const hookFactory: ClassDetailHookFactory =
  ({ contracts }) =>
  ({ id, withStudentList }) => {
    const getClassDetail = useApi(async () => {
      const classResponse = await contracts!.nftSchool.getClassById(id);
      const result = await formatClassResponse(classResponse);

      return result;
    });

    const getStudentList = useApi(async () => {
      const nftIdentities = await contracts!.nftSchool.getStudentListOfClass(
        id
      );
      const result = await formatNftIdentities(nftIdentities);

      return result;
    });

    const { data, ...swr } = useSWR(
      contracts ? `web3/useClassDetail${id}` : null,
      getClassDetail,
      {
        revalidateOnFocus: false,
      }
    );

    const { data: studentList, ...studentListSWR } = useSWR(
      contracts && withStudentList ? `web3/useStudentListOfClass${id}` : null,
      getStudentList,
      {
        revalidateOnFocus: false,
      }
    );

    return {
      ...swr,
      data,
      studentList,
      studentListSWR,
    };
  };
