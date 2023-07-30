import { ChangeEvent, Fragment, useMemo } from 'react';

import CONST from 'config/constants.json';
import { KnowledgeBlockEntityWithGain } from '@_types/api/certificates';
import {
  ClassEntity,
  NftCompleteCourseEntity,
} from '@_types/models/entities';
import { useNftGraduationDetail } from '@hooks/api';
import { selectUserDetail } from '@store/userSlice';
import { BaseLayout } from '@templates';
import { Table } from '@organisms';
import { Box, InputField, LinkField, ImageView } from '@molecules';
import { Heading } from '@atoms';
import { floor, formatDate } from 'utils';
import { CheckIcon, XIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';

type CompleteCourseColumnProps = {
  item: NftCompleteCourseEntity;
  knowledgeBlock: KnowledgeBlockEntityWithGain;
  selectClassEntity: (
    classEntity: ClassEntity
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  isOn: (classEntity: ClassEntity) => boolean;
};

const { DATE_TIME } = CONST;

const completeCourseTableHeaders = [
  {
    field: 'tokenId',
    name: 'Token Id',
  },
  {
    field: 'class.onChainId',
    name: 'Mã lớp học',
  },
  {
    field: 'class.course.name',
    name: 'Tên môn học',
  },
  {
    name: 'Khối kiến thức',
    custom: ({ knowledgeBlock }: CompleteCourseColumnProps) => (
      <p>{knowledgeBlock.name}</p>
    ),
  },
  {
    field: 'class.credits',
    name: 'Số tín chỉ',
  },
  {
    name: 'Ngày cấp',
    custom: ({ item }: CompleteCourseColumnProps) => (
      <p>{formatDate(item.grantDate, DATE_TIME.DATETIME)}</p>
    ),
  },
  {
    field: 'avgScore',
    name: 'Điểm trung bình',
  },
  {
    field: 'class.teacher.fullName',
    name: 'Giảng viên',
  },
];

const NftGraduationDetail = () => {
  const router = useRouter();
  const { id: qid } = router.query;
  const tokenId = parseInt(qid as string);
  if (!tokenId || Number.isNaN(tokenId)) return null;

  const { data: nftGraduation } = useNftGraduationDetail(tokenId);
  const {
    nftCompleteCourses = [],
    grantDate,
    uri,
    request,
  } = nftGraduation || {};
  const {
    otherCertificates = [],
    foreignLanguageCertificate = '',
    nationalDefenseEduCertificate = '',
  } = request || {};

  const { totalCredits, avgScore, knowledgeBlockByIds } =
    useMemo(() => {
      let _totalAllCredits = 0;
      let _totalAllScore = 0;
      let _knowledgeBlocks: Record<string, any> = {};

      const _totalCredits = Object.values(nftCompleteCourses).reduce(
        (prev, currSelected) => {
          if (!currSelected) return prev;

          _knowledgeBlocks[
            currSelected.class.knowledgeBlock.onChainId
          ] ??= {
            ...currSelected.class.knowledgeBlock,
            nftCompleteCourses: [],
          };
          _knowledgeBlocks[
            currSelected.class.knowledgeBlock.onChainId
          ].nftCompleteCourses.push(currSelected);

          prev[currSelected.class.knowledgeBlock.onChainId] =
            (prev[currSelected.class.knowledgeBlock.onChainId] ?? 0) +
            currSelected.class.credits;

          _totalAllScore +=
            currSelected.avgScore * currSelected.class.credits;
          _totalAllCredits += currSelected.class.credits;

          return prev;
        },
        {} as { [k: number]: number }
      );

      return {
        totalCredits: _totalCredits,
        avgScore:
          _totalAllCredits > 0
            ? floor(_totalAllScore / _totalAllCredits, 2)
            : 0,
        knowledgeBlockByIds: _knowledgeBlocks,
      };
    }, [nftCompleteCourses]);

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
        <InputField
          label="Ngày cấp"
          value={formatDate(grantDate, DATE_TIME.SLASH_DATE)}
          readOnly
        />

        <LinkField
          label="Metadata"
          text={uri}
          href={uri}
          target="_blank"
        />

        {Object.values(knowledgeBlockByIds).map((knowledgeBlock) => (
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
              data={knowledgeBlock.nftCompleteCourses}
              headers={completeCourseTableHeaders}
              customProps={{ knowledgeBlock }}
            />
          </Fragment>
        ))}
      </Box>

      <Box autoLayout>
        <Heading className="uppercase">Chứng chỉ</Heading>

        <ImageView
          images={[{ src: nationalDefenseEduCertificate, alt: '' }]}
          canZoomIn
          label="Chứng chỉ giáo dục quốc phòng"
          labelClassName="text-xl"
          containerClassName="mt-4"
        />

        <ImageView
          images={[{ src: foreignLanguageCertificate, alt: '' }]}
          canZoomIn
          label="Chứng chỉ ngoại ngữ"
          labelClassName="text-xl"
          containerClassName="mt-4"
        />

        {otherCertificates && otherCertificates.length > 0 && (
          <ImageView
            images={otherCertificates.map((src) => ({
              src,
              alt: '',
            }))}
            canZoomIn
            label="Chứng chỉ khác"
            labelClassName="text-xl"
            containerClassName="mt-4"
          />
        )}
      </Box>
    </BaseLayout>
  );
};

export default NftGraduationDetail;
