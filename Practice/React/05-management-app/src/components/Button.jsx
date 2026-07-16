export default function Button({ children, ...props }) {
  return (
    <button
      className="px-4 py-2 text-xs md:text-base rounded-md bg-secondary text-stone-900 hover:brightness-95"
      {...props}
    >
      {children}
    </button>
  );
}
