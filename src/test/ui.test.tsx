import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../components/ui/Card';
import { TierBadge } from '../components/ui/TierBadge';

describe('UI Components', () => {
  it('renders Card with children and custom class', () => {
    render(
      <Card className="custom-test-card">
        <div>Card Test Content</div>
      </Card>
    );

    expect(screen.getByText('Card Test Content')).toBeInTheDocument();
  });

  it('renders TierBadge with given tier name', () => {
    render(<TierBadge tier="Gold" />);
    expect(screen.getByText('Gold')).toBeInTheDocument();
  });
});
