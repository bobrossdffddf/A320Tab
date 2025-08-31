import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  discordId: string;
  username: string;
  avatar?: string;
  role: 'pilot' | 'ground_crew' | 'atc';
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/';
    },
  });

  const login = () => {
    window.location.href = '/auth/discord';
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user: user as User | undefined,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
}