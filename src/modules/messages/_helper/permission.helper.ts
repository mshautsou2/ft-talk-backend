import { getDBManager } from "src/config/database-connection"
import { HandlingError } from "src/libs/router-builder"
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

    if (chat === undefined) {
        throw new HandlingError('NOT_AUTHORIZED_TO_ACCESS_CHAT')
    }
}