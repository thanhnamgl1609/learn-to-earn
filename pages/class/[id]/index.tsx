import { useRouter } from 'next/router';
import { useState } from 'react';

import CONST from '@config/constants.json';
import { useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';
import { ClassDetailTeacher, ClassDetailCouncil } from '@templates';

const { ROLES } = CONST;

const ClassDetailPage = () => {
  const { role } = useAppSelector(selectUser);
  const isTeacher = role === ROLES.TEACHER;

  return isTeacher ? <ClassDetailTeacher /> : <ClassDetailCouncil />;
};

export default ClassDetailPage;
