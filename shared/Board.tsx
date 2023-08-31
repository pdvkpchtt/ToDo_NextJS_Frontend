"use client";

import { useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { useBoardStore } from "@/store/BoardStore";

const Board = () => {
  const [board, getBoard] = useBoardStore((state) => [
    state.board,
    state.getBoard,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);
  console.log(board);
  return (
    <h1></h1>
    // // @ts-ignore
    // <DragDropContext>
    //   <Droppable droppableId="board" direction="horizontal" type="column">
    //     {/* @ts-ignore */}
    //     {(provided) => <div></div>}
    //   </Droppable>
    // </DragDropContext>
  );
};

export default Board;
