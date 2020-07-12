import { useCallback,useMemo, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from "src/ui/store";
import demoData from './sampleData';

const SEND_MESSAGE = "SEND_MESSAGE";

const threadsReducer = (threads, action) => {
  switch (action.type) {
    case "SEND_MESSAGE": {
      const currentThreadIdx = threads.findIndex(
        thread => thread.threadID === action.payload.threadID,
      );
      const updatedThread = {
        ...threads[currentThreadIdx],
        content: [...threads[currentThreadIdx].content, action.payload.messageData],
      };
      return [
        ...threads.slice(0, currentThreadIdx),
        updatedThread,
        ...threads.slice(currentThreadIdx + 1),
      ];
    }
    case "MARK_AS_READ": {
      const currentThreadIdx = threads.findIndex(
        thread => thread.threadID === action.payload.threadID,
      );
      const updatedThread = {
        ...threads[currentThreadIdx],
        isRead: true,
      };
      return [
        ...threads.slice(0, currentThreadIdx),
        updatedThread,
        ...threads.slice(currentThreadIdx + 1),
      ];
    }
    default:
      return threads;
  }
};

const useChatState = () => {
  const { id: studentID } = useSelector(selectors.user);

  // Models the threads that we will get from redux
  const [threads, threadsDispatch] = useReducer(
    threadsReducer,
    demoData,
  );

  // Manages state for the chat: currently selectedThreadID, drafts, currentMessage input
  //  Memoize the function so it isnt created on each render.
  const chatStateReducer = useCallback(
    (state: ChatState, action: ChatReducerAction) => {
      switch (action.type) {
        case "KEYSTROKE":
          return {
            ...state,
            currentMessage: action.payload.currentMessage,
          };
        case "UPDATE_DRAFT":
          return {
            ...state,
            drafts: {
              ...state.drafts,
              [state.selectedThreadID]: state.currentMessage,
            },
          };
        case "SELECT_THREAD": {
          const newSelectedThreadID = action.payload.selectedThreadID;
          threadsDispatch({
            type: "MARK_AS_READ",
            payload: {
              threadID: newSelectedThreadID,
            },
          });
          // If it is the first thread being selected, we don't
          //  preserve previously selectedThread draft. Rare case
          if (!state.selectedThreadID) {
            return {
              ...state,
              selectedThreadID: newSelectedThreadID,
              currentMessage: state.drafts[newSelectedThreadID] || "",
            };
          } // Only save draft and trigger re-render if new thread is selected
          else if (newSelectedThreadID !== state.selectedThreadID) {
            return {
              ...state,
              drafts: {
                ...state.drafts,
                [state.selectedThreadID]: state.currentMessage,
              },
              selectedThreadID: newSelectedThreadID,
              currentMessage: state.drafts[newSelectedThreadID] || "",
            };
          } else {
            return state;
          }
        }
        case SEND_MESSAGE: {
          threadsDispatch({
            type: SEND_MESSAGE,
            payload: {
              threadID: state.selectedThreadID,
              messageData: {
                senderID: studentID,
                timestamp: Date.now(),
                text: state.currentMessage,
              },
            },
          });

          return {
            ...state,
            drafts: {
              ...state.drafts,
              [state.selectedThreadID]: "",
            },
          };
        }
        default:
          return state;
      }
    },
    [studentID],
  );

  // Initialize chatState
  const [chatState, chatDispatch] = useReducer(chatStateReducer, {
    drafts: {},
    selectedThreadID: threads && threads.length > 0 ? threads[0].threadID : null,
  });

  const sendMessage = useCallback(message => {
    chatDispatch({
      type: "SEND_MESSAGE",
      payload: message,
    })
  }, []);

  const sortedThreads = useMemo(() => threads.filter(thread => thread.content.length > 0)
    .sort(_threadSort)), [threads]);
  
  return useMemo(() => [sortedThreads, chatState, { sendMessage }], [threads, chatState, sendMessage]);
};

export default useChatState;

  