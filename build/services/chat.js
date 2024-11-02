"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonalChatd = exports.createPersonalChat = exports.createMessage = void 0;
const client_1 = require("../prisma/client");
const createMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.prisma.messages.create({
        data: Object.assign(Object.assign({}, data), { participantId: undefined, participants: { connect: { id: data.participantId } }, messages: data.replyTo ? { connect: { id: data.replyTo } } : undefined, replyTo: undefined, users: { connect: { id: data.senderId } }, senderId: undefined }),
    });
});
exports.createMessage = createMessage;
const createPersonalChat = (user1Id, user2Id) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO:Ensure the IDs are ordered to enforce bidirectional uniqueness
    if (user1Id > user2Id)
        [user1Id, user2Id] = [user2Id, user1Id];
    return client_1.prisma.personalChat.create({
        data: {
            user1Id,
            user2Id,
        },
    });
});
exports.createPersonalChat = createPersonalChat;
const getPersonalChatd = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const personalChats = yield client_1.prisma.personalChat.findMany({
        where: {
            OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        select: {
            participants: {
                select: {
                    id: true,
                },
            },
        },
    });
    // Flatten to get only participant IDs
    const participantIds = personalChats.flatMap((chat) => chat.participants.map((participant) => participant.id));
    console.log(participantIds);
    return participantIds;
});
exports.getPersonalChatd = getPersonalChatd;
