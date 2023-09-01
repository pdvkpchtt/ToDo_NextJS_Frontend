import { XCircleIcon } from "@heroicons/react/24/solid";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

const TodoCard = ({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) => {
  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-sm"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button className="text-red-500 hover:text-red-600 transition duration-[250ms]">
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>

      {/* add image */}
    </div>
  );
};

export default TodoCard;
