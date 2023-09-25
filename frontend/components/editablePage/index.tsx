import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import EditableBlock from "../editableBlock";
import Notice from "../notice";
import { usePrevious } from "../../hooks";
import { objectId, setCaretToEnd } from "../../utils";

interface Block {
  _id: string;
  tag: string;
  html: string;
  imageUrl: string;
}

interface EditablePageProps {
  id: string;
  fetchedBlocks: Block[];
  err: boolean;
}

const EditablePage: React.FC<EditablePageProps> = ({
  id,
  fetchedBlocks,
  err,
}) => {
  const router = useRouter();
  const [blocks, setBlocks] = useState<Block[]>(fetchedBlocks);
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);

  const prevBlocks = usePrevious<Block[]>(blocks);

  useEffect(() => {
    const updatePageOnServer = async (updatedBlocks: Block[]) => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API}/pages/${id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blocks: updatedBlocks,
          }),
        });
      } catch (err) {
        console.log(err);
      }
    };

    if (prevBlocks && prevBlocks !== blocks) {
      updatePageOnServer(blocks);
    }
  }, [blocks, prevBlocks, id]);

  useEffect(() => {
    if (prevBlocks && prevBlocks.length + 1 === blocks.length) {
      const nextBlockPosition =
        blocks.map((b) => b._id).indexOf(currentBlockId) + 1 + 1;
      const nextBlock = document.querySelector(
        `[data-position="${nextBlockPosition}"]`
      ) as HTMLElement;
      if (nextBlock) {
        nextBlock.focus();
      }
    }

    if (prevBlocks && prevBlocks.length - 1 === blocks.length) {
      const lastBlockPosition = prevBlocks
        .map((b) => b._id)
        .indexOf(currentBlockId);
      const lastBlock = document.querySelector(
        `[data-position="${lastBlockPosition}"]`
      ) as HTMLElement;
      if (lastBlock) {
        setCaretToEnd(lastBlock);
      }
    }
  }, [blocks, prevBlocks, currentBlockId]);

  const deleteImageOnServer = async (imageUrl: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/pages/${imageUrl}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const updateBlockHandler = (currentBlock: Block) => {
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const oldBlock = blocks[index];
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      imageUrl: currentBlock.imageUrl,
    };
    setBlocks(updatedBlocks);

    if (oldBlock.imageUrl && oldBlock.imageUrl !== currentBlock.imageUrl) {
      deleteImageOnServer(oldBlock.imageUrl);
    }
  };

  const addBlockHandler = (currentBlock: Block) => {
    setCurrentBlockId(currentBlock.id);
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    const newBlock = { _id: objectId(), tag: "p", html: "", imageUrl: "" };
    updatedBlocks.splice(index + 1, 0, newBlock);
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      imageUrl: currentBlock.imageUrl,
    };
    setBlocks(updatedBlocks);
  };

  const deleteBlockHandler = (currentBlock: Block) => {
    if (blocks.length > 1) {
      setCurrentBlockId(currentBlock.id);
      const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
      const deletedBlock = blocks[index];
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);

      if (deletedBlock.tag === "img" && deletedBlock.imageUrl) {
        deleteImageOnServer(deletedBlock.imageUrl);
      }
    }
  };

  const onDragEndHandler = (result: any) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) {
      return;
    }

    const updatedBlocks = [...blocks];
    const removedBlocks = updatedBlocks.splice(source.index - 1, 1);
    updatedBlocks.splice(destination.index - 1, 0, removedBlocks[0]);
    setBlocks(updatedBlocks);
  };

  const isNewPublicPage = router.query.public === "true";

  return (
    <>
      {err && (
        <Notice status="ERROR">
          <h3>Something went wrong 💔</h3>
          <p>Have you tried to restart the app at '/' ?</p>
        </Notice>
      )}
      {isNewPublicPage && (
        <Notice dismissible>
          <h4>Hey 👋 You just created a public page.</h4>
          <p>It will be automatically deleted after 24 hours.</p>
        </Notice>
      )}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId={id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {blocks.map((block, index) => (
                <EditableBlock
                  key={block._id}
                  position={index + 1}
                  id={block._id}
                  tag={block.tag}
                  html={block.html}
                  imageUrl={block.imageUrl}
                  pageId={id}
                  addBlock={addBlockHandler}
                  deleteBlock={deleteBlockHandler}
                  updateBlock={updateBlockHandler}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default EditablePage;
