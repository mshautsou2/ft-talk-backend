import { getDBManager } from 'src/config/database-connection'
import { HandlingError } from 'src/libs/router.builder'
import { AuthInfo, WithAuthentication } from 'src/services/authenticator'
import { CreateChatEndpoint } from '../../../ft-talk-shared/src/functions/chats/create-chat'
import { UserModel } from '../users/_models/user.model'
import { ChatModel } from './models/chat.model'
import { ParticipantModel } from './models/participant.model'

export const createChatHandler: WithAuthentication<CreateChatEndpoint> = async ({
    chatInfo: { isPrivate, name },
    participants: participantIds,
    auth: { id: userId },
}) => {
    await ensureChatNameIsNotTaken(name)

    if (!participantIds.includes(userId)) {
        participantIds.push(userId)
    }

    const chatModel = await getDBManager().save(
        new ChatModel({
            isPrivate,
            name,
        })
    )
    const participantsCreationPromises = participantIds.map(
        async (id) =>
            await getDBManager().save(
                new ParticipantModel({
                    chat: chatModel,
                    user: (id as unknown) as UserModel,
                })
            )
    )

    const participants: ParticipantModel[] = await Promise.all(participantsCreationPromises)

    return {
        success: true,
        status: 'CHAT_CREATED',
        chat: {
            ...chatModel,
            participants: participants.map(p => ({
                userId: p.user.id,
                chatId: p.chat.id,
            })),
        }
    }
}

async function ensureChatNameIsNotTaken(chatName: string) {
    const result = await getDBManager().findOne(ChatModel, {
        name: chatName,
    })
    if (result !== undefined) {
        throw new HandlingError('CHAT_NAME_ALREADY_EXISTS')
    }
}
