export interface User {
    login: string;
    password: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    completedAt: Date | null;
}

export interface Database {
    users: User[];
    tasks: Task[];
}