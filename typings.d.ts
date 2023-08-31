interface Board {
  columns: Map<TypedColumn, Colunm>;
}

type TypedColumn = "todo" | "inprogress" | "done";

interface Colunm {
  id: TypedColumn;
  todos: Todo[];
}

interface Todo {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypedColumn;
  image?: Image;
}

interface Image {
  bucketId: string;
  fileId: string;
}
