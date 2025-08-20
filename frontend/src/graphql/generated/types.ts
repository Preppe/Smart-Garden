import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  user: User;
};

export type CreateCultivationInput = {
  expectedHarvestDate?: InputMaybe<Scalars['DateTime']['input']>;
  gardenId: Scalars['ID']['input'];
  growthStage?: InputMaybe<GrowthStage>;
  notes?: InputMaybe<Scalars['String']['input']>;
  plantName: Scalars['String']['input'];
  plantedDate: Scalars['DateTime']['input'];
  variety?: InputMaybe<Scalars['String']['input']>;
};

export type CreateGardenInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<GardenLocationInput>;
  name: Scalars['String']['input'];
  type: GardenType;
};

export type CreateSensorInput = {
  calibration?: InputMaybe<SensorCalibrationInput>;
  cultivationId?: InputMaybe<Scalars['ID']['input']>;
  deviceId: Scalars['String']['input'];
  gardenId?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  locationLevel: SensorLocationLevel;
  name: Scalars['String']['input'];
  thresholds?: InputMaybe<SensorThresholdsInput>;
  type: SensorType;
  unit: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role?: InputMaybe<UserRole>;
  subscriptionPlan?: InputMaybe<SubscriptionPlan>;
};

export type Cultivation = {
  __typename?: 'Cultivation';
  createdAt: Scalars['DateTime']['output'];
  expectedHarvestDate?: Maybe<Scalars['DateTime']['output']>;
  garden: Garden;
  growthStage: GrowthStage;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  plantName: Scalars['String']['output'];
  plantedDate: Scalars['DateTime']['output'];
  sensors: Array<Sensor>;
  updatedAt: Scalars['DateTime']['output'];
  variety?: Maybe<Scalars['String']['output']>;
};

export type Garden = {
  __typename?: 'Garden';
  createdAt: Scalars['DateTime']['output'];
  cultivations: Array<Cultivation>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  location?: Maybe<GardenLocation>;
  name: Scalars['String']['output'];
  sensors: Array<Sensor>;
  type: GardenType;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type GardenLocation = {
  __typename?: 'GardenLocation';
  address?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
};

export type GardenLocationInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
};

/** Type of garden */
export type GardenType =
  | 'GREENHOUSE'
  | 'INDOOR'
  | 'OUTDOOR'
  | '%future added value';

/** Growth stage of the plant */
export type GrowthStage =
  | 'FLOWERING'
  | 'FRUITING'
  | 'HARVEST'
  | 'SEED'
  | 'SEEDLING'
  | 'VEGETATIVE'
  | '%future added value';

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MqttConnectionInfo = {
  __typename?: 'MqttConnectionInfo';
  clientIdPrefix: Scalars['String']['output'];
  commandTopicSubscribe: Scalars['String']['output'];
  dataTopicPublish: Scalars['String']['output'];
  host: Scalars['String']['output'];
  keepalive: Scalars['Int']['output'];
  port: Scalars['Int']['output'];
  statusTopicPublish: Scalars['String']['output'];
  token: Scalars['String']['output'];
  wsPort: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCultivation: Cultivation;
  createGarden: Garden;
  createSensor: Sensor;
  createUser: User;
  deleteCultivation: Scalars['Boolean']['output'];
  deleteGarden: Scalars['Boolean']['output'];
  deleteSensor: Scalars['Boolean']['output'];
  login: AuthResponse;
  logout: Scalars['Boolean']['output'];
  register: AuthResponse;
  removeUser: Scalars['Boolean']['output'];
  sendSensorCommand: Scalars['Boolean']['output'];
  updateCultivation: Cultivation;
  updateGarden: Garden;
  updateProfile: User;
  updateSensor: Sensor;
  updateUser: User;
};


export type MutationCreateCultivationArgs = {
  input: CreateCultivationInput;
};


export type MutationCreateGardenArgs = {
  input: CreateGardenInput;
};


export type MutationCreateSensorArgs = {
  input: CreateSensorInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationDeleteCultivationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGardenArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSensorArgs = {
  id: Scalars['ID']['input'];
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


export type MutationSendSensorCommandArgs = {
  input: SendCommandInput;
  sensorId: Scalars['ID']['input'];
};


export type MutationUpdateCultivationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCultivationInput;
};


export type MutationUpdateGardenArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGardenInput;
};


export type MutationUpdateProfileArgs = {
  updateProfileInput: UpdateProfileInput;
};


export type MutationUpdateSensorArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSensorInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  getCultivation: Cultivation;
  getCultivationSensors: Array<Sensor>;
  getGarden: Garden;
  getGardenSensors: Array<Sensor>;
  getLatestSensorValue?: Maybe<SensorDataPoint>;
  getMqttConnectionInfo: MqttConnectionInfo;
  getSensor: Sensor;
  getSensorData: Array<SensorDataPoint>;
  getUserCultivations: Array<Cultivation>;
  getUserGardens: Array<Garden>;
  getUserSensors: Array<Sensor>;
  me: User;
  user: User;
  users: Array<User>;
};


export type QueryGetCultivationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCultivationSensorsArgs = {
  cultivationId: Scalars['ID']['input'];
};


export type QueryGetGardenArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetGardenSensorsArgs = {
  gardenId: Scalars['ID']['input'];
};


export type QueryGetLatestSensorValueArgs = {
  sensorId: Scalars['ID']['input'];
};


export type QueryGetMqttConnectionInfoArgs = {
  sensorId: Scalars['ID']['input'];
};


export type QueryGetSensorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetSensorDataArgs = {
  query: SensorDataQueryInput;
  sensorId: Scalars['ID']['input'];
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

export type SendCommandInput = {
  command: Scalars['String']['input'];
  parameters?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type Sensor = {
  __typename?: 'Sensor';
  calibration?: Maybe<SensorCalibration>;
  connectionToken: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  cultivation?: Maybe<Cultivation>;
  deviceId: Scalars['String']['output'];
  garden?: Maybe<Garden>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastDataReceived?: Maybe<Scalars['DateTime']['output']>;
  locationLevel: SensorLocationLevel;
  mqttTopic: Scalars['String']['output'];
  name: Scalars['String']['output'];
  thresholds?: Maybe<SensorThresholds>;
  type: SensorType;
  unit: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SensorCalibration = {
  __typename?: 'SensorCalibration';
  lastCalibrated?: Maybe<Scalars['DateTime']['output']>;
  multiplier?: Maybe<Scalars['Float']['output']>;
  offset?: Maybe<Scalars['Float']['output']>;
};

export type SensorCalibrationInput = {
  lastCalibrated?: InputMaybe<Scalars['DateTime']['input']>;
  multiplier?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
};

export type SensorDataPoint = {
  __typename?: 'SensorDataPoint';
  sensorId: Scalars['String']['output'];
  time: Scalars['Int']['output'];
  userId: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type SensorDataQueryInput = {
  aggregateWindow?: InputMaybe<Scalars['String']['input']>;
  start: Scalars['String']['input'];
  stop?: InputMaybe<Scalars['String']['input']>;
};

/** Level where the sensor is installed */
export type SensorLocationLevel =
  | 'CULTIVATION'
  | 'GARDEN'
  | '%future added value';

export type SensorThresholds = {
  __typename?: 'SensorThresholds';
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  optimal_max?: Maybe<Scalars['Float']['output']>;
  optimal_min?: Maybe<Scalars['Float']['output']>;
};

export type SensorThresholdsInput = {
  max?: InputMaybe<Scalars['Float']['input']>;
  min?: InputMaybe<Scalars['Float']['input']>;
  optimal_max?: InputMaybe<Scalars['Float']['input']>;
  optimal_min?: InputMaybe<Scalars['Float']['input']>;
};

/** Type of sensor measurement */
export type SensorType =
  | 'AIR_QUALITY'
  | 'HUMIDITY'
  | 'LIGHT'
  | 'PH'
  | 'SOIL_MOISTURE'
  | 'TEMPERATURE'
  | '%future added value';

/** User subscription plan */
export type SubscriptionPlan =
  | 'BASIC'
  | 'ENTERPRISE'
  | 'FREE'
  | 'PREMIUM'
  | '%future added value';

export type UpdateCultivationInput = {
  expectedHarvestDate?: InputMaybe<Scalars['DateTime']['input']>;
  growthStage?: InputMaybe<GrowthStage>;
  notes?: InputMaybe<Scalars['String']['input']>;
  plantName?: InputMaybe<Scalars['String']['input']>;
  plantedDate?: InputMaybe<Scalars['DateTime']['input']>;
  variety?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGardenInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<GardenLocationInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<GardenType>;
};

export type UpdateProfileInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSensorInput = {
  calibration?: InputMaybe<SensorCalibrationInput>;
  cultivationId?: InputMaybe<Scalars['ID']['input']>;
  deviceId?: InputMaybe<Scalars['String']['input']>;
  gardenId?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  locationLevel?: InputMaybe<SensorLocationLevel>;
  name?: InputMaybe<Scalars['String']['input']>;
  thresholds?: InputMaybe<SensorThresholdsInput>;
  type?: InputMaybe<SensorType>;
  unit?: InputMaybe<Scalars['String']['input']>;
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
export type UserRole =
  | 'ADMIN'
  | 'MODERATOR'
  | 'USER'
  | '%future added value';

export type LoginUserMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginUserMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', accessToken: string, user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, fullName: string, role: UserRole, subscriptionPlan: SubscriptionPlan, isActive: boolean, isEmailVerified: boolean, createdAt: string, updatedAt: string } } };

export type RegisterUserMutationVariables = Exact<{
  registerInput: RegisterInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthResponse', accessToken: string, user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, fullName: string, role: UserRole, subscriptionPlan: SubscriptionPlan, isActive: boolean, isEmailVerified: boolean, createdAt: string, updatedAt: string } } };

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = { __typename?: 'Mutation', logout: boolean };

export type CreateGardenMutationVariables = Exact<{
  input: CreateGardenInput;
}>;


export type CreateGardenMutation = { __typename?: 'Mutation', createGarden: { __typename?: 'Garden', id: string, name: string, description?: string | null | undefined, type: GardenType, createdAt: string, updatedAt: string, location?: { __typename?: 'GardenLocation', address?: string | null | undefined, latitude?: number | null | undefined, longitude?: number | null | undefined } | null | undefined } };

export type UpdateGardenMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateGardenInput;
}>;


export type UpdateGardenMutation = { __typename?: 'Mutation', updateGarden: { __typename?: 'Garden', id: string, name: string, description?: string | null | undefined, type: GardenType, createdAt: string, updatedAt: string, location?: { __typename?: 'GardenLocation', address?: string | null | undefined, latitude?: number | null | undefined, longitude?: number | null | undefined } | null | undefined } };

export type DeleteGardenMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteGardenMutation = { __typename?: 'Mutation', deleteGarden: boolean };

export type CreateCultivationMutationVariables = Exact<{
  input: CreateCultivationInput;
}>;


export type CreateCultivationMutation = { __typename?: 'Mutation', createCultivation: { __typename?: 'Cultivation', id: string, plantName: string, variety?: string | null | undefined, growthStage: GrowthStage, plantedDate: string, expectedHarvestDate?: string | null | undefined, notes?: string | null | undefined, createdAt: string, updatedAt: string, garden: { __typename?: 'Garden', id: string, name: string } } };

export type UpdateCultivationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateCultivationInput;
}>;


export type UpdateCultivationMutation = { __typename?: 'Mutation', updateCultivation: { __typename?: 'Cultivation', id: string, plantName: string, variety?: string | null | undefined, growthStage: GrowthStage, plantedDate: string, expectedHarvestDate?: string | null | undefined, notes?: string | null | undefined, createdAt: string, updatedAt: string } };

export type DeleteCultivationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCultivationMutation = { __typename?: 'Mutation', deleteCultivation: boolean };

export type CreateSensorMutationVariables = Exact<{
  input: CreateSensorInput;
}>;


export type CreateSensorMutation = { __typename?: 'Mutation', createSensor: { __typename?: 'Sensor', id: string, name: string, type: SensorType, unit: string, deviceId: string, isActive: boolean, locationLevel: SensorLocationLevel, createdAt: string, updatedAt: string, thresholds?: { __typename?: 'SensorThresholds', min?: number | null | undefined, max?: number | null | undefined, optimal_min?: number | null | undefined, optimal_max?: number | null | undefined } | null | undefined, calibration?: { __typename?: 'SensorCalibration', offset?: number | null | undefined, multiplier?: number | null | undefined, lastCalibrated?: string | null | undefined } | null | undefined, garden?: { __typename?: 'Garden', id: string, name: string } | null | undefined, cultivation?: { __typename?: 'Cultivation', id: string, plantName: string } | null | undefined } };

export type UpdateSensorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSensorInput;
}>;


export type UpdateSensorMutation = { __typename?: 'Mutation', updateSensor: { __typename?: 'Sensor', id: string, name: string, type: SensorType, unit: string, deviceId: string, isActive: boolean, locationLevel: SensorLocationLevel, createdAt: string, updatedAt: string, thresholds?: { __typename?: 'SensorThresholds', min?: number | null | undefined, max?: number | null | undefined, optimal_min?: number | null | undefined, optimal_max?: number | null | undefined } | null | undefined, calibration?: { __typename?: 'SensorCalibration', offset?: number | null | undefined, multiplier?: number | null | undefined, lastCalibrated?: string | null | undefined } | null | undefined } };

export type DeleteSensorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSensorMutation = { __typename?: 'Mutation', deleteSensor: boolean };

export type CreateNewSensorMutationVariables = Exact<{
  input: CreateSensorInput;
}>;


export type CreateNewSensorMutation = { __typename?: 'Mutation', createSensor: { __typename?: 'Sensor', id: string, deviceId: string, name: string, type: SensorType, unit: string, locationLevel: SensorLocationLevel, isActive: boolean, mqttTopic: string, connectionToken: string, lastDataReceived?: string | null | undefined, createdAt: string, updatedAt: string, calibration?: { __typename?: 'SensorCalibration', offset?: number | null | undefined, multiplier?: number | null | undefined, lastCalibrated?: string | null | undefined } | null | undefined, thresholds?: { __typename?: 'SensorThresholds', min?: number | null | undefined, max?: number | null | undefined, optimal_min?: number | null | undefined, optimal_max?: number | null | undefined } | null | undefined, garden?: { __typename?: 'Garden', id: string, name: string } | null | undefined, cultivation?: { __typename?: 'Cultivation', id: string, plantName: string } | null | undefined } };

export type UpdateExistingSensorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSensorInput;
}>;


export type UpdateExistingSensorMutation = { __typename?: 'Mutation', updateSensor: { __typename?: 'Sensor', id: string, deviceId: string, name: string, type: SensorType, unit: string, locationLevel: SensorLocationLevel, isActive: boolean, mqttTopic: string, connectionToken: string, lastDataReceived?: string | null | undefined, createdAt: string, updatedAt: string, calibration?: { __typename?: 'SensorCalibration', offset?: number | null | undefined, multiplier?: number | null | undefined, lastCalibrated?: string | null | undefined } | null | undefined, thresholds?: { __typename?: 'SensorThresholds', min?: number | null | undefined, max?: number | null | undefined, optimal_min?: number | null | undefined, optimal_max?: number | null | undefined } | null | undefined, garden?: { __typename?: 'Garden', id: string, name: string } | null | undefined, cultivation?: { __typename?: 'Cultivation', id: string, plantName: string } | null | undefined } };

export type SendSensorCommandMutationVariables = Exact<{
  sensorId: Scalars['ID']['input'];
  input: SendCommandInput;
}>;


export type SendSensorCommandMutation = { __typename?: 'Mutation', sendSensorCommand: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, fullName: string, role: UserRole, subscriptionPlan: SubscriptionPlan, isActive: boolean, isEmailVerified: boolean, createdAt: string, updatedAt: string } };

export type GetUserQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, fullName: string, role: UserRole, subscriptionPlan: SubscriptionPlan, isActive: boolean, isEmailVerified: boolean, createdAt: string, updatedAt: string } };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, email: string, firstName: string, lastName: string, fullName: string, role: UserRole, subscriptionPlan: SubscriptionPlan, isActive: boolean, isEmailVerified: boolean, createdAt: string, updatedAt: string }> };

export type GetUserGardensQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserGardensQuery = { __typename?: 'Query', getUserGardens: Array<{ __typename?: 'Garden', id: string, name: string, description?: string | null | undefined, type: GardenType, createdAt: string, updatedAt: string, location?: { __typename?: 'GardenLocation', address?: string | null | undefined, latitude?: number | null | undefined, longitude?: number | null | undefined } | null | undefined, cultivations: Array<{ __typename?: 'Cultivation', id: string, plantName: string, variety?: string | null | undefined, growthStage: GrowthStage, plantedDate: string, expectedHarvestDate?: string | null | undefined, notes?: string | null | undefined }> }> };

export type GetGardenQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGardenQuery = { __typename?: 'Query', getGarden: { __typename?: 'Garden', id: string, name: string, description?: string | null | undefined, type: GardenType, createdAt: string, updatedAt: string, location?: { __typename?: 'GardenLocation', address?: string | null | undefined, latitude?: number | null | undefined, longitude?: number | null | undefined } | null | undefined, cultivations: Array<{ __typename?: 'Cultivation', id: string, plantName: string, variety?: string | null | undefined, growthStage: GrowthStage, plantedDate: string, expectedHarvestDate?: string | null | undefined, notes?: string | null | undefined }>, sensors: Array<{ __typename?: 'Sensor', id: string, name: string, type: SensorType, unit: string, deviceId: string, isActive: boolean, locationLevel: SensorLocationLevel }> } };

export type GetGardenSensorsQueryVariables = Exact<{
  gardenId: Scalars['ID']['input'];
}>;


export type GetGardenSensorsQuery = { __typename?: 'Query', getGardenSensors: Array<{ __typename?: 'Sensor', id: string, name: string, type: SensorType, unit: string, deviceId: string, isActive: boolean, locationLevel: SensorLocationLevel, createdAt: string, updatedAt: string, thresholds?: { __typename?: 'SensorThresholds', min?: number | null | undefined, max?: number | null | undefined, optimal_min?: number | null | undefined, optimal_max?: number | null | undefined } | null | undefined, calibration?: { __typename?: 'SensorCalibration', offset?: number | null | undefined, multiplier?: number | null | undefined, lastCalibrated?: string | null | undefined } | null | undefined }> };

export type GetUserCultivationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserCultivationsQuery = { __typename?: 'Query', getUserCultivations: Array<{ __typename?: 'Cultivation', id: string, plantName: string, variety?: string | null | undefined, growthStage: GrowthStage, plantedDate: string, expectedHarvestDate?: string | null | undefined, notes?: string | null | undefined, createdAt: string, updatedAt: string, garden: { __typename?: 'Garden', id: string, name: string } }> };

export type GetUserSensorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserSensorsQuery = { __typename?: 'Query', getUserSensors: Array<{ __typename?: 'Sensor', id: string, deviceId: string, name: string, type: SensorType, unit: string, locationLevel: SensorLocationLevel, isActive: boolean, mqttTopic: string, connectionToken: string, lastDataReceived?: string | null | undefined, createdAt: string, updatedAt: string, calibration?: { __typename?: 'SensorCalibration', offset?: number | null | undefined, multiplier?: number | null | undefined, lastCalibrated?: string | null | undefined } | null | undefined, thresholds?: { __typename?: 'SensorThresholds', min?: number | null | undefined, max?: number | null | undefined, optimal_min?: number | null | undefined, optimal_max?: number | null | undefined } | null | undefined, garden?: { __typename?: 'Garden', id: string, name: string } | null | undefined, cultivation?: { __typename?: 'Cultivation', id: string, plantName: string } | null | undefined }> };

export type GetSensorQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSensorQuery = { __typename?: 'Query', getSensor: { __typename?: 'Sensor', id: string, deviceId: string, name: string, type: SensorType, unit: string, locationLevel: SensorLocationLevel, isActive: boolean, mqttTopic: string, connectionToken: string, lastDataReceived?: string | null | undefined, createdAt: string, updatedAt: string, calibration?: { __typename?: 'SensorCalibration', offset?: number | null | undefined, multiplier?: number | null | undefined, lastCalibrated?: string | null | undefined } | null | undefined, thresholds?: { __typename?: 'SensorThresholds', min?: number | null | undefined, max?: number | null | undefined, optimal_min?: number | null | undefined, optimal_max?: number | null | undefined } | null | undefined, garden?: { __typename?: 'Garden', id: string, name: string, user: { __typename?: 'User', id: string } } | null | undefined, cultivation?: { __typename?: 'Cultivation', id: string, plantName: string, garden: { __typename?: 'Garden', id: string, name: string, user: { __typename?: 'User', id: string } } } | null | undefined } };

export type GetMqttConnectionInfoQueryVariables = Exact<{
  sensorId: Scalars['ID']['input'];
}>;


export type GetMqttConnectionInfoQuery = { __typename?: 'Query', getMqttConnectionInfo: { __typename?: 'MqttConnectionInfo', host: string, port: number, wsPort: number, dataTopicPublish: string, commandTopicSubscribe: string, statusTopicPublish: string, token: string, keepalive: number, clientIdPrefix: string } };

export type GetSensorDataQueryVariables = Exact<{
  sensorId: Scalars['ID']['input'];
  query: SensorDataQueryInput;
}>;


export type GetSensorDataQuery = { __typename?: 'Query', getSensorData: Array<{ __typename?: 'SensorDataPoint', time: number, value: number, sensorId: string, userId: string }> };

export type GetLatestSensorValueQueryVariables = Exact<{
  sensorId: Scalars['ID']['input'];
}>;


export type GetLatestSensorValueQuery = { __typename?: 'Query', getLatestSensorValue?: { __typename?: 'SensorDataPoint', time: number, value: number, sensorId: string, userId: string } | null | undefined };

export type GetAllGardenSensorsQueryVariables = Exact<{
  gardenId: Scalars['ID']['input'];
}>;


export type GetAllGardenSensorsQuery = { __typename?: 'Query', getGardenSensors: Array<{ __typename?: 'Sensor', id: string, deviceId: string, name: string, type: SensorType, unit: string, locationLevel: SensorLocationLevel, isActive: boolean, mqttTopic: string, lastDataReceived?: string | null | undefined, garden?: { __typename?: 'Garden', id: string, name: string } | null | undefined, cultivation?: { __typename?: 'Cultivation', id: string, plantName: string } | null | undefined }> };

export type GetCultivationSensorsQueryVariables = Exact<{
  cultivationId: Scalars['ID']['input'];
}>;


export type GetCultivationSensorsQuery = { __typename?: 'Query', getCultivationSensors: Array<{ __typename?: 'Sensor', id: string, deviceId: string, name: string, type: SensorType, unit: string, locationLevel: SensorLocationLevel, isActive: boolean, mqttTopic: string, lastDataReceived?: string | null | undefined, cultivation?: { __typename?: 'Cultivation', id: string, plantName: string, garden: { __typename?: 'Garden', id: string, name: string } } | null | undefined }> };


export const LoginUserDocument = gql`
    mutation LoginUser($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    accessToken
    user {
      id
      email
      firstName
      lastName
      fullName
      role
      subscriptionPlan
      isActive
      isEmailVerified
      createdAt
      updatedAt
    }
  }
}
    `;
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const RegisterUserDocument = gql`
    mutation RegisterUser($registerInput: RegisterInput!) {
  register(registerInput: $registerInput) {
    accessToken
    user {
      id
      email
      firstName
      lastName
      fullName
      role
      subscriptionPlan
      isActive
      isEmailVerified
      createdAt
      updatedAt
    }
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      registerInput: // value for 'registerInput'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const LogoutUserDocument = gql`
    mutation LogoutUser {
  logout
}
    `;
export type LogoutUserMutationFn = Apollo.MutationFunction<LogoutUserMutation, LogoutUserMutationVariables>;

/**
 * __useLogoutUserMutation__
 *
 * To run a mutation, you first call `useLogoutUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutUserMutation, { data, loading, error }] = useLogoutUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutUserMutation(baseOptions?: Apollo.MutationHookOptions<LogoutUserMutation, LogoutUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument, options);
      }
export type LogoutUserMutationHookResult = ReturnType<typeof useLogoutUserMutation>;
export type LogoutUserMutationResult = Apollo.MutationResult<LogoutUserMutation>;
export type LogoutUserMutationOptions = Apollo.BaseMutationOptions<LogoutUserMutation, LogoutUserMutationVariables>;
export const CreateGardenDocument = gql`
    mutation CreateGarden($input: CreateGardenInput!) {
  createGarden(input: $input) {
    id
    name
    description
    type
    location {
      address
      latitude
      longitude
    }
    createdAt
    updatedAt
  }
}
    `;
export type CreateGardenMutationFn = Apollo.MutationFunction<CreateGardenMutation, CreateGardenMutationVariables>;

/**
 * __useCreateGardenMutation__
 *
 * To run a mutation, you first call `useCreateGardenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGardenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGardenMutation, { data, loading, error }] = useCreateGardenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGardenMutation(baseOptions?: Apollo.MutationHookOptions<CreateGardenMutation, CreateGardenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGardenMutation, CreateGardenMutationVariables>(CreateGardenDocument, options);
      }
export type CreateGardenMutationHookResult = ReturnType<typeof useCreateGardenMutation>;
export type CreateGardenMutationResult = Apollo.MutationResult<CreateGardenMutation>;
export type CreateGardenMutationOptions = Apollo.BaseMutationOptions<CreateGardenMutation, CreateGardenMutationVariables>;
export const UpdateGardenDocument = gql`
    mutation UpdateGarden($id: ID!, $input: UpdateGardenInput!) {
  updateGarden(id: $id, input: $input) {
    id
    name
    description
    type
    location {
      address
      latitude
      longitude
    }
    createdAt
    updatedAt
  }
}
    `;
export type UpdateGardenMutationFn = Apollo.MutationFunction<UpdateGardenMutation, UpdateGardenMutationVariables>;

/**
 * __useUpdateGardenMutation__
 *
 * To run a mutation, you first call `useUpdateGardenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGardenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGardenMutation, { data, loading, error }] = useUpdateGardenMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateGardenMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGardenMutation, UpdateGardenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateGardenMutation, UpdateGardenMutationVariables>(UpdateGardenDocument, options);
      }
export type UpdateGardenMutationHookResult = ReturnType<typeof useUpdateGardenMutation>;
export type UpdateGardenMutationResult = Apollo.MutationResult<UpdateGardenMutation>;
export type UpdateGardenMutationOptions = Apollo.BaseMutationOptions<UpdateGardenMutation, UpdateGardenMutationVariables>;
export const DeleteGardenDocument = gql`
    mutation DeleteGarden($id: ID!) {
  deleteGarden(id: $id)
}
    `;
export type DeleteGardenMutationFn = Apollo.MutationFunction<DeleteGardenMutation, DeleteGardenMutationVariables>;

/**
 * __useDeleteGardenMutation__
 *
 * To run a mutation, you first call `useDeleteGardenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGardenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGardenMutation, { data, loading, error }] = useDeleteGardenMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteGardenMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGardenMutation, DeleteGardenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteGardenMutation, DeleteGardenMutationVariables>(DeleteGardenDocument, options);
      }
export type DeleteGardenMutationHookResult = ReturnType<typeof useDeleteGardenMutation>;
export type DeleteGardenMutationResult = Apollo.MutationResult<DeleteGardenMutation>;
export type DeleteGardenMutationOptions = Apollo.BaseMutationOptions<DeleteGardenMutation, DeleteGardenMutationVariables>;
export const CreateCultivationDocument = gql`
    mutation CreateCultivation($input: CreateCultivationInput!) {
  createCultivation(input: $input) {
    id
    plantName
    variety
    growthStage
    plantedDate
    expectedHarvestDate
    notes
    garden {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;
export type CreateCultivationMutationFn = Apollo.MutationFunction<CreateCultivationMutation, CreateCultivationMutationVariables>;

/**
 * __useCreateCultivationMutation__
 *
 * To run a mutation, you first call `useCreateCultivationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCultivationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCultivationMutation, { data, loading, error }] = useCreateCultivationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCultivationMutation(baseOptions?: Apollo.MutationHookOptions<CreateCultivationMutation, CreateCultivationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCultivationMutation, CreateCultivationMutationVariables>(CreateCultivationDocument, options);
      }
export type CreateCultivationMutationHookResult = ReturnType<typeof useCreateCultivationMutation>;
export type CreateCultivationMutationResult = Apollo.MutationResult<CreateCultivationMutation>;
export type CreateCultivationMutationOptions = Apollo.BaseMutationOptions<CreateCultivationMutation, CreateCultivationMutationVariables>;
export const UpdateCultivationDocument = gql`
    mutation UpdateCultivation($id: ID!, $input: UpdateCultivationInput!) {
  updateCultivation(id: $id, input: $input) {
    id
    plantName
    variety
    growthStage
    plantedDate
    expectedHarvestDate
    notes
    createdAt
    updatedAt
  }
}
    `;
export type UpdateCultivationMutationFn = Apollo.MutationFunction<UpdateCultivationMutation, UpdateCultivationMutationVariables>;

/**
 * __useUpdateCultivationMutation__
 *
 * To run a mutation, you first call `useUpdateCultivationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCultivationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCultivationMutation, { data, loading, error }] = useUpdateCultivationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCultivationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCultivationMutation, UpdateCultivationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCultivationMutation, UpdateCultivationMutationVariables>(UpdateCultivationDocument, options);
      }
export type UpdateCultivationMutationHookResult = ReturnType<typeof useUpdateCultivationMutation>;
export type UpdateCultivationMutationResult = Apollo.MutationResult<UpdateCultivationMutation>;
export type UpdateCultivationMutationOptions = Apollo.BaseMutationOptions<UpdateCultivationMutation, UpdateCultivationMutationVariables>;
export const DeleteCultivationDocument = gql`
    mutation DeleteCultivation($id: ID!) {
  deleteCultivation(id: $id)
}
    `;
export type DeleteCultivationMutationFn = Apollo.MutationFunction<DeleteCultivationMutation, DeleteCultivationMutationVariables>;

/**
 * __useDeleteCultivationMutation__
 *
 * To run a mutation, you first call `useDeleteCultivationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCultivationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCultivationMutation, { data, loading, error }] = useDeleteCultivationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCultivationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCultivationMutation, DeleteCultivationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCultivationMutation, DeleteCultivationMutationVariables>(DeleteCultivationDocument, options);
      }
export type DeleteCultivationMutationHookResult = ReturnType<typeof useDeleteCultivationMutation>;
export type DeleteCultivationMutationResult = Apollo.MutationResult<DeleteCultivationMutation>;
export type DeleteCultivationMutationOptions = Apollo.BaseMutationOptions<DeleteCultivationMutation, DeleteCultivationMutationVariables>;
export const CreateSensorDocument = gql`
    mutation CreateSensor($input: CreateSensorInput!) {
  createSensor(input: $input) {
    id
    name
    type
    unit
    deviceId
    isActive
    locationLevel
    thresholds {
      min
      max
      optimal_min
      optimal_max
    }
    calibration {
      offset
      multiplier
      lastCalibrated
    }
    garden {
      id
      name
    }
    cultivation {
      id
      plantName
    }
    createdAt
    updatedAt
  }
}
    `;
export type CreateSensorMutationFn = Apollo.MutationFunction<CreateSensorMutation, CreateSensorMutationVariables>;

/**
 * __useCreateSensorMutation__
 *
 * To run a mutation, you first call `useCreateSensorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSensorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSensorMutation, { data, loading, error }] = useCreateSensorMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSensorMutation(baseOptions?: Apollo.MutationHookOptions<CreateSensorMutation, CreateSensorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSensorMutation, CreateSensorMutationVariables>(CreateSensorDocument, options);
      }
export type CreateSensorMutationHookResult = ReturnType<typeof useCreateSensorMutation>;
export type CreateSensorMutationResult = Apollo.MutationResult<CreateSensorMutation>;
export type CreateSensorMutationOptions = Apollo.BaseMutationOptions<CreateSensorMutation, CreateSensorMutationVariables>;
export const UpdateSensorDocument = gql`
    mutation UpdateSensor($id: ID!, $input: UpdateSensorInput!) {
  updateSensor(id: $id, input: $input) {
    id
    name
    type
    unit
    deviceId
    isActive
    locationLevel
    thresholds {
      min
      max
      optimal_min
      optimal_max
    }
    calibration {
      offset
      multiplier
      lastCalibrated
    }
    createdAt
    updatedAt
  }
}
    `;
export type UpdateSensorMutationFn = Apollo.MutationFunction<UpdateSensorMutation, UpdateSensorMutationVariables>;

/**
 * __useUpdateSensorMutation__
 *
 * To run a mutation, you first call `useUpdateSensorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSensorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSensorMutation, { data, loading, error }] = useUpdateSensorMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSensorMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSensorMutation, UpdateSensorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSensorMutation, UpdateSensorMutationVariables>(UpdateSensorDocument, options);
      }
export type UpdateSensorMutationHookResult = ReturnType<typeof useUpdateSensorMutation>;
export type UpdateSensorMutationResult = Apollo.MutationResult<UpdateSensorMutation>;
export type UpdateSensorMutationOptions = Apollo.BaseMutationOptions<UpdateSensorMutation, UpdateSensorMutationVariables>;
export const DeleteSensorDocument = gql`
    mutation DeleteSensor($id: ID!) {
  deleteSensor(id: $id)
}
    `;
export type DeleteSensorMutationFn = Apollo.MutationFunction<DeleteSensorMutation, DeleteSensorMutationVariables>;

/**
 * __useDeleteSensorMutation__
 *
 * To run a mutation, you first call `useDeleteSensorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSensorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSensorMutation, { data, loading, error }] = useDeleteSensorMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSensorMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSensorMutation, DeleteSensorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSensorMutation, DeleteSensorMutationVariables>(DeleteSensorDocument, options);
      }
export type DeleteSensorMutationHookResult = ReturnType<typeof useDeleteSensorMutation>;
export type DeleteSensorMutationResult = Apollo.MutationResult<DeleteSensorMutation>;
export type DeleteSensorMutationOptions = Apollo.BaseMutationOptions<DeleteSensorMutation, DeleteSensorMutationVariables>;
export const CreateNewSensorDocument = gql`
    mutation CreateNewSensor($input: CreateSensorInput!) {
  createSensor(input: $input) {
    id
    deviceId
    name
    type
    unit
    locationLevel
    isActive
    mqttTopic
    connectionToken
    lastDataReceived
    calibration {
      offset
      multiplier
      lastCalibrated
    }
    thresholds {
      min
      max
      optimal_min
      optimal_max
    }
    garden {
      id
      name
    }
    cultivation {
      id
      plantName
    }
    createdAt
    updatedAt
  }
}
    `;
export type CreateNewSensorMutationFn = Apollo.MutationFunction<CreateNewSensorMutation, CreateNewSensorMutationVariables>;

/**
 * __useCreateNewSensorMutation__
 *
 * To run a mutation, you first call `useCreateNewSensorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNewSensorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNewSensorMutation, { data, loading, error }] = useCreateNewSensorMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNewSensorMutation(baseOptions?: Apollo.MutationHookOptions<CreateNewSensorMutation, CreateNewSensorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNewSensorMutation, CreateNewSensorMutationVariables>(CreateNewSensorDocument, options);
      }
export type CreateNewSensorMutationHookResult = ReturnType<typeof useCreateNewSensorMutation>;
export type CreateNewSensorMutationResult = Apollo.MutationResult<CreateNewSensorMutation>;
export type CreateNewSensorMutationOptions = Apollo.BaseMutationOptions<CreateNewSensorMutation, CreateNewSensorMutationVariables>;
export const UpdateExistingSensorDocument = gql`
    mutation UpdateExistingSensor($id: ID!, $input: UpdateSensorInput!) {
  updateSensor(id: $id, input: $input) {
    id
    deviceId
    name
    type
    unit
    locationLevel
    isActive
    mqttTopic
    connectionToken
    lastDataReceived
    calibration {
      offset
      multiplier
      lastCalibrated
    }
    thresholds {
      min
      max
      optimal_min
      optimal_max
    }
    garden {
      id
      name
    }
    cultivation {
      id
      plantName
    }
    createdAt
    updatedAt
  }
}
    `;
export type UpdateExistingSensorMutationFn = Apollo.MutationFunction<UpdateExistingSensorMutation, UpdateExistingSensorMutationVariables>;

/**
 * __useUpdateExistingSensorMutation__
 *
 * To run a mutation, you first call `useUpdateExistingSensorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExistingSensorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExistingSensorMutation, { data, loading, error }] = useUpdateExistingSensorMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateExistingSensorMutation(baseOptions?: Apollo.MutationHookOptions<UpdateExistingSensorMutation, UpdateExistingSensorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExistingSensorMutation, UpdateExistingSensorMutationVariables>(UpdateExistingSensorDocument, options);
      }
export type UpdateExistingSensorMutationHookResult = ReturnType<typeof useUpdateExistingSensorMutation>;
export type UpdateExistingSensorMutationResult = Apollo.MutationResult<UpdateExistingSensorMutation>;
export type UpdateExistingSensorMutationOptions = Apollo.BaseMutationOptions<UpdateExistingSensorMutation, UpdateExistingSensorMutationVariables>;
export const SendSensorCommandDocument = gql`
    mutation SendSensorCommand($sensorId: ID!, $input: SendCommandInput!) {
  sendSensorCommand(sensorId: $sensorId, input: $input)
}
    `;
export type SendSensorCommandMutationFn = Apollo.MutationFunction<SendSensorCommandMutation, SendSensorCommandMutationVariables>;

/**
 * __useSendSensorCommandMutation__
 *
 * To run a mutation, you first call `useSendSensorCommandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendSensorCommandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendSensorCommandMutation, { data, loading, error }] = useSendSensorCommandMutation({
 *   variables: {
 *      sensorId: // value for 'sensorId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendSensorCommandMutation(baseOptions?: Apollo.MutationHookOptions<SendSensorCommandMutation, SendSensorCommandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendSensorCommandMutation, SendSensorCommandMutationVariables>(SendSensorCommandDocument, options);
      }
export type SendSensorCommandMutationHookResult = ReturnType<typeof useSendSensorCommandMutation>;
export type SendSensorCommandMutationResult = Apollo.MutationResult<SendSensorCommandMutation>;
export type SendSensorCommandMutationOptions = Apollo.BaseMutationOptions<SendSensorCommandMutation, SendSensorCommandMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    firstName
    lastName
    fullName
    role
    subscriptionPlan
    isActive
    isEmailVerified
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($id: String!) {
  user(id: $id) {
    id
    email
    firstName
    lastName
    fullName
    role
    subscriptionPlan
    isActive
    isEmailVerified
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables> & ({ variables: GetUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers {
  users {
    id
    email
    firstName
    lastName
    fullName
    role
    subscriptionPlan
    isActive
    isEmailVerified
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export function useGetUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersSuspenseQueryHookResult = ReturnType<typeof useGetUsersSuspenseQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserGardensDocument = gql`
    query GetUserGardens {
  getUserGardens {
    id
    name
    description
    type
    location {
      address
      latitude
      longitude
    }
    cultivations {
      id
      plantName
      variety
      growthStage
      plantedDate
      expectedHarvestDate
      notes
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserGardensQuery__
 *
 * To run a query within a React component, call `useGetUserGardensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserGardensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserGardensQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserGardensQuery(baseOptions?: Apollo.QueryHookOptions<GetUserGardensQuery, GetUserGardensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserGardensQuery, GetUserGardensQueryVariables>(GetUserGardensDocument, options);
      }
export function useGetUserGardensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserGardensQuery, GetUserGardensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserGardensQuery, GetUserGardensQueryVariables>(GetUserGardensDocument, options);
        }
export function useGetUserGardensSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserGardensQuery, GetUserGardensQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserGardensQuery, GetUserGardensQueryVariables>(GetUserGardensDocument, options);
        }
export type GetUserGardensQueryHookResult = ReturnType<typeof useGetUserGardensQuery>;
export type GetUserGardensLazyQueryHookResult = ReturnType<typeof useGetUserGardensLazyQuery>;
export type GetUserGardensSuspenseQueryHookResult = ReturnType<typeof useGetUserGardensSuspenseQuery>;
export type GetUserGardensQueryResult = Apollo.QueryResult<GetUserGardensQuery, GetUserGardensQueryVariables>;
export const GetGardenDocument = gql`
    query GetGarden($id: ID!) {
  getGarden(id: $id) {
    id
    name
    description
    type
    location {
      address
      latitude
      longitude
    }
    cultivations {
      id
      plantName
      variety
      growthStage
      plantedDate
      expectedHarvestDate
      notes
    }
    sensors {
      id
      name
      type
      unit
      deviceId
      isActive
      locationLevel
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetGardenQuery__
 *
 * To run a query within a React component, call `useGetGardenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGardenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGardenQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetGardenQuery(baseOptions: Apollo.QueryHookOptions<GetGardenQuery, GetGardenQueryVariables> & ({ variables: GetGardenQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGardenQuery, GetGardenQueryVariables>(GetGardenDocument, options);
      }
export function useGetGardenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGardenQuery, GetGardenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGardenQuery, GetGardenQueryVariables>(GetGardenDocument, options);
        }
export function useGetGardenSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGardenQuery, GetGardenQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGardenQuery, GetGardenQueryVariables>(GetGardenDocument, options);
        }
export type GetGardenQueryHookResult = ReturnType<typeof useGetGardenQuery>;
export type GetGardenLazyQueryHookResult = ReturnType<typeof useGetGardenLazyQuery>;
export type GetGardenSuspenseQueryHookResult = ReturnType<typeof useGetGardenSuspenseQuery>;
export type GetGardenQueryResult = Apollo.QueryResult<GetGardenQuery, GetGardenQueryVariables>;
export const GetGardenSensorsDocument = gql`
    query GetGardenSensors($gardenId: ID!) {
  getGardenSensors(gardenId: $gardenId) {
    id
    name
    type
    unit
    deviceId
    isActive
    locationLevel
    thresholds {
      min
      max
      optimal_min
      optimal_max
    }
    calibration {
      offset
      multiplier
      lastCalibrated
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetGardenSensorsQuery__
 *
 * To run a query within a React component, call `useGetGardenSensorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGardenSensorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGardenSensorsQuery({
 *   variables: {
 *      gardenId: // value for 'gardenId'
 *   },
 * });
 */
export function useGetGardenSensorsQuery(baseOptions: Apollo.QueryHookOptions<GetGardenSensorsQuery, GetGardenSensorsQueryVariables> & ({ variables: GetGardenSensorsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGardenSensorsQuery, GetGardenSensorsQueryVariables>(GetGardenSensorsDocument, options);
      }
export function useGetGardenSensorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGardenSensorsQuery, GetGardenSensorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGardenSensorsQuery, GetGardenSensorsQueryVariables>(GetGardenSensorsDocument, options);
        }
export function useGetGardenSensorsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGardenSensorsQuery, GetGardenSensorsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGardenSensorsQuery, GetGardenSensorsQueryVariables>(GetGardenSensorsDocument, options);
        }
export type GetGardenSensorsQueryHookResult = ReturnType<typeof useGetGardenSensorsQuery>;
export type GetGardenSensorsLazyQueryHookResult = ReturnType<typeof useGetGardenSensorsLazyQuery>;
export type GetGardenSensorsSuspenseQueryHookResult = ReturnType<typeof useGetGardenSensorsSuspenseQuery>;
export type GetGardenSensorsQueryResult = Apollo.QueryResult<GetGardenSensorsQuery, GetGardenSensorsQueryVariables>;
export const GetUserCultivationsDocument = gql`
    query GetUserCultivations {
  getUserCultivations {
    id
    plantName
    variety
    growthStage
    plantedDate
    expectedHarvestDate
    notes
    garden {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserCultivationsQuery__
 *
 * To run a query within a React component, call `useGetUserCultivationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserCultivationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserCultivationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserCultivationsQuery(baseOptions?: Apollo.QueryHookOptions<GetUserCultivationsQuery, GetUserCultivationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserCultivationsQuery, GetUserCultivationsQueryVariables>(GetUserCultivationsDocument, options);
      }
export function useGetUserCultivationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserCultivationsQuery, GetUserCultivationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserCultivationsQuery, GetUserCultivationsQueryVariables>(GetUserCultivationsDocument, options);
        }
export function useGetUserCultivationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserCultivationsQuery, GetUserCultivationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserCultivationsQuery, GetUserCultivationsQueryVariables>(GetUserCultivationsDocument, options);
        }
export type GetUserCultivationsQueryHookResult = ReturnType<typeof useGetUserCultivationsQuery>;
export type GetUserCultivationsLazyQueryHookResult = ReturnType<typeof useGetUserCultivationsLazyQuery>;
export type GetUserCultivationsSuspenseQueryHookResult = ReturnType<typeof useGetUserCultivationsSuspenseQuery>;
export type GetUserCultivationsQueryResult = Apollo.QueryResult<GetUserCultivationsQuery, GetUserCultivationsQueryVariables>;
export const GetUserSensorsDocument = gql`
    query GetUserSensors {
  getUserSensors {
    id
    deviceId
    name
    type
    unit
    locationLevel
    isActive
    mqttTopic
    connectionToken
    lastDataReceived
    calibration {
      offset
      multiplier
      lastCalibrated
    }
    thresholds {
      min
      max
      optimal_min
      optimal_max
    }
    garden {
      id
      name
    }
    cultivation {
      id
      plantName
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserSensorsQuery__
 *
 * To run a query within a React component, call `useGetUserSensorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserSensorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserSensorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserSensorsQuery(baseOptions?: Apollo.QueryHookOptions<GetUserSensorsQuery, GetUserSensorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserSensorsQuery, GetUserSensorsQueryVariables>(GetUserSensorsDocument, options);
      }
export function useGetUserSensorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserSensorsQuery, GetUserSensorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserSensorsQuery, GetUserSensorsQueryVariables>(GetUserSensorsDocument, options);
        }
export function useGetUserSensorsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserSensorsQuery, GetUserSensorsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserSensorsQuery, GetUserSensorsQueryVariables>(GetUserSensorsDocument, options);
        }
export type GetUserSensorsQueryHookResult = ReturnType<typeof useGetUserSensorsQuery>;
export type GetUserSensorsLazyQueryHookResult = ReturnType<typeof useGetUserSensorsLazyQuery>;
export type GetUserSensorsSuspenseQueryHookResult = ReturnType<typeof useGetUserSensorsSuspenseQuery>;
export type GetUserSensorsQueryResult = Apollo.QueryResult<GetUserSensorsQuery, GetUserSensorsQueryVariables>;
export const GetSensorDocument = gql`
    query GetSensor($id: ID!) {
  getSensor(id: $id) {
    id
    deviceId
    name
    type
    unit
    locationLevel
    isActive
    mqttTopic
    connectionToken
    lastDataReceived
    calibration {
      offset
      multiplier
      lastCalibrated
    }
    thresholds {
      min
      max
      optimal_min
      optimal_max
    }
    garden {
      id
      name
      user {
        id
      }
    }
    cultivation {
      id
      plantName
      garden {
        id
        name
        user {
          id
        }
      }
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetSensorQuery__
 *
 * To run a query within a React component, call `useGetSensorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSensorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSensorQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSensorQuery(baseOptions: Apollo.QueryHookOptions<GetSensorQuery, GetSensorQueryVariables> & ({ variables: GetSensorQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSensorQuery, GetSensorQueryVariables>(GetSensorDocument, options);
      }
export function useGetSensorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSensorQuery, GetSensorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSensorQuery, GetSensorQueryVariables>(GetSensorDocument, options);
        }
export function useGetSensorSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSensorQuery, GetSensorQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSensorQuery, GetSensorQueryVariables>(GetSensorDocument, options);
        }
export type GetSensorQueryHookResult = ReturnType<typeof useGetSensorQuery>;
export type GetSensorLazyQueryHookResult = ReturnType<typeof useGetSensorLazyQuery>;
export type GetSensorSuspenseQueryHookResult = ReturnType<typeof useGetSensorSuspenseQuery>;
export type GetSensorQueryResult = Apollo.QueryResult<GetSensorQuery, GetSensorQueryVariables>;
export const GetMqttConnectionInfoDocument = gql`
    query GetMqttConnectionInfo($sensorId: ID!) {
  getMqttConnectionInfo(sensorId: $sensorId) {
    host
    port
    wsPort
    dataTopicPublish
    commandTopicSubscribe
    statusTopicPublish
    token
    keepalive
    clientIdPrefix
  }
}
    `;

/**
 * __useGetMqttConnectionInfoQuery__
 *
 * To run a query within a React component, call `useGetMqttConnectionInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMqttConnectionInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMqttConnectionInfoQuery({
 *   variables: {
 *      sensorId: // value for 'sensorId'
 *   },
 * });
 */
export function useGetMqttConnectionInfoQuery(baseOptions: Apollo.QueryHookOptions<GetMqttConnectionInfoQuery, GetMqttConnectionInfoQueryVariables> & ({ variables: GetMqttConnectionInfoQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMqttConnectionInfoQuery, GetMqttConnectionInfoQueryVariables>(GetMqttConnectionInfoDocument, options);
      }
export function useGetMqttConnectionInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMqttConnectionInfoQuery, GetMqttConnectionInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMqttConnectionInfoQuery, GetMqttConnectionInfoQueryVariables>(GetMqttConnectionInfoDocument, options);
        }
export function useGetMqttConnectionInfoSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMqttConnectionInfoQuery, GetMqttConnectionInfoQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMqttConnectionInfoQuery, GetMqttConnectionInfoQueryVariables>(GetMqttConnectionInfoDocument, options);
        }
export type GetMqttConnectionInfoQueryHookResult = ReturnType<typeof useGetMqttConnectionInfoQuery>;
export type GetMqttConnectionInfoLazyQueryHookResult = ReturnType<typeof useGetMqttConnectionInfoLazyQuery>;
export type GetMqttConnectionInfoSuspenseQueryHookResult = ReturnType<typeof useGetMqttConnectionInfoSuspenseQuery>;
export type GetMqttConnectionInfoQueryResult = Apollo.QueryResult<GetMqttConnectionInfoQuery, GetMqttConnectionInfoQueryVariables>;
export const GetSensorDataDocument = gql`
    query GetSensorData($sensorId: ID!, $query: SensorDataQueryInput!) {
  getSensorData(sensorId: $sensorId, query: $query) {
    time
    value
    sensorId
    userId
  }
}
    `;

/**
 * __useGetSensorDataQuery__
 *
 * To run a query within a React component, call `useGetSensorDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSensorDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSensorDataQuery({
 *   variables: {
 *      sensorId: // value for 'sensorId'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useGetSensorDataQuery(baseOptions: Apollo.QueryHookOptions<GetSensorDataQuery, GetSensorDataQueryVariables> & ({ variables: GetSensorDataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSensorDataQuery, GetSensorDataQueryVariables>(GetSensorDataDocument, options);
      }
export function useGetSensorDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSensorDataQuery, GetSensorDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSensorDataQuery, GetSensorDataQueryVariables>(GetSensorDataDocument, options);
        }
export function useGetSensorDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSensorDataQuery, GetSensorDataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSensorDataQuery, GetSensorDataQueryVariables>(GetSensorDataDocument, options);
        }
export type GetSensorDataQueryHookResult = ReturnType<typeof useGetSensorDataQuery>;
export type GetSensorDataLazyQueryHookResult = ReturnType<typeof useGetSensorDataLazyQuery>;
export type GetSensorDataSuspenseQueryHookResult = ReturnType<typeof useGetSensorDataSuspenseQuery>;
export type GetSensorDataQueryResult = Apollo.QueryResult<GetSensorDataQuery, GetSensorDataQueryVariables>;
export const GetLatestSensorValueDocument = gql`
    query GetLatestSensorValue($sensorId: ID!) {
  getLatestSensorValue(sensorId: $sensorId) {
    time
    value
    sensorId
    userId
  }
}
    `;

/**
 * __useGetLatestSensorValueQuery__
 *
 * To run a query within a React component, call `useGetLatestSensorValueQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLatestSensorValueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLatestSensorValueQuery({
 *   variables: {
 *      sensorId: // value for 'sensorId'
 *   },
 * });
 */
export function useGetLatestSensorValueQuery(baseOptions: Apollo.QueryHookOptions<GetLatestSensorValueQuery, GetLatestSensorValueQueryVariables> & ({ variables: GetLatestSensorValueQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLatestSensorValueQuery, GetLatestSensorValueQueryVariables>(GetLatestSensorValueDocument, options);
      }
export function useGetLatestSensorValueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLatestSensorValueQuery, GetLatestSensorValueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLatestSensorValueQuery, GetLatestSensorValueQueryVariables>(GetLatestSensorValueDocument, options);
        }
export function useGetLatestSensorValueSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLatestSensorValueQuery, GetLatestSensorValueQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLatestSensorValueQuery, GetLatestSensorValueQueryVariables>(GetLatestSensorValueDocument, options);
        }
export type GetLatestSensorValueQueryHookResult = ReturnType<typeof useGetLatestSensorValueQuery>;
export type GetLatestSensorValueLazyQueryHookResult = ReturnType<typeof useGetLatestSensorValueLazyQuery>;
export type GetLatestSensorValueSuspenseQueryHookResult = ReturnType<typeof useGetLatestSensorValueSuspenseQuery>;
export type GetLatestSensorValueQueryResult = Apollo.QueryResult<GetLatestSensorValueQuery, GetLatestSensorValueQueryVariables>;
export const GetAllGardenSensorsDocument = gql`
    query GetAllGardenSensors($gardenId: ID!) {
  getGardenSensors(gardenId: $gardenId) {
    id
    deviceId
    name
    type
    unit
    locationLevel
    isActive
    mqttTopic
    lastDataReceived
    garden {
      id
      name
    }
    cultivation {
      id
      plantName
    }
  }
}
    `;

/**
 * __useGetAllGardenSensorsQuery__
 *
 * To run a query within a React component, call `useGetAllGardenSensorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllGardenSensorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllGardenSensorsQuery({
 *   variables: {
 *      gardenId: // value for 'gardenId'
 *   },
 * });
 */
export function useGetAllGardenSensorsQuery(baseOptions: Apollo.QueryHookOptions<GetAllGardenSensorsQuery, GetAllGardenSensorsQueryVariables> & ({ variables: GetAllGardenSensorsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllGardenSensorsQuery, GetAllGardenSensorsQueryVariables>(GetAllGardenSensorsDocument, options);
      }
export function useGetAllGardenSensorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllGardenSensorsQuery, GetAllGardenSensorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllGardenSensorsQuery, GetAllGardenSensorsQueryVariables>(GetAllGardenSensorsDocument, options);
        }
export function useGetAllGardenSensorsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllGardenSensorsQuery, GetAllGardenSensorsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllGardenSensorsQuery, GetAllGardenSensorsQueryVariables>(GetAllGardenSensorsDocument, options);
        }
export type GetAllGardenSensorsQueryHookResult = ReturnType<typeof useGetAllGardenSensorsQuery>;
export type GetAllGardenSensorsLazyQueryHookResult = ReturnType<typeof useGetAllGardenSensorsLazyQuery>;
export type GetAllGardenSensorsSuspenseQueryHookResult = ReturnType<typeof useGetAllGardenSensorsSuspenseQuery>;
export type GetAllGardenSensorsQueryResult = Apollo.QueryResult<GetAllGardenSensorsQuery, GetAllGardenSensorsQueryVariables>;
export const GetCultivationSensorsDocument = gql`
    query GetCultivationSensors($cultivationId: ID!) {
  getCultivationSensors(cultivationId: $cultivationId) {
    id
    deviceId
    name
    type
    unit
    locationLevel
    isActive
    mqttTopic
    lastDataReceived
    cultivation {
      id
      plantName
      garden {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetCultivationSensorsQuery__
 *
 * To run a query within a React component, call `useGetCultivationSensorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCultivationSensorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCultivationSensorsQuery({
 *   variables: {
 *      cultivationId: // value for 'cultivationId'
 *   },
 * });
 */
export function useGetCultivationSensorsQuery(baseOptions: Apollo.QueryHookOptions<GetCultivationSensorsQuery, GetCultivationSensorsQueryVariables> & ({ variables: GetCultivationSensorsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCultivationSensorsQuery, GetCultivationSensorsQueryVariables>(GetCultivationSensorsDocument, options);
      }
export function useGetCultivationSensorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCultivationSensorsQuery, GetCultivationSensorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCultivationSensorsQuery, GetCultivationSensorsQueryVariables>(GetCultivationSensorsDocument, options);
        }
export function useGetCultivationSensorsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCultivationSensorsQuery, GetCultivationSensorsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCultivationSensorsQuery, GetCultivationSensorsQueryVariables>(GetCultivationSensorsDocument, options);
        }
export type GetCultivationSensorsQueryHookResult = ReturnType<typeof useGetCultivationSensorsQuery>;
export type GetCultivationSensorsLazyQueryHookResult = ReturnType<typeof useGetCultivationSensorsLazyQuery>;
export type GetCultivationSensorsSuspenseQueryHookResult = ReturnType<typeof useGetCultivationSensorsSuspenseQuery>;
export type GetCultivationSensorsQueryResult = Apollo.QueryResult<GetCultivationSensorsQuery, GetCultivationSensorsQueryVariables>;