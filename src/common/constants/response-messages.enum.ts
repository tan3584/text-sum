export enum RESPONSE_MESSAGES {
  LOGIN_FAIL = 'Login fail',
  CREATE_ERROR = 'Can not create user',
  EMAIL_EXIST = 'Email existed',
  INVALID = 'invalid',
  ERROR = 'An error occurred please try again later',
  EMAIL_SEND_FAIL = 'Mail send fail, please try again later',
  NOT_FOUND = 'Not found',
  EMAIL_NOT_FOUND = 'Email not found',
  DELETED_ACCOUNT = 'Account has been deleted, contact admin for support!',
  TOKEN_ERROR = 'Token error',
  TOPIC_NOT_FOUND = 'Topic not found',
  COMMENT_NOT_FOUND = 'Comment not found',
  USER_NOT_FOUND = 'Comment not found',
}

export enum RESPONSE_MESSAGES_CODE {
  LOGIN_FAIL = 'LOGIN_FAIL',
  CREATE_ERROR = 'CREATE_ERROR',
  EMAIL_EXIST = 'EMAIL_EXIST',
  INVALID = 'INVALID',
  ERROR = 'ERROR',
  EMAIL_SEND_FAIL = 'EMAIL_SEND_FAIL',
  NOT_FOUND = 'NOT_FOUND',
  SELF_DELETE = 'SELF_DELETE',
  SUPER_ADMIN_DELETE = 'SUPER_ADMIN_DELETE',
  DELETED_ACCOUNT = 'DELETED_ACCOUNT',
  EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND',
  TOPIC_NOT_FOUND = 'TOPIC_NOT_FOUND',
  COMMENT_NOT_FOUND = 'COMMENT_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}

export const RESPONSE_EXPLAINATION = {
  LIST:
    'First element is the array of result, second element is the total count',
  LIST_SPECIAL:
    'First element is result of the list, second is the total count, last is unread count',
};
