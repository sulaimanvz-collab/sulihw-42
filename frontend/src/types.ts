export interface User {
  _id: string;
  username: string;
  token: string;
}

export interface UserMutation {
  username: string;
  password: string;
}

export interface GlobalError {
  error: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      message: string;
    };
  };
}

export interface ChatMessage {
  _id?: string;
  sender: string;
  text: string;
  createdAt?: string;
}

export interface OnlineUser {
  _id: string;
  username: string;
}

export interface IncomingMessage {
  type: "HISTORY" | "NEW_MESSAGE" | "ONLINE_USERS";
  payload: any;
}
