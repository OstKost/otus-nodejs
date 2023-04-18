import inquirer from 'inquirer';
import {getAllTasks, updateTask} from "../db.js";
import {Task} from "../types.js";

type Answers = {
    title: string,
    description: string,
    completed: boolean
}

export async function editTaskCommand(): Promise<void> {
    const tasks = await getAllTasks();

    const choices = tasks.map((task) => ({
        name: task.title,
        value: task,
    }));

    const {task} = await inquirer.prompt<{ task: Task }>([
        {
            type: 'list',
            name: 'task',
            message: 'Select task from list:',
            choices,
        }
    ]);

    const {title, description, completed} = await inquirer.prompt<Answers>([
        {
            type: 'input',
            name: 'title',
            message: 'Enter new task title:',
            default: task.title
        },
        {
            type: 'input',
            name: 'description',
            message: 'Enter new task description:',
            default: task.description
        },
        {
            type: 'confirm',
            name: 'completed',
            message: 'Is the task completed?',
            default: !!task.completedAt
        }
    ]);

    const payload = {
        title,
        description,
        completedAt: completed ? new Date() : null,
    }

    await updateTask(task.id, payload);

    console.log(`Task with id ${task.id} has been updated.`);
}
