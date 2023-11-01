export function openModal(modalId: string) {
  const modal = document.getElementById(modalId) as HTMLDialogElement;
  modal.showModal();
}
