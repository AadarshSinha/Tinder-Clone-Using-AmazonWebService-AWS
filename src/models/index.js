// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Matches, WaitlingList, User } = initSchema(schema);

export {
  Matches,
  WaitlingList,
  User
};