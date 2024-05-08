interface ChannelMember {
  userID: string;

  joinedAt: Date;
}

export interface Bookmark {
  name: string;

  url: string;

  thumbnail: string;
}

export interface BookmarkFolder {
  name: string;

  bookmarks: Bookmark[];
}

export interface ChannelProps {
  _id: string;
  name: string;
  isPublic: boolean;
  creatorID: string;
  workspaceID: string;
  members: ChannelMember[];
  topic?: string;
  description?: string;
  bookmarks?: Bookmark[];
  bookmarkFolders?: BookmarkFolder[];
}
