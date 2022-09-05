// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ChatUsers, ChatData, Matches, WaitlingList, User } = initSchema(schema);

export {
  ChatUsers,
  ChatData,
  Matches,
  WaitlingList,
  User
};