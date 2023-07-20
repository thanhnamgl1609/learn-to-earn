import { knowledgeBlockEntity } from 'domain/models';
import CONST from 'config/constants.json';
import { KnowledgeBlockEntityWithGain } from '@_types/api/certificates';
import { ClassEntity } from '@_types/models/entities';
import { useNftCompleteCourseListGroupApi } from '@hooks/api/classes';
import { useAppSelector } from '@hooks/stores';
import { selectCurrentNftIdentity } from '@store/userSlice';
import { BaseLayout } from '@templates';
import { Table } from '@organisms';
import {
  Box,
  InputField,
  InputMultipleImages,
  InputSingleImage,
} from '@molecules';
import { Button, Heading, Input } from '@atoms';
import { floor, formatDate } from 'utils';
import {
  ChangeEvent,
  Fragment,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CheckIcon, XIcon } from '@heroicons/react/solid';
import { useInputImageChange } from '@hooks/form';
import { useRequestGraduationPrice } from '@hooks/common';
import { useRequestGraduationCertificate } from '@hooks/api';

type CompleteCourseColumnProps = {
  item: ClassEntity;
  knowledgeBlock: KnowledgeBlockEntityWithGain;
  selectClassEntity: (
    classEntity: ClassEntity
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  isOn: (classEntity: ClassEntity) => boolean;
};

const { DATE_TIME } = CONST;

const completeCourseTableHeaders = [
  {
    name: '',
    custom: ({
      item,
      selectClassEntity,
      isOn,
    }: CompleteCourseColumnProps) => (
      <div className="flex items-center justify-center">
        <Input
          type="checkbox"
          onChange={selectClassEntity(item)}
          checked={isOn(item)}
        />
      </div>
    ),
  },
  {
    field: 'nftCompleteCourses[0].tokenId',
    name: 'Token Id',
  },
  {
    field: 'onChainId',
    name: 'Mã lớp học',
  },
  {
    field: 'course.name',
    name: 'Tên môn học',
  },
  {
    name: 'Khối kiến thức',
    custom: ({ knowledgeBlock }: CompleteCourseColumnProps) => (
      <p>{knowledgeBlock.name}</p>
    ),
  },
  {
    field: 'credits',
    name: 'Số tín chỉ',
  },
  {
    name: 'Ngày cấp',
    custom: ({ item }: CompleteCourseColumnProps) => (
      <p>
        {formatDate(
          item.nftCompleteCourses[0].grantDate,
          DATE_TIME.DATETIME
        )}
      </p>
    ),
  },
  {
    field: 'nftCompleteCourses[0].avgScore',
    name: 'Điểm trung bình',
  },
  {
    field: 'teacher.fullName',
    name: 'Giảng viên',
  },
];

const RequestGraduation = () => {
  const { tokenId } = useAppSelector(selectCurrentNftIdentity);
  const {
    data: knowledgeBlocks = knowledgeBlockEntity.createDefaultKnowledgeBlockList(),
  } = useNftCompleteCourseListGroupApi({
    studentTokenId: tokenId,
  });
  const { data: requestPrice } = useRequestGraduationPrice();
  const requestGraduation = useRequestGraduationCertificate();
  const [selectedNftCompleteCourses, setSelectedNftCompleteCourses] =
    useState<{
      [k: string]: ClassEntity | null;
    }>({});
  const [images, setImages] = useState<{
    nationalDefenseEduCertificate: string;
    foreignLanguageCertificate: string;
    otherCertificates: string[];
  }>({
    nationalDefenseEduCertificate: '',
    foreignLanguageCertificate: '',
    otherCertificates: [],
  });
  const onImageChange = useInputImageChange(setImages);

  const { totalCredits, avgScore } = useMemo(() => {
    let _totalAllCredits = 0;
    let _totalAllScore = 0;

    const _totalCredits = Object.values(
      selectedNftCompleteCourses
    ).reduce((prev, currSelected) => {
      if (!currSelected) return prev;

      prev[currSelected.knowledgeBlockId] =
        (prev[currSelected.knowledgeBlockId] ?? 0) +
        currSelected.credits;
      _totalAllScore +=
        currSelected.nftCompleteCourses[0].avgScore *
        currSelected.credits;
      _totalAllCredits += currSelected.credits;

      return prev;
    }, {} as { [k: number]: number });

    return {
      totalCredits: _totalCredits,
      avgScore:
        _totalAllCredits > 0
          ? floor(_totalAllScore / _totalAllCredits, 2)
          : 0,
    };
  }, [selectedNftCompleteCourses]);

  const canSubmit = useMemo(() => {
    if (!knowledgeBlocks) return false;
    const knowledgeBlocksById = knowledgeBlocks.list.reduce(
      (prev, curr) => ({ ...prev, [curr.onChainId]: curr }),
      {}
    );
    const isEnoughCredits = Object.keys(totalCredits).every(
      (key) => totalCredits[key] >= knowledgeBlocksById[key].credits
    );
    return (
      isEnoughCredits &&
      images.foreignLanguageCertificate &&
      images.nationalDefenseEduCertificate
    );
  }, [knowledgeBlocks, images]);

  const selectClassEntity =
    (item: ClassEntity) => (e: ChangeEvent<HTMLInputElement>) => {
      const shouldOn =
        !selectedNftCompleteCourses[item.courseCode] ||
        selectedNftCompleteCourses[item.courseCode].onChainId !==
          item.onChainId;
      setSelectedNftCompleteCourses((_prev) => ({
        ..._prev,
        [item.courseCode]: shouldOn ? item : null,
      }));
    };

  const isOn = (item: ClassEntity) => {
    return (
      item.onChainId ===
      selectedNftCompleteCourses[item.courseCode]?.onChainId
    );
  };

  const handleRemoveSingleImage = (name: string) => () =>
    setImages((_prev) => ({
      ..._prev,
      [name]: '',
    }));

  const handleRemoveMultipleImages =
    (name: string) => (image: string) =>
      setImages((_prev) => ({
        ..._prev,
        [name]: _prev[name].filter((item: string) => item !== image),
      }));

  const onSubmitRequest = () => {
    requestGraduation({
      classEntities: Object.values(selectedNftCompleteCourses).filter(
        Boolean
      ),
      requestPrice,
      ...images,
    });
  };

  useEffect(() => {
    const getDefaultState = () => {
      const selectedCourseIds = {};
      const allClasses = knowledgeBlocks.list.reduce(
        (prev, { classes }) => [...prev, ...classes],
        []
      ) as ClassEntity[];

      return allClasses.reduce((prev, curr) => {
        if (!selectedCourseIds[curr.courseCode]) {
          prev[curr.courseCode] = curr;
        }

        return prev;
      }, {});
    };

    setSelectedNftCompleteCourses(getDefaultState());
  }, [knowledgeBlocks]);

  return (
    <BaseLayout>
      <Box autoLayout>
        <Heading className="uppercase">
          Danh sách môn học dùng để tốt nghiệp
        </Heading>
        <InputField
          containerClassName="flex items-center gap-[24px]"
          labelClassName="min-w-[200px]"
          className="mt-0"
          label="Điểm TB tích lũy"
          value={avgScore}
          disabled
        />

        {knowledgeBlocks.list.map((knowledgeBlock) => (
          <Fragment key={knowledgeBlock.onChainId}>
            <Heading>
              {knowledgeBlock.name}

              <span className="ml-1 text-indigo-900 inline-flex items-center gap-4">
                ({totalCredits[knowledgeBlock.onChainId] ?? 0}/
                {knowledgeBlock.credits})
                {(totalCredits?.[knowledgeBlock.onChainId] ?? 0) >=
                knowledgeBlock.credits ? (
                  <CheckIcon className="w-[24px] h-[24px] p-[4px] bg-green-500 text-white rounded-full" />
                ) : (
                  <XIcon className="w-[24px] h-[24px] p-[4px] bg-red-500 text-white rounded-full" />
                )}
              </span>
            </Heading>

            <Table
              data={knowledgeBlock.classes}
              headers={completeCourseTableHeaders}
              customProps={{
                selectClassEntity,
                knowledgeBlock,
                isOn,
              }}
            />
          </Fragment>
        ))}
      </Box>

      <Box autoLayout>
        <Heading className="uppercase">Upload chứng chỉ</Heading>

        <InputSingleImage
          id="national-defense-edu-image"
          name="nationalDefenseEduCertificate"
          containerClassName="mt-4"
          label="Chứng chỉ giáo dục quốc phòng"
          labelClassName="text-xl"
          previewClassName="h-[200px] object-contain"
          image={images.nationalDefenseEduCertificate}
          onRemove={handleRemoveSingleImage(
            'nationalDefenseEduCertificate'
          )}
          onChange={onImageChange}
        />

        <InputSingleImage
          id="foreign-language-image"
          name="foreignLanguageCertificate"
          containerClassName="mt-4"
          label="Chứng chỉ ngoại ngữ"
          labelClassName="text-xl"
          previewClassName="h-[200px] object-contain"
          image={images.foreignLanguageCertificate}
          onRemove={handleRemoveSingleImage(
            'foreignLanguageCertificate'
          )}
          onChange={onImageChange}
        />

        <InputMultipleImages
          id="other-images"
          name="otherCertificates"
          containerClassName="mt-4"
          label="Chứng chỉ khác"
          labelClassName="text-xl"
          previewClassName="h-[200px] object-contain"
          images={images.otherCertificates}
          onRemove={handleRemoveMultipleImages('otherCertificates')}
          onChange={onImageChange}
        />
      </Box>

      <Button
        className="w-[100%]"
        onClick={onSubmitRequest}
        disabled={!canSubmit}
        theme="main"
      >
        Yêu cầu cấp chứng chỉ tốt nghiệp
      </Button>
    </BaseLayout>
  );
};

export default RequestGraduation;
