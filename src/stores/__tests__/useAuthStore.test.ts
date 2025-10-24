import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../useAuthStore';
import { authService } from '../../services/auth';

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    authService.initialize();
  });

  it('should initialize with no user', () => {
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it('should login successfully with valid credentials', async () => {
    const { login } = useAuthStore.getState();
    const result = await login('rogerio.gigo@conectae.com.br', 'gigo123');
    
    expect(result).toBe(true);
    
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).not.toBeNull();
    expect(user?.email).toBe('rogerio.gigo@conectae.com.br');
    expect(user?.isAdmin).toBe(true);
    expect(isAuthenticated).toBe(true);
  });

  it('should fail login with invalid credentials', async () => {
    const { login } = useAuthStore.getState();
    const result = await login('wrong@email.com', 'wrongpass');
    
    expect(result).toBe(false);
    
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it('should logout successfully', () => {
    const { login, logout } = useAuthStore.getState();
    
    login('rogerio.gigo@conectae.com.br', 'gigo123');
    logout();
    
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });
});
