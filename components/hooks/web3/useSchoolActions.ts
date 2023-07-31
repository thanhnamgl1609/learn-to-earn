import { ContractTransaction, ethers } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { Course, Class, RegisterTime } from '@_types/school';
import { HookFactoryWithoutSWR } from '@_types/hooks';
import { parseTimeStamp } from 'utils';
import { useApi } from '@hooks/common';
import { formatClassResponse, formatRegisterTime } from './formatter';
import { addClassCreatedEvent } from 'components/events';

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
    onSuccess: (tokenId: number) => void;
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

export type UseSchoolActionsHook =
  ReturnType<SchoolActionsHookFactory>;

export const hookFactory: SchoolActionsHookFactory = (deps) => () => {
  const { contracts } = deps;
  const _contracts = contracts;

  const createCourse: CreateCourseFunc = useCallback(
    async ({ data, onSuccess, onError }) => {
      const {
        credits,
        knowledgeBlockId,
        uri,
        courseCode,
        prevCourseId,
      } = data;
      const promise = _contracts.school?.createCourse(
        prevCourseId,
        knowledgeBlockId,
        credits,
        courseCode,
        uri
      );
      await promiseHandler({
        successMsg: `Tạo môn học thành công`,
        errorMsg: `Tạo môn học thất bại`,
        onSuccess,
        onError,
        promise,
      });
      const id = await _contracts.school?.getCourseIdByURI(uri);

      return id.toNumber();
    },
    [_contracts]
  );

  const createClass: CreateClassFunc = useCallback(
    async ({ data, onSuccess }) => {
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
        const promise = _contracts.school?.createClass(
          courseId,
          parseTimeStamp(completeAt),
          maxSize,
          teacherTokenId,
          semesterId,
          ethers.utils.parseEther(registerClassFee),
          uri
        );
        await promiseHandler({
          successMsg: `Tạo lớp học thành công`,
          errorMsg: `Tạo lớp học thất bại`,
          promise,
        });

        addClassCreatedEvent(deps as any, onSuccess);
      }
    },
    [_contracts, deps]
  );

  const getRegisterTime: GetRegisterTimeFunc = useApi(
    async (semesterId) => {
      const registerTimeResponse =
        await contracts!.school.getRegisterTime(semesterId);

      return formatRegisterTime(registerTimeResponse);
    },
    [contracts]
  );

  const editRegisterTime: EditRegisterTimeFunc = useApi(
    async (semesterId, registeredStartAt, registeredEndAt) => {
      const updater = contracts!.school.updateRegisteredTime(
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
    const registerClassFee =
      await _contracts.school.getRegisterFeeClassById(tokenId);

    return parseFloat(ethers.utils.formatEther(registerClassFee));
  };

  const getClassById: GetClassByIdFunc = async (classId) => {
    const classInfo = await _contracts.school.getClassById(classId);

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
