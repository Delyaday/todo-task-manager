import { Task } from "./task-model";

export interface AppState {
    tasks: Task[];
    searchQuery?: string;
    searchResults?: Task[];
    isLoading?: boolean;
    error?: string | null;
}