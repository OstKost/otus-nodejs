import {Command} from 'commander';
import {addTaskCommand} from "./commands/add-task.js";
import {editTaskCommand} from "./commands/edit-task.js";
import {removeTaskCommand} from "./commands/remove-task.js";
import {listTasksCommand} from "./commands/list-tasks.js";
import {commandsMenuCommand} from "./commands/commands-menu.js";

const program = new Command();

program
    .name('todo-cli')
    .version('1.0.0')

program
    .command('add')
    .description('Add a task')
    .option('-t, --title <string>', 'Task title')
    .option('-d, --description <string>', 'Task description')
    .action(addTaskCommand);

program
    .command('edit')
    .description('Edit a task')
    .action(editTaskCommand);

program
    .command('remove')
    .description('Remove a task')
    .option('-i, --id <number>', 'Task ID', (v) => v ? Number(v) : v)
    .action(removeTaskCommand);

program
    .command('list')
    .description('List all tasks')
    .action(listTasksCommand);

program
    .command('select', {isDefault: true})
    .description('Select command from menu')
    .action(commandsMenuCommand);

export default program;