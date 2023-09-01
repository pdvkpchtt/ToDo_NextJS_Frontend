import { create } from "zustand";
import { databases, storage } from "@/appwrite";

import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";

interface BoardState {
  board: Board;
  getBoard: () => {};
  setBoardState: (board: Board) => void;
  updateTodoInDb: (todo: Todo, columnId: TypedColumn) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  newTaskInput: string;
  setTaskInput: (newTaskInput: string) => void;

  newTaskType: TypedColumn;
  setTaskType: (columnId: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Colunm>(),
  },
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),

  newTaskInput: "",
  setTaskInput: (newTaskInput) => set({ newTaskInput }),

  newTaskType: "todo",
  setTaskType: (columnId) => set({ newTaskType: columnId }),

  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  updateTodoInDb: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DB_ID!,
      process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
      todo.$id,
      { title: todo.title, status: columnId }
    );
  },

  deleteTask: async (taskIndex, todo, id) => {
    const newColumn = new Map(get().board.columns);

    newColumn.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumn } });

    if (todo.image)
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DB_ID!,
      process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
      todo.$id
    );
  },
}));
