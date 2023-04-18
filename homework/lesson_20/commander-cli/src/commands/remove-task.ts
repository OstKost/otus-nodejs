import inquirer from 'inquirer';
import {deleteTask, getAllTasks} from "../db.js";
import {Task} from "../types.js";

export async function removeTaskCommand(options?: { id?: number }): Promise<void> {
    let taskId = options?.id;
    if (!taskId) {
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
        taskId = task.id;
    }

    const tasks = await getAllTasks();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
        console.log(`Task with id ${taskId} not found.`);
        return;
    }

    const {confirm} = await inquirer.prompt<{ confirm: boolean }>([
        {
            type: 'confirm',
            name: 'confirm',
            message: `Deleting task ${taskId}. Are you sure?`,
        }
    ]);

    if (!confirm) return;

    await deleteTask(taskId);

    console.log(`Task with id ${taskId} has been removed.`);
}
