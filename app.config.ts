export default defineAppConfig({
  ui: {
    radioGroup: {
      slots: {
        container: "testing",
        legend: "font-medium px-6",
        root: "px-6 pb-5",
        base: "cursor-pointer",
        item: "min-h-6 flex items-center cursor-pointer",
        label: "min-h-6 flex items-center cursor-pointer",
        indicator: "border-1 border-brand-100 rounded-full after:bg-brand-100 cursor-pointer",
      },
      variants: {
        color: {
          primary: {
            base: "focus-visible:outline-primary",
            indicator: "bg-white",
          },
        },
      },
    },
    switch: {
      slots: {
        root: "flex-1 flex-row-reverse items-center justify-between",
        wrapper: "ms-0",
        base: ["data-[state=unchecked]:bg-gray-50"],
        label: "font-semibold",
      },
      variants: {
        color: {
          primary: {
            base: "data-[state=checked]:bg-teal-500",
          },
        },
      },
    },
  },
});
