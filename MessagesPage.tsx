import * as React from "react";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { useSelector } from "react-redux";

import { FlexBox, FlexItem, ItemAlign, List, TextArea } from "clever-components";

import { MessagingAvatar } from "src/ui/components/MessagingAvatar/MessagingAvatar";
import {
  MessagingThreadSummary,
  Status,
} from "src/ui/components/MessagingThreadSummary/MessagingThreadSummary";
import { MessagingNewThread } from "src/ui/components/MessagingNewThread/MessagingNewThread";
import {
  MessagingThreadHistory,
  MessageData,
} from "src/ui/components/MessagingThreadHistory/MessagingThreadHistory";
import { MessageBubble } from "src/ui/components/MessageBubble/MessageBubble";
import { MessageInput } from "src/ui/components/MessageInput/MessageInput";
import { selectors } from "src/ui/store";
import View from "src/ui/components/View";
import useChatState from './useChatState';

import "./MessagesPage.less";

function cssClass(element: string) {
  return `MessagesPage--${element}`;
}

// Sample data used for developing the UI and some of the shallow functionality therein.
//  Stand-in for the real data we will be pulling from launchpad, messaging-service,
//  Twilio, and wherever else.

// Example type for Twilio messages
type Message = {
  senderID: string;
  text: string;
  timestamp: number;
};

// Example type for Twilio thread
type Thread = {
  threadID: string;
  content: Message[];
  isRead: boolean;
  name: string;
  sectionID: string;
  status: Status;
};



type ChatState = {
  currentMessage: string;
  drafts: object;
  selectedThreadID: string;
};

type ChatReducerAction =
  | KeystrokeAction
  | SelectThreadAction
  | SendMessageAction
  | UpdateDraftAction;
type KeystrokeAction = {
  type: "KEYSTROKE";
  payload: {
    currentMessage: string;
  };
};
type SelectThreadAction = {
  type: "SELECT_THREAD";
  payload: {
    selectedThreadID: string;
  };
};
type SendMessageAction = {
  type: "SEND_MESSAGE";
};
type UpdateDraftAction = {
  type: "UPDATE_DRAFT";
};

type Props = {};

export const StudentMessagesPage: React.FC<Props> = () => {

  const [threads, chatState, chatActions] = useChatState();

  // Get feature flag for whether messages is enabled for district
  const messagesTabEnabled = useSelector(state => {
    return selectors.featureFlagEnabled(state, "see-student-portal-messaging");
  });

  // Get student to use id
  const studentID = useSelector(state => {
    return selectors.user(state).id;
  });

  const { currentMessage, drafts, selectedThreadID } = chatState;
  const selectedThread = threads.find(thread => thread.threadID === selectedThreadID);

  // After render, focus on the input field. This is important when switching threads,
  //  so that the user doesn't have to click back into the text field every time.
  const newMessageInput = useRef<TextArea>(null);
  useEffect(() => {
    if (selectedThreadID && selectedThread.status === "active") {
      newMessageInput.current.focus();
    }
  }, [selectedThreadID]);

  // This is the thread history for the selected thread. It needs to recompute
  //  if the user clicks on a new thread or there is a new message
  const formattedThreadHistory = useMemo(() => {
    if (!selectedThread) {
      return null;
    }
    const topper: MessageData = {
      content: (
        <div>
          <img
            alt="thread history"
            className={cssClass("ThreadHistory--Topper--Image")}
            src={require("./sleepy_chat_bubble.svg")}
          />
          <div className={cssClass("ThreadHistory--Topper--TitleText")}>
            Start chatting with {selectedThread.name}!
          </div>
          <div className={cssClass("ThreadHistory--Topper--SubtitleText")}>
            Just as a heads up, your administrators can access this message history.
          </div>
        </div>
      ),
      placement: "center",
    };
    const formattedThreadHistory = [topper].concat(
      selectedThread.content.map((message: Message) => ({
        content: (
          <MessageBubble
            content={message.text}
            theme={message.senderID === studentID ? "ownMessage" : "otherMessage"}
          />
        ),
        placement: message.senderID === studentID ? "right" : "left",
        timestamp: new Date(message.timestamp),
      })),
    );
    return formattedThreadHistory;
  }, [selectedThread, studentID]);

  // if (!messagesTabEnabled) {
  //   return <View windowTitle="Messages" />;
  // }

  const threadList = useMemo(() => threads.map(..), [threads]);

   // Helper function: converts a name to initials for the thread icon
   function convertNameToInitials(name: string): string {
    return name
      .split(" ")
      .map(name => name.substring(0, 1))
      .join("");
  }

  // Helper function: Sorts threads based on the timestamp of their last message
  function threadSort(a: Thread, b: Thread) {
    if (b.content.length === 0) return -1;
    if (a.content.length === 0) return 1;
    return b.content[b.content.length - 1].timestamp - a.content[a.content.length - 1].timestamp;
  }

  return (
    <View windowTitle="Messages">
      <FlexBox column className={cssClass("Container")}>
        <FlexBox alignItems={ItemAlign.CENTER} className={cssClass("Header--Container")}>
          <img
            className={cssClass("Header--Icon")}
            alt="messages"
            src={require("./messages_chat_bubbles.svg")}
          />
          <span className={cssClass("Header--Title")}>Messages</span>
        </FlexBox>
        <FlexBox className={cssClass("Messaging--Container")} grow>
          <FlexItem className={cssClass("Sidebar--Container")} grow>
            <List emptyMessage="" noBorder rowType="bordered">
              {/* If the thread has any messages, it needs a ThreadSummary. */}
              {threads
                .filter(thread => thread.content.length > 0)
                .sort(_threadSort)
                .map(thread => (
                  <List.Item
                    key={thread.threadID}
                    className={cssClass("Sidebar--ListItem")}
                    onClick={() =>
                      chatDispatch({
                        payload: { selectedThreadID: thread.threadID },
                        type: "SELECT_THREAD",
                      })
                    }
                  >
                    <MessagingThreadSummary
                      className={cssClass("Sidebar--ThreadSummary")}
                      hasDraft={!!drafts[thread.threadID]}
                      icon={
                        <MessagingAvatar
                          text={_convertNameToInitials(thread.name)}
                          color={{ seed: thread.name }}
                        />
                      }
                      isRead={thread.isRead}
                      selected={thread.threadID === selectedThread.threadID}
                      status={thread.status}
                      timestamp={new Date(thread.content[thread.content.length - 1].timestamp)}
                      title={thread.name}
                    >
                      {thread.content[thread.content.length - 1].text}
                    </MessagingThreadSummary>
                  </List.Item>
                ))}
              {/* If the thread has no messages, it is merely a NewThread.
                   Only show NewThreads if teacher is active.*/}
              {threads
                .filter(thread => thread.content.length === 0 && thread.status !== "off")
                .map(thread => (
                  <List.Item
                    className={cssClass("Sidebar--ListItem")}
                    key={thread.threadID}
                    onClick={() =>
                      chatDispatch({
                        payload: { selectedThreadID: thread.threadID },
                        type: "SELECT_THREAD",
                      })
                    }
                  >
                    <MessagingNewThread
                      className={cssClass("Sidebar--ThreadSummary")}
                      hasDraft={!!drafts[thread.threadID]}
                      icon={
                        <MessagingAvatar
                          color={{ seed: thread.name }}
                          text={_convertNameToInitials(thread.name)}
                        />
                      }
                      selected={thread.threadID === selectedThread.threadID}
                      title={thread.name}
                    />
                  </List.Item>
                ))}
            </List>
          </FlexItem>
          <FlexBox className={cssClass("Chat--Container")} column grow>
            {selectedThread && (
              <>
                <div className={cssClass("Chat--Header")}>{selectedThread.name}</div>
                <MessagingThreadHistory
                  messages={formattedThreadHistory}
                  threadID={selectedThread.threadID}
                />
                {selectedThread.status === "off" ? (
                  <FlexBox className={cssClass("Chat--Away--Container")}>
                    <img alt="messages turned off" src={require("./messages_off_bubbles.svg")} />
                    <FlexItem grow className={cssClass("Chat--Away--Message")}>
                      <div className={cssClass("Chat--Away--Message--Header")}>
                        {selectedThread.name} has turned off Messages
                      </div>
                      <div className={cssClass("Chat--Away--Message--Text")}>
                        You cannot chat here until {selectedThread.name} has turned Messages back on
                      </div>
                    </FlexItem>
                  </FlexBox>
                ) : (
                  <MessageInput
                    className={cssClass("Chat--Input")}
                    onBlur={() =>
                      chatDispatch({
                        type: "UPDATE_DRAFT",
                      })
                    }
                    onChange={newValue =>
                      chatDispatch({
                        payload: {
                          currentMessage: newValue,
                        },
                        type: "KEYSTROKE",
                      })
                    }
                    onSubmit={() =>
                      chatDispatch({
                        type: "SEND_MESSAGE",
                      })
                    }
                    recipientName={selectedThread.name}
                    ref={newMessageInput}
                    value={currentMessage}
                  />
                )}
              </>
            )}
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </View>
  );

 
};
