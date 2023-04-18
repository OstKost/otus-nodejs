import {getAllTasks} from "../db.js";

export async function listTasksCommand(): Promise<void> {
    const tasks = await getAllTasks();

    if (tasks.length === 0) {
        console.log('No tasks found.');
        return;
    }

    console.table(tasks, ['id', 'title', 'description', 'createdAt', 'completedAt']);
}
