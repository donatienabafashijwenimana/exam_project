import { create } from 'zustand';

const STORAGE_KEYS = {
  candidates: 'voting_candidates',
  voters: 'voting_voters',
};

const getStoredData = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const generateId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return parseInt(timestamp + random, 36);
};

const initialCandidates = [
  {
    id: 1,
    name: 'Alice Uwimana',
    party: 'RPF-Inkotanyi',
    position: 'President',
    category: 'National',
    photo: 'https://ui-avatars.com/api/?name=Alice+Uwimana&background=1565c0&color=fff&size=200',
    campaignMessage: 'Building a digital future for all citizens through innovation and technology.',
    votes: 0,
  },
  {
    id: 2,
    name: 'Jean Baptiste Nzeyimana',
    party: 'PSD',
    position: 'President',
    category: 'National',
    photo: 'https://ui-avatars.com/api/?name=Jean+Nzeyimana&background=c62828&color=fff&size=200',
    campaignMessage: 'Education and healthcare reform for a stronger nation.',
    votes: 0,
  },
  {
    id: 3,
    name: 'Marie Claire Mukamana',
    party: 'PL',
    position: 'President',
    category: 'National',
    photo: 'https://ui-avatars.com/api/?name=Marie+Mukamana&background=2e7d32&color=fff&size=200',
    campaignMessage: 'Empowering women and youth through sustainable development.',
    votes: 0,
  },
  {
    id: 4,
    name: 'Patrick Habimana',
    party: 'RPF-Inkotanyi',
    position: 'Senator',
    category: 'Regional',
    photo: 'https://ui-avatars.com/api/?name=Patrick+Habimana&background=1565c0&color=fff&size=200',
    campaignMessage: 'Strengthening regional infrastructure and economic growth.',
    votes: 0,
  },
  {
    id: 5,
    name: 'Grace Umutoni',
    party: 'PSD',
    position: 'Senator',
    category: 'Regional',
    photo: 'https://ui-avatars.com/api/?name=Grace+Umutoni&background=c62828&color=fff&size=200',
    campaignMessage: 'Transparency and accountability in governance.',
    votes: 0,
  },
];

const initialVoters = [
  {
    id: 1,
    voterId: "1200580157606056",
    name: 'Emmanuel Habimana',
    email: 'donaabafashijwe@gmail.com',
    password: 'Dna1@123',
    pollingDistrict: 'District A - Kigali',
    status: 'Active',
    idPhoto: 'https://ui-avatars.com/api/?name=Emmanuel+Habimana&background=ff9800&color=fff&size=100',
    hasVoted: false,
  },
  {
    id: 2,
    voterId: "1200580157606055",
    name: 'Diane Mukamana',
    email: 'kamana@gmail.com',
    password: 'Dna1@123',
    pollingDistrict: 'District B - Huye',
    status: 'Active',
    idPhoto: 'https://ui-avatars.com/api/?name=Diane+Mukamana&background=9c27b0&color=fff&size=100',
    hasVoted: false,
  },
  {
    id: 3,
    voterId: "1199056789012345",
    name: 'Samuel Niyonzima',
    email: 'kaneza@gmail.com',
    password: 'Dna1@123',
    pollingDistrict: 'District C - Musanze',
    status: 'Active',
    idPhoto: 'https://ui-avatars.com/api/?name=Samuel+Niyonzima&background=00bcd4&color=fff&size=100',
    hasVoted: false,
  },
  {
    id: 4,
    voterId: '1200580157606055',
    name: 'Claudine Uwera',
    email: 'claudine.uwera@gmail.com',
    password: 'Dna1@123',
    pollingDistrict: 'District D - Rubavu',
    status: 'Inactive',
    idPhoto: 'https://ui-avatars.com/api/?name=Claudine+Uwera&background=f44336&color=fff&size=100',
    hasVoted: false,
  },
  {
    id: 5,
    voterId: "1199034567890123",
    name: 'Abafashijwenimana Donatien',
    email: 'adn@gmail.com',
    password: 'Dna1@123',
    pollingDistrict: 'District E - Muhanga',
    status: 'Active',
    idPhoto: 'https://ui-avatars.com/api/?name=Eric+Bizimana&background=607d8b&color=fff&size=100',
    hasVoted: false,
  },
]

export const useDataStore = create((set, get) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEYS.candidates && e.newValue) {
        try { set({ candidates: JSON.parse(e.newValue) }); } catch { }
      }
      if (e.key === STORAGE_KEYS.voters && e.newValue) {
        try { set({ voters: JSON.parse(e.newValue) }); } catch { }
      }
    });
  }

  return {
    candidates: getStoredData(STORAGE_KEYS.candidates, initialCandidates),
    voters: getStoredData(STORAGE_KEYS.voters, initialVoters),

    addCandidate: (candidate) => {
      if (!candidate?.name?.trim()) throw new Error('Candidate name is required');
      set((prev) => {
        const updated = [...prev.candidates, { ...candidate, id: generateId(), votes: 0 }];
        localStorage.setItem(STORAGE_KEYS.candidates, JSON.stringify(updated));
        return { candidates: updated };
      });
    },

    updateCandidate: (id, data) => {
      if (!id) throw new Error('Candidate ID is required');
      set((prev) => {
        const updated = prev.candidates.map((c) => (c.id === id ? { ...c, ...data } : c));
        localStorage.setItem(STORAGE_KEYS.candidates, JSON.stringify(updated));
        return { candidates: updated };
      });
    },

    deleteCandidate: (id) => {
      set((prev) => {
        const updated = prev.candidates.filter((c) => c.id !== id);
        localStorage.setItem(STORAGE_KEYS.candidates, JSON.stringify(updated));
        return { candidates: updated };
      });
    },

    getCandidateById: (id) => get().candidates.find((c) => c.id === id),

    getCandidatesByPosition: (position) => get().candidates.filter((c) => c.position === position),

    addVoter: (voter) => {
      if (!voter?.name?.trim()) throw new Error('Voter name is required');
      if (!voter?.voterId?.trim()) throw new Error('Voter ID is required');
      const { voters } = get();
      if (voters.some((v) => v.voterId === voter.voterId)) {
        throw new Error('A voter with this ID already exists');
      }
      set((prev) => {
        const updated = [...prev.voters, { ...voter, id: generateId(), hasVoted: false }];
        localStorage.setItem(STORAGE_KEYS.voters, JSON.stringify(updated));
        return { voters: updated };
      });
    },

    updateVoter: (id, data) => {
      if (!id) throw new Error('Voter ID is required');
      set((prev) => {
        const updated = prev.voters.map((v) => (v.id === id ? { ...v, ...data } : v));
        localStorage.setItem(STORAGE_KEYS.voters, JSON.stringify(updated));
        return { voters: updated };
      });
    },

    deleteVoter: (id) => {
      set((prev) => {
        const updated = prev.voters.filter((v) => v.id !== id);
        localStorage.setItem(STORAGE_KEYS.voters, JSON.stringify(updated));
        return { voters: updated };
      });
    },

    getVoterById: (id) => get().voters.find((v) => v.id === id),

    getVoterByVoterId: (voterId) => get().voters.find((v) => v.voterId === voterId),

    castVote: (candidateId, voterId, position) => {
      set((prev) => {
        const updatedCandidates = prev.candidates.map((c) =>
          c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
        );
        const updatedVoters = prev.voters.map((v) => {
          if (v.voterId !== voterId) return v;
          const votedPositions = { ...(v.votedPositions || {}), [position]: candidateId };
          return { ...v, votedPositions };
        });
        localStorage.setItem(STORAGE_KEYS.candidates, JSON.stringify(updatedCandidates));
        localStorage.setItem(STORAGE_KEYS.voters, JSON.stringify(updatedVoters));
        return { candidates: updatedCandidates, voters: updatedVoters };
      });
    },

    getEnrichedVoters: () => {
      const { candidates, voters } = get();
      const allPositionNames = [...new Set(candidates.map((c) => c.position))];
      return voters.map((v) => {
        if (!v.votedPositions) return v;
        const isComplete = allPositionNames.every((p) => v.votedPositions[p]);
        return { ...v, hasVoted: isComplete };
      });
    },

    authenticateVoter: (email, password) => {
      const enrichedVoters = get().getEnrichedVoters();
      const activeVoters = enrichedVoters.filter(v => v.status === 'Active');
      
      // Check if email exists and active
      const voter = activeVoters.find(v => v.email === email);
      if (!voter) {
        return { success: false, reason: 'invalidEmail' };
      }
      
      // Check password
      if (voter.password !== password) {
        return { success: false, reason: 'wrongPassword' };
      }
      
      return { success: true, voter };
    },

    resetVoting: () => {
      set((prev) => {
        const updatedCandidates = prev.candidates.map((c) => ({ ...c, votes: 0 }));
        const updatedVoters = prev.voters.map((v) => ({ ...v, hasVoted: false, votedPositions: {} }));
        localStorage.setItem(STORAGE_KEYS.candidates, JSON.stringify(updatedCandidates));
        localStorage.setItem(STORAGE_KEYS.voters, JSON.stringify(updatedVoters));
        return { candidates: updatedCandidates, voters: updatedVoters };
      });
    },

    resetAll: () => {
      localStorage.setItem(STORAGE_KEYS.candidates, JSON.stringify(initialCandidates));
      localStorage.setItem(STORAGE_KEYS.voters, JSON.stringify(initialVoters));
      set({ candidates: initialCandidates, voters: initialVoters });
    },
  };
});
