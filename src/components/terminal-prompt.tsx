type Props = {
  command: string;
  user?: string;
  host?: string;
  className?: string;
};

export default function TerminalPrompt({
  command,
  user = "bhavesh",
  host = "varma:~",
  className = "",
}: Props) {
  return (
    <p className={`font-mono text-sm text-mute ${className}`}>
      <span className="text-phosphor">$ </span>
      <span className="text-mute">
        {user}@{host}${" "}
      </span>
      <span className="text-fg">{command}</span>
    </p>
  );
}
