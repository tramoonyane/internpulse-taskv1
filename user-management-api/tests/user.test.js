const request = require('supertest');
const app = require('../src/app');
const { startDatabase, stopDatabase } = require('../src/config/db');
const User = require('../src/models/user.model');

beforeAll(async () => {
  await startDatabase();
});

beforeEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await stopDatabase();
});

describe('User API', () => {
  
  // Test for creating a new user
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'john.doe@example.com', age: 30 })
      .expect(201);

    expect(response.body.name).toBe('John Doe');
  });

  // Test for retrieving all users
  it('should get all users', async () => {
    await new User({ name: 'John Doe' }).save();
    await new User({ name: 'Jane Doe' }).save();

    const response = await request(app)
      .get('/api/users')
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe('John Doe');
    expect(response.body[1].name).toBe('Jane Doe');
  });

  // Test for retrieving a user by ID
  it('should get a user by ID', async () => {
    const user = await new User({ name: 'John Doe' }).save();

    const response = await request(app)
      .get(`/api/users/${user._id}`)
      .expect(200);

    expect(response.body.name).toBe('John Doe');
  });

  // Test for updating a user by ID
  it('should update a user by ID', async () => {
    const user = await new User({ name: 'John Doe' }).save();

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ name: 'John Updated' })
      .expect(200);

    expect(response.body.name).toBe('John Updated');
  });

  // Test for deleting a user by ID
  it('should delete a user by ID', async () => {
    const user = await new User({ name: 'John Doe' }).save();

    await request(app)
      .delete(`/api/users/${user._id}`)
      .expect(204);

    const usersAfterDeletion = await User.find();
    expect(usersAfterDeletion).toHaveLength(0);
  });

  // Test for getting a non-existing user by ID
  it('should return 404 if user not found', async () => {
    const nonExistingId = '60c72b2f4f1a2c001c8d3e99'; // A random MongoDB ObjectID

    await request(app)
      .get(`/api/users/${nonExistingId}`)
      .expect(404);
  });

  // Test for updating a non-existing user by ID
  it('should return 404 if user to update is not found', async () => {
    const nonExistingId = '60c72b2f4f1a2c001c8d3e99'; // A random MongoDB ObjectID

    await request(app)
      .put(`/api/users/${nonExistingId}`)
      .send({ name: 'Updated Name' })
      .expect(404);
  });

  // Test for deleting a non-existing user by ID
  it('should return 404 if user to delete is not found', async () => {
    const nonExistingId = '60c72b2f4f1a2c001c8d3e99'; // A random MongoDB ObjectID

    await request(app)
      .delete(`/api/users/${nonExistingId}`)
      .expect(404);
  });

  // Test for creating a user with missing required fields
  it('should return 400 if required fields are missing', async () => {
    await request(app)
      .post('/api/users')
      .send({}) // Sending an empty object
      .expect(400);
  });

});
