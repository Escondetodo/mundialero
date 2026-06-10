import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface AppState{
  selectedCountry: string;
  selectedChannel: string[];
  selectedDay: string;
  favoriteMatch: number [];
  selectedGroup: string; 
  setSelectedCountry: (country: string) => void;
  toggleChannel: (channel: string) => void;
  setSelectedDay: (day: string) => void;
  setSelectedGroup: (group: string) => void;
  addFavoriteMatch: (match: number) => void;
  removeFavoriteMatch: (match: number) => void;
}


export const useAppStore = create<AppState>()(persist((set) => ({
  selectedCountry: "",
  selectedChannel: [],
  selectedDay: "06/11/2026",
  selectedGroup:"A",
  favoriteMatch: [],

  setSelectedCountry: (country: string) => {
    set({ selectedCountry: country });
  },

  toggleChannel: (channel: string) => {
    set((state) => {
      if (state.selectedChannel.includes(channel)) {
        return { selectedChannel: state.selectedChannel.filter((m) => m !== channel) };
      } else {
        return { selectedChannel: [...state.selectedChannel, channel] };
      }
    });
  },

  setSelectedDay: (day: string) => {
    set({ selectedDay: day });
  },

  setSelectedGroup: (group:string)=> { 
    set ({ selectedGroup: group });
   },

  addFavoriteMatch: (match: number) => {
    set((state) => ({favoriteMatch: [...state.favoriteMatch, match]}));
  },

  removeFavoriteMatch: (match: number) => {
    set((state)=>({favoriteMatch: state.favoriteMatch.filter((m) => m !== match)}));
  },
}),
{
    name: "app-storage",
     partialize: (state) => {
      // acá devolvés SOLO lo que querés persistir
      return {favoriteMatch: state.favoriteMatch};
    }

    
}));
