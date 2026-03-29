import { create } from 'zustand'

type ViewMode = 'mobile' | 'desktop'

interface ViewModeState {
  mode: ViewMode
  setMode: (mode: ViewMode) => void
}

export const useViewModeStore = create<ViewModeState>((set) => ({
  mode: 'mobile',
  setMode: (mode) => set({ mode }),
}))
