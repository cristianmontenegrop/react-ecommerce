import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'admin User',
    email: 'theadmin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: ' Jim Frett',
    email: 'j.frettn@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Mr. Hankey',
    email: 'hankey@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;
