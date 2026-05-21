interface NumberPadProps {
  onSelect: (num: number) => void;
}

export function NumberPad({ onSelect }: NumberPadProps) {
  return (
    <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
        <button key={num} onClick={() => onSelect(num)}>{num}</button>
      ))}
    </div>
  );
}
