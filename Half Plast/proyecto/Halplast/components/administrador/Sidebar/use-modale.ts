import { create } from "zustand";

interface ModalState {
  isModalOpen: boolean;
  ModalAgregarAbrir: boolean;
  isModalAbrirImagen: boolean;
  setModalOpen: (open: boolean) => void;
  setModalAgregar: (open: boolean) => void;
  setModalAbrirImagen: (open: boolean) => void;
  hasActiveModals: () => boolean;
  resetModals: () => void;
}

export const useModal = create<ModalState>((set, get) => ({
  isModalOpen: false,
  ModalAgregarAbrir: false,
  isModalAbrirImagen: false,
  setModalOpen: (open: boolean) => set({ isModalOpen: open }),
  setModalAgregar: (open: boolean) => set({ ModalAgregarAbrir: open }),
  setModalAbrirImagen: (open: boolean) => set({ isModalAbrirImagen: open }),
  hasActiveModals: () => {
    const { isModalOpen, ModalAgregarAbrir, isModalAbrirImagen } = get();
    return isModalOpen || ModalAgregarAbrir || isModalAbrirImagen;
  },
  resetModals: () =>
    set({
      isModalOpen: false,
      ModalAgregarAbrir: false,
      isModalAbrirImagen: false,
    }),
}));
