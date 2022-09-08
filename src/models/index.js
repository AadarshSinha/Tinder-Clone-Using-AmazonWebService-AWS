// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Block, ChatUsers, ChatData, Matches, WaitlingList, User } = initSchema(schema);

export {
  Block,
  ChatUsers,
  ChatData,
  Matches,
  WaitlingList,
  User
};