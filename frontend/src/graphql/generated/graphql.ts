export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: string; output: string };
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  user: User;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role?: InputMaybe<UserRole>;
  subscriptionPlan?: InputMaybe<SubscriptionPlan>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  login: AuthResponse;
  logout: Scalars['Boolean']['output'];
  register: AuthResponse;
  removeUser: Scalars['Boolean']['output'];
  updateProfile: User;
  updateUser: User;
};

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};

export type MutationLoginArgs = {
  loginInput: LoginInput;
};

export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};

export type MutationRemoveUserArgs = {
  id: Scalars['String']['input'];
};

export type MutationUpdateProfileArgs = {
  updateProfileInput: UpdateProfileInput;
};

export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  me: User;
  user: User;
  users: Array<User>;
};

export type QueryUserArgs = {
  id: Scalars['String']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** User subscription plan */
export type SubscriptionPlan = 'BASIC' | 'ENTERPRISE' | 'FREE' | 'PREMIUM' | '%future added value';

export type UpdateProfileInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isEmailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
  subscriptionPlan?: InputMaybe<SubscriptionPlan>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  role: UserRole;
  subscriptionPlan: SubscriptionPlan;
  updatedAt: Scalars['DateTime']['output'];
};

/** User role in the system */
export type UserRole = 'ADMIN' | 'MODERATOR' | 'USER' | '%future added value';

export type UserFragmentFragment = {
  __typename?: 'User';
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  subscriptionPlan: SubscriptionPlan;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;

export type LoginMutation = {
  __typename?: 'Mutation';
  login: { __typename?: 'AuthResponse'; accessToken: string; user: { __typename?: 'User' } & UserFragmentFragment };
};

export type RegisterMutationVariables = Exact<{
  registerInput: RegisterInput;
}>;

export type RegisterMutation = {
  __typename?: 'Mutation';
  register: { __typename?: 'AuthResponse'; accessToken: string; user: { __typename?: 'User' } & UserFragmentFragment };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: 'Mutation'; logout: boolean };

export type UpdateProfileMutationVariables = Exact<{
  updateProfileInput: UpdateProfileInput;
}>;

export type UpdateProfileMutation = { __typename?: 'Mutation'; updateProfile: { __typename?: 'User' } & UserFragmentFragment };

export type CreateUserMutationVariables = Exact<{
  createUserInput: CreateUserInput;
}>;

export type CreateUserMutation = { __typename?: 'Mutation'; createUser: { __typename?: 'User' } & UserFragmentFragment };

export type UpdateUserMutationVariables = Exact<{
  updateUserInput: UpdateUserInput;
}>;

export type UpdateUserMutation = { __typename?: 'Mutation'; updateUser: { __typename?: 'User' } & UserFragmentFragment };

export type RemoveUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type RemoveUserMutation = { __typename?: 'Mutation'; removeUser: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: 'Query'; me: { __typename?: 'User' } & UserFragmentFragment };

export type GetUsersQueryVariables = Exact<{ [key: string]: never }>;

export type GetUsersQuery = { __typename?: 'Query'; users: Array<{ __typename?: 'User' } & UserFragmentFragment> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetUserQuery = { __typename?: 'Query'; user: { __typename?: 'User' } & UserFragmentFragment };
