import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ChatMessages from '@/components/features/chat/chat-messages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Message } from '@/types';

// Mock des stores
vi.mock('@/store/chatStore', () => ({
  useChatStore: vi.fn(),
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock du service getMessages
vi.mock('@/services/message', () => ({
  getMessages: vi.fn(),
}));

// Mock de supabase
vi.mock('@/supabaseClient', () => ({
  supabase: {
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
    })),
    removeChannel: vi.fn(),
  },
}));

// Mock de formatDate - on utilise la vraie fonction pour tester le comportement réel
vi.mock('@/lib/utils', async () => {
  const actual = await vi.importActual('@/lib/utils');
  return actual;
});

import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { getMessages } from '@/services/message';

describe('ChatMessages Component', () => {
  let queryClient: QueryClient;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockRoom = {
    id: 1,
    name: 'Test Room',
  };

  const mockMessages: Message[] = [
    {
      id: 1,
      content: 'Hello world',
      user_id: 'user-123',
      email: 'test@example.com',
      room_id: 1,
      created_at: '2024-01-01T10:00:00Z',
    },
    {
      id: 2,
      content: 'Hi there!',
      user_id: 'user-456',
      email: 'other@example.com',
      room_id: 1,
      created_at: '2024-01-01T10:05:00Z',
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('affiche le message de chargement quand isLoading est true', async () => {
    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
    (getMessages as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {}) // Promise qui ne se résout jamais pour simuler le chargement
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ChatMessages />
      </QueryClientProvider>
    );

    expect(screen.getByText('Loading messages...')).toBeInTheDocument();
  });

  it('affiche le message d\'erreur quand une erreur survient', async () => {
    const errorMessage = 'Failed to load messages';

    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
    (getMessages as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error(errorMessage)
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ChatMessages />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(`Error loading messages: ${errorMessage}`)
      ).toBeInTheDocument();
    });
  });

  it('affiche correctement les messages quand ils sont chargés', async () => {
    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
    (getMessages as ReturnType<typeof vi.fn>).mockResolvedValue(mockMessages);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatMessages />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Hello world')).toBeInTheDocument();
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });

    // Vérifier que les emails sont affichés
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('other@example.com')).toBeInTheDocument();
  });

  it('applique la classe "right" pour les messages de l\'utilisateur actuel', async () => {
    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
    (getMessages as ReturnType<typeof vi.fn>).mockResolvedValue(mockMessages);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatMessages />
      </QueryClientProvider>
    );

    await waitFor(() => {
      const ownMessage = screen.getByText('Hello world').closest('.conv-message-item');
      expect(ownMessage).toHaveClass('conv-message-item--right');
    });
  });

  it('applique la classe "left" pour les messages des autres utilisateurs', async () => {
    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
    (getMessages as ReturnType<typeof vi.fn>).mockResolvedValue(mockMessages);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatMessages />
      </QueryClientProvider>
    );

    await waitFor(() => {
      const otherMessage = screen.getByText('Hi there!').closest('.conv-message-item');
      expect(otherMessage).toHaveClass('conv-message-item--left');
    });
  });

  it('affiche les dates formatées pour chaque message', async () => {
    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
    (getMessages as ReturnType<typeof vi.fn>).mockResolvedValue(mockMessages);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatMessages />
      </QueryClientProvider>
    );

    await waitFor(() => {
      // Vérifier que les éléments avec la classe conv-message-details sont présents
      // (ils contiennent les dates formatées)
      const dateElements = document.querySelectorAll('.conv-message-details');
      expect(dateElements.length).toBe(mockMessages.length * 2); // 2 détails par message (date + email)
      
      // Vérifier que les dates sont au format HH:MM
      const dateTexts = Array.from(dateElements)
        .map(el => el.textContent?.trim())
        .filter(text => text && /^\d{2}:\d{2}$/.test(text));
      expect(dateTexts.length).toBe(mockMessages.length);
    });
  });

  it('n\'affiche rien quand currentRoom est null', () => {
    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: null,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ChatMessages />
      </QueryClientProvider>
    );

    // Le composant retourne null quand currentRoom est null
    // Donc rien ne devrait être rendu
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
    expect(container.querySelector('.conv-message-item')).not.toBeInTheDocument();
  });

  it('affiche un message vide quand il n\'y a pas de messages', async () => {
    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
    (getMessages as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatMessages />
      </QueryClientProvider>
    );

    await waitFor(() => {
      // Pas de messages, donc pas de contenu de message affiché
      expect(screen.queryByText('Hello world')).not.toBeInTheDocument();
      expect(screen.queryByText('Hi there!')).not.toBeInTheDocument();
    });
  });

  it('gère correctement le cas où user est null', async () => {
    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRoom: mockRoom,
    });
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
    });
    (getMessages as ReturnType<typeof vi.fn>).mockResolvedValue(mockMessages);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatMessages />
      </QueryClientProvider>
    );

    await waitFor(() => {
      // Tous les messages devraient avoir la classe "left" car user est null
      const messages = screen.getAllByText(/Hello world|Hi there!/);
      messages.forEach((msg) => {
        const messageItem = msg.closest('.conv-message-item');
        expect(messageItem).toHaveClass('conv-message-item--left');
      });
    });
  });
});
