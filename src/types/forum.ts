export type Reply = {
  id: number;
  content: string;
  author: string;
  createdAt: string;
};

export type Discussion = {
  id: number;
  title: string;
  author: string;
  replies: Reply[];
  lastActivity: string;
  content?: string;
};

export type FormValues = {
  title: string;
  content: string;
};

export type ReplyFormValues = {
  content: string;
};