type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ children, ...props }: SelectProps) {
  return (
    <select className="select" {...props}>
      {children}
    </select>
  );
}
