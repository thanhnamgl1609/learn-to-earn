import { ContractTransaction, ethers } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';

import { Course } from '@_types/school';
import { HookFactoryWithoutSWR } from '@_types/hooks';
import { formatCourse } from './formatter';

type CreateCourseFunc = {
  (params: {
    data: Omit<Course, 'id' | 'status' | 'meta'> & { uri: string };
    onSuccess?: () => {};
    onError?: (error: Error) => {};
  }): Promise<number>;
};

type UseSchoolActionsReturnTypes = {
  createCourse: CreateCourseFunc;
};
type PromiseHandlerFunc = (params: {
  onSuccess?: (params: any) => {};
  onError?: (error: Error) => {};
  successMsg: string;
  errorMsg: string;
  promise: Promise<ContractTransaction>;
}) => Promise<void>;

type SchoolActionsHookFactory =
  HookFactoryWithoutSWR<UseSchoolActionsReturnTypes>;

export type UseSchoolActionsHook = ReturnType<SchoolActionsHookFactory>;

export const hookFactory: SchoolActionsHookFactory =
  ({ contracts }) =>
  () => {
    const _contracts = contracts;

    const createCourse: CreateCourseFunc = useCallback(
      async ({ data, onSuccess, onError }) => {
        const { credits, knowledgeBlockId, uri, prevCourseId } = data;
        const promise = _contracts.nftSchool?.createCourse(
          prevCourseId,
          knowledgeBlockId,
          credits,
          uri
        );
        await promiseHandler({
          successMsg: `Success to create course`,
          errorMsg: `Fail to grant NFT`,
          onSuccess,
          onError,
          promise,
        });
        const id = await _contracts.nftSchool?.getCourseIdByURI(uri);

        return id.toNumber();
      },
      [_contracts]
    );

    const promiseHandler: PromiseHandlerFunc = async ({
      successMsg,
      errorMsg,
      promise,
      onSuccess,
      onError,
    }) => {
      try {
        const tx = await promise;
        console.log('🚀 ~ file: useSchoolActions.ts:131 ~ tx:', tx);

        const result = await toast.promise(tx!.wait(), {
          pending: 'Processing...',
          success: successMsg,
          error: errorMsg,
        });

        onSuccess?.(result);
      } catch (e) {
        toast.error(e.message);
        onError?.(e.message);
      }
    };

    return {
      createCourse,
    };
  };
