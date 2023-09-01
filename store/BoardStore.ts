import { create } from "zustand";
import { databases, storage, ID } from "@/appwrite";

import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";

interface BoardState {
  board: Board;
  getBoard: () => {};
  setBoardState: (board: Board) => void;
  updateTodoInDb: (todo: Todo, columnId: TypedColumn) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  newTaskInput: string;
  setTaskInput: (newTaskInput: string) => void;

  newTaskType: TypedColumn;
  setTaskType: (columnId: TypedColumn) => void;

  image: File | null;
  setImage: (image: File | null) => void;
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

  image: null,
  setImage: (image: File | null) => set({ image }),

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

  addTask: async (todo, columnId, image) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded)
        file = { bucketId: fileUploaded.bucketId, fileId: fileUploaded.$id };
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DB_ID!,
      process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) newColumns.set(columnId, { id: columnId, todos: [newTodo] });
      else newColumns.get(columnId)?.todos.push(newTodo);

      return { board: { columns: newColumns } };
    });
  },
}));
