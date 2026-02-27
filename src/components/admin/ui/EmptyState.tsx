interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-12 text-[#D8C3A5]/60">
      <p className="text-lg">{message}</p>
    </div>
  );
}
