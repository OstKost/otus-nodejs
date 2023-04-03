import {Low} from 'lowdb'
// @ts-ignore
import {JSONFile} from 'lowdb/node'
import {Database, Task, User} from "./types.js";

type UpdatePayload = {
    title?: string,
    description?: string,
    completed?: boolean
}

const adapter = new JSONFile<Database>("db.json");
const db = new Low<Database>(adapter);

export const initDB = async () => {
    await db.read();
    db.data ||= {users: [], tasks: []};
    await db.write();
}

export const createTask = async (task: Task): Promise<void> => {
    await db.read();
    db.data!.tasks.push(task);
    await db.write();
};

export const getAllTasks = async (): Promise<Task[]> => {
    await db.read();
    return db.data!.tasks;
};

// export const getTask = async (id: number): Promise<Task | null> => {
//     await db.read();
//     const tasks = db.data!.tasks;
//     const task = tasks.find(t => t.id === id);
//     if (!task) return null;
//     return task;
// };

export const updateTask = async (id: number, payload: UpdatePayload): Promise<Task | null> => {
    await db.read();
    const tasks = db.data!.tasks;
    const task = tasks.find(t => t.id === id);
    if (!task) return null;
    const updatedTask = {...task, ...payload};
    const index = tasks.findIndex(t => t.id === task.id);
    tasks.splice(index, 1, updatedTask);
    await db.write();
    return updatedTask;
};

export const deleteTask = async (id: number): Promise<boolean | null> => {
    await db.read();
    const tasks = db.data!.tasks;
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    tasks.splice(index, 1);
    await db.write();
    return true;
};

export const getUser = async (login: string): Promise<User | null> => {
    await db.read();
    const users = db.data!.users;
    const user = users.find(t => t.login === login);
    if (!user) return null;
    return user;
};