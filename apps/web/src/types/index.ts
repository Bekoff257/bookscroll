export type AppUser = {
  _id: string;
  firebaseUid: string;
  username: string;
  displayName: string;
  photoUrl?: string;
  verified: boolean;
  role: 'user' | 'admin';
};

export type BookPost = {
  _id: string;
  uploaderId: AppUser;
  title: string;
  description: string;
  tags: string[];
  coverUrl: string;
  pdfUrl: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  likedByMe?: boolean;
};

export type CommentType = {
  _id: string;
  text: string;
  createdAt: string;
  userId: Pick<AppUser, '_id' | 'username' | 'displayName' | 'photoUrl' | 'verified'>;
};
