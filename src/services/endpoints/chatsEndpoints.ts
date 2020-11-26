export enum ChatsEndpoints {
  API_CHATS_GET_CHATS = '/chats',
  API_CHATS_CREATE_CHAT = '/chats',
  API_CHATS_GET_CHAT_USERS = '/chats/:id/users',
  API_CHATS_GET_NEW_MESSAGES_COUNT = '/chats/new/:id',
  API_CHATS_UPLOAD_CHAT_AVATAR = '/chats/avatar',
  API_CHATS_ADD_USERS_TO_CHAT = '/chats/users',
  API_CHATS_DELETE_USERS_FROM_CHAT = '/chats/users',
  API_CHATS_REQUEST_TOKEN = '/chats/token/:id',
}
