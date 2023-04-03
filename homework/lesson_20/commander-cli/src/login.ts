import inquirer from 'inquirer';
import {getUser} from "./db.js";

export async function login(): Promise<void> {
    const {login, password} = await inquirer.prompt([
        {
            type: 'input',
            name: 'login',
            message: 'Enter your login:',
            validate: (value: string) => value.length > 0 || 'Please enter your login'
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter your password:',
            validate: (value: string) => value.length > 0 || 'Please enter your password'
        }
    ]);

    const user = await getUser(login);
    const access = !!user && user.password === password;

    if (!access) {
        console.error('Invalid credentials.');
        process.exit(1);
    }
}