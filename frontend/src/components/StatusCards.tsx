type ComponentState = "ON" | "OFF";

function Pill({ value }: { value: ComponentState }) {
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        border: "1px solid #ddd",
        fontWeight: 700,
        fontSize: 12,
        opacity: value === "ON" ? 1 : 0.7
      }}
    >
      {value}
    </span>
  );
}

function Card({ title, value }: { title: string; value: ComponentState }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 800 }}>{title}</div>
        <Pill value={value} />
      </div>
      <div style={{ marginTop: 8, opacity: 0.8, fontSize: 13 }}>
        {value === "ON" ? "Active" : "Inactive"}
      </div>
    </div>
  );
}

export default function StatusCards(props: {
  components?: {
    camera1: ComponentState;
    camera2: ComponentState;
    conversion: ComponentState;
    storage: ComponentState;
  };
}) {
  const c = props.components;

  // Se status non è ancora arrivato, mostriamo placeholder
  const safe = c ?? { camera1: "OFF", camera2: "OFF", conversion: "OFF", storage: "OFF" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      <Card title="Camera 1" value={safe.camera1} />
      <Card title="Camera 2" value={safe.camera2} />
      <Card title="Conversion" value={safe.conversion} />
      <Card title="Storage" value={safe.storage} />
    </div>
  );
}