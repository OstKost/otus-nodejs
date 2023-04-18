import inquirer from "inquirer";
import {listTasksCommand} from "./list-tasks.js";
import {addTaskCommand} from "./add-task.js";
import {editTaskCommand} from "./edit-task.js";
import {removeTaskCommand} from "./remove-task.js";

export enum Command {
    ListTask = 'list-task',
    AddTask = 'add-task',
    EditTask = 'edit-task',
    DeleteTask = 'delete-task',
}

export async function commandsMenuCommand(): Promise<void> {
    const {command} = await inquirer.prompt<{ command: Command }>([
        {
            type: 'list',
            name: 'command',
            message: 'Select command:',
            choices: [
                {name: 'Show all tasks', value: Command.ListTask},
                {name: 'Add task', value: Command.AddTask},
                {name: 'Edit task', value: Command.EditTask},
                {name: 'Delete task', value: Command.DeleteTask},
            ],
        },
    ]);

    switch (command) {
        case Command.ListTask:
            await listTasksCommand();
            break;
        case Command.AddTask:
            await addTaskCommand();
            break;
        case Command.EditTask:
            await editTaskCommand();
            break;
        case Command.DeleteTask:
            await removeTaskCommand();
            break;
    }
}

