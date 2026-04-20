import { create } from 'zustand';

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('voting_currentUser');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getInitialVotedPositions = () => {
  try {
    const user = getStoredUser();
    if (!user) return {};
    const stored = localStorage.getItem('voting_voters');
    const voters = stored ? JSON.parse(stored) : [];
    const voter = voters.find((v) => v.voterId === user.voterId);
    if (voter && voter.votedPositions) {
      return { [user.voterId]: voter.votedPositions };
    }
    return {};
  } catch {
    return {};
  }
};

export const useAuthStore = create((set) => ({
  currentUser: getStoredUser(),
  votedPositions: getInitialVotedPositions(),

  login: (user) => {
    set({ currentUser: user });
    localStorage.setItem('voting_currentUser', JSON.stringify(user));
    try {
      const stored = localStorage.getItem('voting_voters');
      const voters = stored ? JSON.parse(stored) : [];
      const voter = voters.find((v) => v.voterId === user.voterId);
      if (voter && voter.votedPositions) {
        set((state) => ({
          votedPositions: {
            ...state.votedPositions,
            [user.voterId]: voter.votedPositions,
          },
        }));
      }
    } catch {
    }
  },

  logout: () => {
    set({ currentUser: null });
    localStorage.removeItem('voting_currentUser');
  },

  markVoted: (voterId, position, candidateId) => {
    set((state) => ({
      votedPositions: {
        ...state.votedPositions,
        [voterId]: { ...(state.votedPositions[voterId] || {}), [position]: candidateId },
      },
    }));
  },

  hasUserVotedForPosition: (voterId, position) => {
    const { votedPositions } = useAuthStore.getState();
    return !!(votedPositions[voterId] && votedPositions[voterId][position]);
  },

  hasUserVoted: (voterId) => {
    const { votedPositions } = useAuthStore.getState();
    return !!(votedPositions[voterId] && Object.keys(votedPositions[voterId]).length > 0);
  },
}));
