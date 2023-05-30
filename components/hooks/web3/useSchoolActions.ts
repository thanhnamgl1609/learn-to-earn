import { ContractTransaction, ethers } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { Course, Class, RegisterTime } from '@_types/school';
import { HookFactoryWithoutSWR } from '@_types/hooks';
import { parseTimeStamp } from 'utils';
import { useApi } from '@hooks/common';
import { formatClassResponse, formatRegisterTime } from './formatter';
import { addClassCreatedEvent } from 'components/events/courses';

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
      semesterId: number;
      registerClassFee: string;
    };
    onSuccess?: () => {};
    onError?: (error: Error) => {};
  }): Promise<void>;
};

type GetRegisterTimeFunc = {
  (semesterId: number): Promise<RegisterTime>;
};

type EditRegisterTimeFunc = {
  (
    semesterId: number,
    registeredStartAt: string,
    registeredEndAt: string
  ): Promise<void>;
};

type GetRegisterFeeClassByIdFunc = {
  (tokenId: number): Promise<number>;
};

type GetClassByIdFunc = {
  (classId: number): Promise<Class>;
};

type UseSchoolActionsReturnTypes = {
  createCourse: CreateCourseFunc;
  createClass: CreateClassFunc;
  getRegisterTime: GetRegisterTimeFunc;
  editRegisterTime: EditRegisterTimeFunc;
  getRegisterFeeClassById: GetRegisterFeeClassByIdFunc;
  getClassById: GetClassByIdFunc;
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

export const hookFactory: SchoolActionsHookFactory = (deps) => () => {
  const { contracts } = deps;
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
      if (_contracts) {
        const {
          courseId,
          completeAt,
          maxSize,
          teacherTokenId,
          semesterId,
          registerClassFee,
          uri,
        } = data;
        const promise = _contracts.nftSchool?.createClass(
          courseId,
          parseTimeStamp(completeAt),
          maxSize,
          teacherTokenId,
          semesterId,
          ethers.utils.parseEther(registerClassFee),
          uri
        );
        await promiseHandler({
          successMsg: `Success to create class`,
          errorMsg: `Fail to grant NFT`,
          onSuccess,
          onError,
          promise,
        });

        addClassCreatedEvent(deps as any);
      }
    },
    [_contracts]
  );

  const getRegisterTime: GetRegisterTimeFunc = useApi(
    async (semesterId) => {
      const registerTimeResponse = await contracts!.nftSchool.getRegisterTime(
        semesterId
      );

      return formatRegisterTime(registerTimeResponse);
    },
    [contracts]
  );

  const editRegisterTime: EditRegisterTimeFunc = useApi(
    async (semesterId, registeredStartAt, registeredEndAt) => {
      const updater = contracts!.nftSchool.updateRegisteredTime(
        semesterId,
        parseTimeStamp(registeredStartAt as string),
        parseTimeStamp(registeredEndAt as string)
      );

      await promiseHandler({
        successMsg: 'Cập nhật thành công',
        errorMsg: 'Cập nhật thất bại',
        promise: updater,
      });
    }
  );

  const getRegisterFeeClassById: GetRegisterFeeClassByIdFunc = async (
    tokenId
  ) => {
    const registerClassFee = await _contracts.nftSchool.getRegisterFeeClassById(
      tokenId
    );
    console.log("🚀 ~ file: useSchoolActions.ts:171 ~ registerClassFee:", registerClassFee)

    return parseFloat(ethers.utils.formatEther(registerClassFee));
  };

  const getClassById: GetClassByIdFunc = async (classId) => {
    const classInfo = await _contracts.nftSchool.getClassById(classId);

    return formatClassResponse(classInfo);
  };

  const promiseHandler: PromiseHandlerFunc = async ({
    successMsg,
    errorMsg,
    promise,
    onSuccess,
  }) => {
    const tx = await promise;

    const result = await toast.promise(tx!.wait(), {
      pending: 'Processing...',
      success: successMsg,
      error: errorMsg,
    });

    onSuccess?.(result);
  };

  return {
    createCourse,
    createClass,
    getRegisterTime,
    editRegisterTime,
    getRegisterFeeClassById,
    getClassById,
  };
};
