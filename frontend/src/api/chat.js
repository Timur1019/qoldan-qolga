import { apiRequest } from './clientCore'

export const chatApi = {
  getConversations: () => apiRequest('/chat/conversations'),
  getOrCreateConversation: (adId) =>
    apiRequest('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ adId }),
    }),
  getMessages: (conversationId) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`),
  sendMessage: (conversationId, payload) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`, {
      method: 'POST',
      body: JSON.stringify(typeof payload === 'string' ? { text: payload } : payload),
    }),
  markAsRead: (conversationId) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}/read`, { method: 'POST' }),
  updateMessage: (conversationId, messageId, text) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ text }),
    }),
  deleteMessage: (conversationId, messageId) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}/messages/${messageId}`, { method: 'DELETE' }),
  deleteConversation: (conversationId) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}`, { method: 'DELETE' }),
}
