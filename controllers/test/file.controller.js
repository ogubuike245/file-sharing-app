// TESTS COMING SOON 

const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Token = require('../models/token');
const { generateOTP } = require('../utils/auth');

describe('POST /api/v1/register', () => {
  let newUser, token;

  beforeEach(async () => {
    await User.deleteMany();
    await Token.deleteMany();

    newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      registrationNumber: '123456789',
      selectedCourse: 'Maths',
      phoneNumber: '0123456789'
    };

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    token = new Token({
      value: hashedOtp,
      user: newUser._id
    });

    await token.save();
  });

  afterAll(async () => {
    // await User.deleteMany();
    // await Token.deleteMany();
  });

  test('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/register')
      .send(newUser)
      .expect(302);

    expect(response.header.location).toMatch(/\/api\/v1\/auth\/verify\/.+/);

    const user = await User.findOne({ email: newUser.email });

    expect(user).toBeDefined();
    expect(user.isVerified).toBe(false);

    const token = await Token.findOne({ user: user._id });

    expect(token).toBeDefined();
    expect(await bcrypt.compare(otp, token.value)).toBe(true);
  });

  test('should return an error when required fields are missing', async () => {
    delete newUser.firstName;

    const response = await request(app)
      .post('/api/v1/register')
      .send(newUser)
      .expect(400);

    expect(response.body.message).toBe('Missing required fields');
  });

  // 
});
