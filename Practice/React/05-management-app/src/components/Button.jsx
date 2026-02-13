export default function Button({ children, ...props }) {
  return (
    <button
      className="px-4 py-2 text-xs md:text-base rounded-md bg-primary text-stone-50 hover:brightness-110"
      {...props}
    >
      {children}
    </button>
  );
}
