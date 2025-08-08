import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamsTable } from '@/components/teams/team-card';
import { Sentiment } from '@/types';
import '@testing-library/jest-dom';

describe('TeamsTable', () => {
  const mockTeams = [
    {
      id: '1',
      name: 'Team A',
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          sentiment: Sentiment.HAPPY,
          teamId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      memberCount: 1,
      isActive: true
    }
  ];

  it('renders teams correctly', () => {
    const { getByText } = render(<TeamsTable teams={mockTeams} />);
    expect(getByText('Team A')).toBeInTheDocument();
    const memberCount = getByText('1', { selector: 'span.font-light.text-slate-900' });
    expect(memberCount).toBeInTheDocument(); // Member count
    expect(getByText('Active', { selector: 'div.bg-green-100.text-green-800' })).toBeInTheDocument();
  });

  it('shows empty state when no teams exist', () => {
    const { getByText } = render(<TeamsTable teams={[]} />);
    expect(getByText('No teams yet')).toBeInTheDocument();
  });

  it('displays team overview header', () => {
    const { getByText } = render(<TeamsTable teams={mockTeams} />);
    expect(getByText('Teams Overview')).toBeInTheDocument();
  });
});
