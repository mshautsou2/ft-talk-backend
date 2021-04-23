import { getDBManager } from "src/config/database-connection"
import { HandlingError } from "src/libs/router.builder"
import { ChatModel } from "src/modules/chats/models/chat.model"

export async function ensureUserAuthorizedToAccessChat(chatId: string, userId: string) {

    const chat = await getDBManager()
    .createQueryBuilder()
    .select('chat')
    .from(ChatModel, 'chat')
    .leftJoinAndSelect('chat.participants', 'participants')
    .where('participants.user.id = :userId', { userId })
    .andWhere('chat.id = :chatId', { chatId })
    .getOne()

    console.log('=====FOUND CHAT', chat, userId, chatId)
    if (chat === undefined) {
        throw new HandlingError('NOT_AUTHORIZED_TO_ACCESS_CHAT')
    }
}

// SELECT "participant_model".id, "chatId", "userId", um."fullName", cm."name"
// 	FROM public.participant_model
// 	LEFT JOIN "user_model" um ON um."id" = "userId"
// 	LEFT JOIN "chat_model" cm ON cm."id" = "chatId"
// 	WHERE "userId" = 'e9009de1-7be7-4163-bc73-57d445ef694d';