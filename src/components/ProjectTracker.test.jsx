import { render, screen } from '@testing-library/react';
import ProjectTracker from './ProjectTracker';
import { ToastProvider } from '../context/ToastContext';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('ProjectTracker', () => {
  it('renders welcome message', () => {
    render(
      <ToastProvider>
        <ProjectTracker />
      </ToastProvider>
    );
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  it('renders stats cards', () => {
    render(
      <ToastProvider>
        <ProjectTracker />
      </ToastProvider>
    );
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('Critical Items')).toBeInTheDocument();
    expect(screen.getByText('Active Blockers')).toBeInTheDocument();
  });
});



