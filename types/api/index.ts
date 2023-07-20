import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';

export type ISendData = {
  (status: number, data: any): void;
};
export type IMethod = 'GET' | 'PUT' | 'PATCH' | 'POST';
export type IHandler = (
  req: NextApiRequest & {
    session: Session;
    address?: string;
  },
  res: NextApiResponse & {
    sendData: ISendData;
  }
) => Promise<any>;
export type IHandlers = {
  [k in IMethod]?: IHandler;
};
