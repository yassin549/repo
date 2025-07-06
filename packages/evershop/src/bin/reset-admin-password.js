import { update } from '@evershop/postgres-query-builder';
import enquirer from 'enquirer';
import dotenv from 'dotenv';

dotenv.config();
import { pool } from '@evershop/evershop/lib/postgres/connection';
import { hashPassword } from '@evershop/evershop/lib/util/passwordHelper';
import { error, success } from '@evershop/evershop/lib/log';

async function resetAdminPassword() {
  console.log('Admin Password Reset');
  const questions = [
    {
      type: 'input',
      name: 'email',
      message: 'Enter the admin email address:'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter the new password:'
    }
  ];

  try {
    const { email, password } = await enquirer.prompt(questions);
    if (!email || !password) {
      console.log('Email and password are required. Aborting.');
      process.exit(0);
    }

    const hashedPassword = hashPassword(password);

    await update('admin_user')
      .given({ password: hashedPassword })
      .where('email', '=', email)
      .execute(pool);

    success(`Successfully updated the password for ${email}. You can now log in with the new password.`);
    process.exit(0);
  } catch (e) {
    error('An error occurred while resetting the password:');
    error(e);
    process.exit(1);
  }
}

resetAdminPassword();
