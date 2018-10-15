// @flow
import type { TApiUser } from '../TApiUser';
import type { TBaseApiJson } from './TBaseApiJson';

export type TSignUpJson = {
  user: TApiUser,
  token: string,
} & TBaseApiJson;
