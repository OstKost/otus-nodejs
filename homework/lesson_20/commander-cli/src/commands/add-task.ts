import inquirer from 'inquirer';
import {Task} from '../types.js';
import {createTask} from "../db.js";

type Options = { title?: string, description?: string }
type Payload = { title: string, description?: string }

export async function addTaskCommand(options?: Options): Promise<void> {
    let title = options?.title;
    let description = options?.description;
    if (!title || !description) {
        const answers = await inquirer.prompt<Payload>([
            {
                type: 'input',
                name: 'title',
                message: 'Enter task title:',
                default: title,
                validate: (value: string) => value.length > 0 || 'Please enter title'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Enter task description:',
                default: description
            }
        ]);
        title = answers.title;
        description = answers.description || '';
    }

    const task: Task = {
        id: Date.now(),
        title,
        description,
        createdAt: new Date(),
        completedAt: null
    };

    await createTask(task);

    console.log(`Task with id ${task.id} has been added.`);
}
