export const useSidebar = () => {
  const open = useState<boolean>("open", () => true);

  const toggleSidebar = () => {
    open.value = !open.value;
  };

  return {
    open,
    toggleSidebar,
  };
};
