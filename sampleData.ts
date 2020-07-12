// Sample data that represents the list of open threads
const threads = [
  {
    content: [
      {
        senderID: "52c5e9d0e6ed0694212d69ed",
        timestamp: Date.UTC(2020, 4, 28, 15, 5, 10, 0),
        text: "Hey, can I get some advice on how to tackle the assignment???",
      },
      {
        senderID: "notStudent",
        timestamp: Date.UTC(2020, 4, 28, 17, 58, 10, 0),
        text: "First, you want a simple reading pass, and then go deeper on a second pass.",
      },
      {
        senderID: "notStudent",
        timestamp: Date.UTC(2020, 4, 28, 18, 1, 10, 0),
        text: "That one will require you to analyze the text and extract motifs. Makes sense?",
      },
      {
        senderID: "student001",
        timestamp: Date.UTC(2020, 5, 1, 16, 29, 10, 0),
        text: "yep! thx, teach",
      },
      {
        senderID: "notStudent",
        timestamp: Date.UTC(2020, 5, 1, 16, 42, 10, 0),
        text: "Happy to help! Also, my name is Mrs. Twizzler. :-)",
      },
      {
        senderID: "notStudent",
        timestamp: Date.UTC(2020, 5, 1, 17, 2, 10, 0),
        text: "This dialogue between us is perfectly coherent, right?",
      },
      {
        senderID: "52c5e9d0e6ed0694212d69ed",
        timestamp: Date.UTC(2020, 5, 1, 17, 9, 10, 0),
        text: "Oh most definitely, yes. Chloe has not run out of ideas.",
      },
      {
        senderID: "notStudent",
        timestamp: Date.UTC(2020, 5, 1, 18, 22, 10, 0),
        text: "No, no she has not.",
      },
      {
        senderID: "notStudent",
        timestamp: Date.UTC(2020, 5, 1, 18, 37, 10, 0),
        text: "And now we have enough messages to scroll, hurray!",
      },
      {
        senderID: "52c5e9d0e6ed0694212d69ed",
        timestamp: Date.UTC(2020, 5, 1, 18, 37, 10, 0),
        text: "Fantastic!",
      },
    ],
    isRead: true,
    name: "Mrs. Twizzler",
    sectionID: "spanish_uuid",
    status: "active",
    threadID: "aa123",
  },
  {
    content: [
      {
        senderID: "notStudent",
        timestamp: Date.UTC(2020, 4, 29, 18, 28, 10, 0),
        text: "Where in the world is Carmen Sandiego? Please help young padwan!",
      },
    ],
    isRead: true,
    name: "Mr. Butterfinger",
    sectionID: "biology_uuid",
    status: "off",
    threadID: "bb456",
  },
  {
    content: [
      {
        senderID: "notStudent",
        timestamp: Date.UTC(2020, 4, 29, 7, 33, 10, 0),
        text: "but really, why is the sky blue? it's something something diffraction, right?",
      },
    ],
    isRead: false,
    name: "Ms. Tagalong",
    sectionID: "math_uuid",
    status: "active",
    threadID: "cc789",
  },
  {
    content: [],
    isRead: true,
    name: "Mrs. Nutterbutter",
    sectionID: "physics_uuid",
    status: "off",
    threadID: "dd812",
  },
];

// Sample data that represents the list of students' teachers
//  with whom the student doesn't have an open channel
const teachers = [
  {
    cleverID: "nn01",
    name: "Ms. Skittles",
    sectionID: "english_uuid",
  },
  {
    cleverID: "pp01",
    name: "Ms. Twix",
    sectionID: "biology_uuid",
  },
  {
    cleverID: "qq01",
    name: "Mr. Cadbury",
    sectionID: "history_uuid",
  },
  {
    cleverID: "nn01",
    name: "Ms. Swedish-Fish",
    sectionID: "english_uuid",
  },
  {
    cleverID: "pp01",
    name: "Ms. Baby-Ruth",
    sectionID: "biology_uuid",
  },
  {
    cleverID: "qq01",
    name: "Mr. Three-Musketeers",
    sectionID: "history_uuid",
  },
  {
    cleverID: "nn01",
    name: "Ms. Godiva",
    sectionID: "english_uuid",
  },
  {
    cleverID: "pp01",
    name: "Ms. Mars",
    sectionID: "biology_uuid",
  },
  {
    cleverID: "qq01",
    name: "Mr. Kit-Kat",
    sectionID: "history_uuid",
  },
];

// Pre-processing; fuse potential new threads with open Twilio threads
const newThreads = teachers.map((teacher, idx) => ({
  content: [],
  isRead: true,
  name: teacher.name,
  sectionID: teacher.sectionID,
  status: "active",
  threadID: `temp_${teacher.cleverID}_${idx}`,
}));

export default threads.concat(newThreads)
