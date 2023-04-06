import { useRouter } from "next/router";

import CONST from '@config/constants.json';
import { BaseLayout } from "@templates";

type Query = {
  role: string;
}

const { REGISTRATION_ROLES } = CONST;
const REGISTRATION_ROLE_IDS = Object.keys(REGISTRATION_ROLES);

const RegisterRole = () => {
  const router = useRouter();

  return (
    <BaseLayout></BaseLayout>
  )
}

export default RegisterRole;
