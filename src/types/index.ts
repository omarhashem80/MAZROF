import { CommunityRole } from '@prisma/client';
// this folder is for TypeScript types and interfaces, which can be shared across files for better type checking.
export interface UpdateGroupMemberData {
  role?: CommunityRole;
  hasMessagePermissions?: boolean;
  hasDownloadPermissions?: boolean;
}

// Interface for updating community member data
export interface UpdateChannelMemberData {
  role?: CommunityRole;
  hasDownloadPermissions?: boolean;
}

export interface FCMNotification {

  title: string;
  body: string;
  image?: string;

}

