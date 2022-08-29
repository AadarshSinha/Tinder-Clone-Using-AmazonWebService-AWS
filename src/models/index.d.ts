import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type MatchesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type WaitlingListMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Matches {
  readonly id: string;
  readonly user1: string;
  readonly user2: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Matches, MatchesMetaData>);
  static copyOf(source: Matches, mutator: (draft: MutableModel<Matches, MatchesMetaData>) => MutableModel<Matches, MatchesMetaData> | void): Matches;
}

export declare class WaitlingList {
  readonly id: string;
  readonly user1: string;
  readonly user2: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<WaitlingList, WaitlingListMetaData>);
  static copyOf(source: WaitlingList, mutator: (draft: MutableModel<WaitlingList, WaitlingListMetaData>) => MutableModel<WaitlingList, WaitlingListMetaData> | void): WaitlingList;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  readonly age: string;
  readonly bio: string;
  readonly gender: string;
  readonly sub: string;
  readonly image: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}