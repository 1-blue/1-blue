export const MIN_NICKNAME_LENGTH = 2;
export const MAX_NICKNAME_LENGTH = 20;
export const MIN_PASSWORD_LENGTH = 4;
export const MAX_PASSWORD_LENGTH = 32;
export const MIN_COMMENT_LENGTH = 1;
export const MAX_COMMENT_LENGTH = 500;

export type CommentInput = {
  nickname: string;
  password: string;
  content: string;
  parentCommentId?: string | null;
};

export const validateCommentInput = (input: CommentInput): CommentInput => {
  const nickname = input.nickname.trim();
  const password = input.password;
  const content = input.content.trim();

  if (nickname.length < MIN_NICKNAME_LENGTH || nickname.length > MAX_NICKNAME_LENGTH) {
    throw new Error("invalid_nickname");
  }
  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    throw new Error("invalid_password");
  }
  if (content.length < MIN_COMMENT_LENGTH || content.length > MAX_COMMENT_LENGTH) {
    throw new Error("invalid_content");
  }

  return {
    nickname,
    password,
    content,
    parentCommentId: input.parentCommentId ?? null,
  };
};

export const canReplyToComment = (parentHasParent: boolean): boolean => !parentHasParent;
