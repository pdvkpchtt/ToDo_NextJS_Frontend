"use client";

import { useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const Board = () => {
  useEffect(() => {
    //   getBoard()
  }, []);

  return (
    // @ts-ignore
    <DragDropContext>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {/* @ts-ignore */}
        {(provided) => <div></div>}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
