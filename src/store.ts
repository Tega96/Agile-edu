import { create } from 'zustand';

type Stored = {
    count: number;
    setIncrementCount: (count: number) => void;
}

const useStored = create<Stored>(() => ({
    count: 0,
    setIncrementCount: (count) => {{ count: count + 1}}
}))

export default useStored;