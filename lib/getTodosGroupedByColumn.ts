import { databases } from "@/appwrite";
import { todo } from "node:test";

export const getTodosGroupedByColumn = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DB_ID!,
    process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!
  );

  const todos = data.documents;

  const columns = todos.reduce((acc, item) => {
    if (!acc.get(item.status))
      acc.set(item.status, {
        id: item.status,
        todos: [],
      });

    acc.get(item.status)!.todos.push({
      $id: item.$id,
      $createdAt: item.$createdAt,
      title: item.title,
      status: item.status,
      ...(item.image && { image: JSON.parse(item.image) }),
    });

    return acc;
  }, new Map<TypedColumn, Colunm>());

  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];

  for (const columnType of columnTypes)
    if (!columns.get(columnType))
      columns.set(columnType, { id: columnType, todos: [] });

  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );

  const board: Board = {
    columns: sortedColumns,
  };

  return board;
};
