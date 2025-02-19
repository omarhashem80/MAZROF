import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findProfilesByUsername = async (query: string) => {
  return prisma.$queryRaw`
        SELECT id,
               username               AS name,
               email,
               photo,
               phone,
               screen_name            AS screenName,
               profile_pic_visibility AS profilePicVisibility,
               public_key             AS publicKey,
               last_seen              AS lastSeen,
               active_now             AS ActiveNow
        FROM users
        WHERE LOWER(username) LIKE LOWER(${`%${query}%`})
           OR LOWER(email) LIKE LOWER(${`%${query}%`})
           OR (phone LIKE ${`${query}%`})
        ORDER BY CASE
                     WHEN LOWER(username) LIKE LOWER(${`${query}%`}) THEN 1
                     WHEN LOWER(email) LIKE LOWER(${`${query}%`}) THEN 2
                     ELSE 3
                     END`;
};

export const findGroupByGroupName = async (groupName: string) => {
  return prisma.$queryRaw`
        SELECT groups.id,
               name,
               privacy,
               image_url AS imageURL,
               group_size AS groupSize
        FROM communities,
             groups
        WHERE communities.privacy = true
          AND communities.active = true
          AND communities.id = groups.community_id
          AND LOWER(communities.name) LIKE LOWER(${'%' + groupName + '%'})
    `;
};

export const findChannelByChannelName = async (channelName: string) => {
  return prisma.$queryRaw`
        SELECT name,
               channels.id,
               channels.can_add_comments AS canAddComments,
               "invitationLink"          AS invitationLink,
               image_url                 as imageUrl,
               privacy
        FROM communities,
             channels
        WHERE communities.privacy = true
          AND communities.active = true
          AND communities.id = channels.community_id
          AND LOWER(communities.name) LIKE LOWER(${'%' + channelName + '%'})
    `;
};
