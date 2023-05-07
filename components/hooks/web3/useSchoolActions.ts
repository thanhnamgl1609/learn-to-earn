import { ContractTransaction, ethers } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { Course, Class } from '@_types/school';
import { HookFactoryWithoutSWR } from '@_types/hooks';
import { parseTimeStamp } from 'utils';

type CreateCourseFunc = {
  (params: {
    data: Omit<Course, 'id' | 'status' | 'meta'> & { uri: string };
    onSuccess?: () => {};
    onError?: (error: Error) => {};
  }): Promise<number>;
};

type CreateClassFunc = {
  (params: {
    data: Pick<
      Class,
      'courseId' | 'teacherTokenId' | 'maxSize' | 'completeAt'
    > & {
      uri: string;
    };
    onSuccess?: () => {};
    onError?: (error: Error) => {};
  }): Promise<void>;
};

type UseSchoolActionsReturnTypes = {
  createCourse: CreateCourseFunc;
  createClass: CreateClassFunc;
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

    const createClass: CreateClassFunc = useCallback(
      async ({ data, onSuccess, onError }) => {
        const { courseId, completeAt, maxSize, teacherTokenId, uri } = data;
        const promise = _contracts.nftSchool?.createClass(
          courseId,
          parseTimeStamp(completeAt),
          maxSize,
          teacherTokenId,
          uri
        );
        await promiseHandler({
          successMsg: `Success to create class`,
          errorMsg: `Fail to grant NFT`,
          onSuccess,
          onError,
          promise,
        });
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
      createClass,
    };
  };
