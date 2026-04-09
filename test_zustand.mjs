import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';

const store = createStore(
  persist(
    (set) => ({
      experiences: [],
      addExperience: (exp) => set((state) => ({ experiences: [...state.experiences, exp] })),
    }),
    { name: 'test-storage' }
  )
);

store.getState().addExperience({ title: 'Test' });
console.log(store.getState().experiences);
