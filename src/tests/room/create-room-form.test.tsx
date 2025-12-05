import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import CreateRoomForm from '@/components/features/rooms/create-room-form';

// Mock du service CreateRoom
vi.mock('@/services/room', () => ({
  CreateRoom: vi.fn(),
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { CreateRoom } from '@/services/room';

describe('CreateRoomForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('affiche le formulaire avec le champ de saisie et le bouton', () => {
    renderWithRouter(<CreateRoomForm />);

    expect(screen.getByPlaceholderText('Enter room name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create room/i })).toBeInTheDocument();
  });

  it('affiche un message d\'erreur quand le champ est vide et le formulaire est soumis', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateRoomForm />);

    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a room name')).toBeInTheDocument();
    });
  });

  it('appelle CreateRoom avec le bon nom quand le formulaire est soumis', async () => {
    const user = userEvent.setup();
    const roomName = 'My New Room';

    (CreateRoom as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    renderWithRouter(<CreateRoomForm />);

    const input = screen.getByPlaceholderText('Enter room name');
    const submitButton = screen.getByRole('button', { name: /create room/i });

    await user.type(input, roomName);
    await user.click(submitButton);

    await waitFor(() => {
      expect(CreateRoom).toHaveBeenCalledWith({ name: roomName });
    });
  });

  it('redirige vers la page d\'accueil après la création réussie d\'une salle', async () => {
    const user = userEvent.setup();
    const roomName = 'My New Room';

    (CreateRoom as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    renderWithRouter(<CreateRoomForm />);

    const input = screen.getByPlaceholderText('Enter room name');
    const submitButton = screen.getByRole('button', { name: /create room/i });

    await user.type(input, roomName);
    await user.click(submitButton);

    await waitFor(() => {
      expect(CreateRoom).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('ne redirige pas si la création échoue', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const roomName = 'My New Room';
    const error = new Error('Failed to create room');

    (CreateRoom as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    renderWithRouter(<CreateRoomForm />);

    const input = screen.getByPlaceholderText('Enter room name');
    const submitButton = screen.getByRole('button', { name: /create room/i });

    await user.type(input, roomName);
    await user.click(submitButton);

    await waitFor(() => {
      expect(CreateRoom).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('gère les erreurs lors de la création de la salle', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const roomName = 'My New Room';
    const error = new Error('Failed to create room');

    (CreateRoom as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    renderWithRouter(<CreateRoomForm />);

    const input = screen.getByPlaceholderText('Enter room name');
    const submitButton = screen.getByRole('button', { name: /create room/i });

    await user.type(input, roomName);
    await user.click(submitButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });

    consoleErrorSpy.mockRestore();
  });

  it('permet de soumettre le formulaire en appuyant sur Enter', async () => {
    const user = userEvent.setup();
    const roomName = 'My New Room';

    (CreateRoom as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    renderWithRouter(<CreateRoomForm />);

    const input = screen.getByPlaceholderText('Enter room name');

    await user.type(input, roomName);
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(CreateRoom).toHaveBeenCalledWith({ name: roomName });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('affiche la classe CSS error-text pour les messages d\'erreur', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateRoomForm />);

    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText('Please enter a room name');
      expect(errorMessage).toHaveClass('error-text');
    });
  });

  it('efface le message d\'erreur quand l\'utilisateur commence à taper', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateRoomForm />);

    const input = screen.getByPlaceholderText('Enter room name');
    const submitButton = screen.getByRole('button', { name: /create room/i });

    // Soumettre le formulaire vide pour déclencher l'erreur
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a room name')).toBeInTheDocument();
    });

    // Commencer à taper pour effacer l'erreur
    await user.type(input, 'R');

    await waitFor(() => {
      expect(screen.queryByText('Please enter a room name')).not.toBeInTheDocument();
    });
  });

  it('accepte les noms de salle avec des espaces et caractères spéciaux', async () => {
    const user = userEvent.setup();
    const roomName = 'Room #1 - Test & More!';

    (CreateRoom as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    renderWithRouter(<CreateRoomForm />);

    const input = screen.getByPlaceholderText('Enter room name');
    const submitButton = screen.getByRole('button', { name: /create room/i });

    await user.type(input, roomName);
    await user.click(submitButton);

    await waitFor(() => {
      expect(CreateRoom).toHaveBeenCalledWith({ name: roomName });
    });
  });
});

