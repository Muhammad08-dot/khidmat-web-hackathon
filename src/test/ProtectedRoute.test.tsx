import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import * as AuthContextModule from '../contexts/AuthContext';

describe('ProtectedRoute Component', () => {
  it('permits children in evaluation mode', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      userProfile: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/auth" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Secret Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret Protected Content')).toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { uid: 'user_123', email: 'test@example.com' },
      userProfile: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '03001234567',
        city: 'Lahore',
        role: 'customer',
        location: { lat: 31.52, lng: 74.35 },
        createdAt: '2026-01-01',
      },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/auth" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Secret Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret Protected Content')).toBeInTheDocument();
  });
});
