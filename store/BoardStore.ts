import { create } from "zustand";
import { databases } from "@/appwrite";

import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";

interface BoardState {
  board: Board;
  getBoard: () => {};
  setBoardState: (board: Board) => void;
  updateTodoInDb: (todo: Todo, columnId: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Colunm>(),
  },

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
}));
