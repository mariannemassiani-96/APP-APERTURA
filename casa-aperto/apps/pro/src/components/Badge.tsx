type BadgeProps = {
  role: 'admin' | 'sales';
  children: React.ReactNode;
};

export default function Badge({ role, children }: BadgeProps) {
  return <span className={`badge ${role}`}>{children}</span>;
}
