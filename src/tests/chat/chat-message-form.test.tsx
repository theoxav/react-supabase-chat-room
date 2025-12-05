import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ChatMessageForm from '@/components/features/chat/chat-message-form';

// Mock des stores
vi.mock('@/store/chatStore', () => ({
  useChatStore: vi.fn(),
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock du service sendMessage
vi.mock('@/services/message', () => ({
  sendMessage: vi.fn(),
}));

import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { sendMessage } from '@/services/message';

describe('ChatMessageForm Component', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockRoom = {
    id: 1,
    name: 'Test Room',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('affiche le formulaire avec le champ de saisie et le bouton', () => {
    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });

    render(<ChatMessageForm />);

    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('affiche un message d\'erreur quand le champ est vide et le formulaire est soumis', async () => {
    const user = userEvent.setup();
    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });

    render(<ChatMessageForm />);

    const submitButton = screen.getByRole('button', { name: /send/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Please type your message !')).toBeInTheDocument();
    });
  });

  it('appelle sendMessage avec les bonnes données quand le formulaire est soumis', async () => {
    const user = userEvent.setup();
    const messageContent = 'Hello, this is a test message';

    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
    (sendMessage as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    render(<ChatMessageForm />);

    const input = screen.getByPlaceholderText('Type your message...');
    const submitButton = screen.getByRole('button', { name: /send/i });

    await user.type(input, messageContent);
    await user.click(submitButton);

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledWith({
        content: messageContent,
        user_id: mockUser.id,
        email: mockUser.email,
        room_id: mockRoom.id,
      });
    });
  });

  it('réinitialise le formulaire après la soumission réussie', async () => {
    const user = userEvent.setup();
    const messageContent = 'Test message';

    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
    (sendMessage as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    render(<ChatMessageForm />);

    const input = screen.getByPlaceholderText('Type your message...') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /send/i });

    await user.type(input, messageContent);
    await user.click(submitButton);

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalled();
      expect(input.value).toBe('');
    });
  });

  it('ne soumet pas le formulaire si currentRoom est null', async () => {
    const user = userEvent.setup();
    const messageContent = 'Test message';

    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: null,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });

    render(<ChatMessageForm />);

    const input = screen.getByPlaceholderText('Type your message...');
    const submitButton = screen.getByRole('button', { name: /send/i });

    await user.type(input, messageContent);
    await user.click(submitButton);

    // Attendre un peu pour s'assurer que sendMessage n'est pas appelé
    await waitFor(() => {
      expect(sendMessage).not.toHaveBeenCalled();
    }, { timeout: 500 });
  });

  it('ne soumet pas le formulaire si user est null', async () => {
    const user = userEvent.setup();
    const messageContent = 'Test message';

    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
    });

    render(<ChatMessageForm />);

    const input = screen.getByPlaceholderText('Type your message...');
    const submitButton = screen.getByRole('button', { name: /send/i });

    await user.type(input, messageContent);
    await user.click(submitButton);

    // Attendre un peu pour s'assurer que sendMessage n'est pas appelé
    await waitFor(() => {
      expect(sendMessage).not.toHaveBeenCalled();
    }, { timeout: 500 });
  });

  it('gère les erreurs lors de l\'envoi du message', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const messageContent = 'Test message';
    const error = new Error('Failed to send message');

    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
    (sendMessage as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    render(<ChatMessageForm />);

    const input = screen.getByPlaceholderText('Type your message...');
    const submitButton = screen.getByRole('button', { name: /send/i });

    await user.type(input, messageContent);
    await user.click(submitButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });

    consoleErrorSpy.mockRestore();
  });

  it('permet de soumettre le formulaire en appuyant sur Enter', async () => {
    const user = userEvent.setup();
    const messageContent = 'Test message';

    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
    (sendMessage as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    render(<ChatMessageForm />);

    const input = screen.getByPlaceholderText('Type your message...');

    await user.type(input, messageContent);
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledWith({
        content: messageContent,
        user_id: mockUser.id,
        email: mockUser.email,
        room_id: mockRoom.id,
      });
    });
  });

  it('affiche les classes CSS correctes', () => {
    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });

    render(<ChatMessageForm />);

    const input = screen.getByPlaceholderText('Type your message...');
    const button = screen.getByRole('button', { name: /send/i });

    expect(input).toHaveClass('conv-input');
    expect(button).toHaveClass('conv-button');
  });
});

