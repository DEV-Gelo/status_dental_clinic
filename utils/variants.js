export const section_variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.9, delay: 0.2, ease: [0.17, 0.55, 0.55, 1] },
  },
  closed: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.9, delay: 0.2, ease: [0.17, 0.55, 0.55, 1] },
  },
};
export const schedule_menu_variant = {
  open: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.2, ease: [0.17, 0.55, 0.55, 1] },
  },
  closed: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.5, delay: 0.2, ease: [0.17, 0.55, 0.55, 1] },
  },
};
export const popup_form_variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, delay: 0.2, ease: [0.17, 0.55, 0.55, 1] },
  },
  closed: {
    y: "-100%",
    opacity: 0,
    transition: { duration: 0.9, delay: 0.2, ease: [0.17, 0.55, 0.55, 1] },
  },
};

export const li_variants = {
  open: (index) => ({
    opacity: 1,
    transition: { duration: 0.8, delay: 0.9 + index * 0.2 },
  }),
  closed: {
    opacity: 0,
    transition: { duration: 0.8, delay: 0 },
  },
};
