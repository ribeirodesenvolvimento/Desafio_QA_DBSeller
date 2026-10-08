import { faker } from '@faker-js/faker';

export interface CandidateData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
}

export function createCandidate(): CandidateData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    firstName,
    middleName: 'QA',
    lastName,
    email: faker.internet.email({
      firstName,
      lastName,
      provider: 'example.com',
    }).toLowerCase(),
  };
}
