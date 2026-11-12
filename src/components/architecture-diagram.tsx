/**
 * Authorization flow of the MANDATE prototype, drawn as plain SVG.
 * Components and data flow mirror docs/architecture and the SDK's
 * MandateClient.proveAndSubmit() sequence.
 */
const stroke = "var(--foreground)";
const muted = "var(--muted-foreground)";

function Box({
  x, y, w, h, title, sub, dashed,
}: { x: number; y: number; w: number; h: number; title: string; sub?: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="var(--background)" stroke={stroke} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 5)} textAnchor="middle" fontSize={13} fontWeight={600} fill={stroke}>
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill={muted}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={11} fontFamily="var(--font-mono)" fill={muted}>
      {children}
    </text>
  );
}

export function ArchitectureDiagram() {
  return (
    <figure className="my-6">
      <div className="overflow-x-auto border border-border-strong">
        <svg
          viewBox="0 0 880 380"
          role="img"
          aria-labelledby="arch-title arch-desc"
          className="block min-w-[760px] w-full"
          fontFamily="var(--font-sans)"
        >
          <title id="arch-title">MANDATE authorization flow</title>
          <desc id="arch-desc">
            An agent calls the MCP server, which calls the SDK. The SDK reads portfolio state from the sequencer and
            the policy commitment and state root from the registry, obtains a zero-knowledge proof from the Noir
            circuit, and submits a proof-gated order commitment to the batch auction contract, which verifies it.
            The account contract holds funds and provides an owner-only escape hatch.
          </desc>
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={stroke} />
            </marker>
          </defs>

          {/* Row 1: off-chain pipeline */}
          <Label x={20} y={22} anchor="start">OFF-CHAIN</Label>
          <Box x={20} y={36} w={150} h={56} title="Agent" sub="untrusted" />
          <Box x={235} y={36} w={170} h={56} title="MCP server" sub="3 tools" />
          <Box x={470} y={36} w={170} h={56} title="SDK" sub="proveAndSubmit()" />
          <Box x={705} y={36} w={160} h={56} title="Noir circuit" sub="policy_check · UltraHonk" />

          <line x1={170} y1={64} x2={233} y2={64} stroke={stroke} markerEnd="url(#arr)" />
          <line x1={405} y1={64} x2={468} y2={64} stroke={stroke} markerEnd="url(#arr)" />
          <line x1={640} y1={64} x2={703} y2={64} stroke={stroke} markerStart="url(#arr)" markerEnd="url(#arr)" />
          <Label x={201} y={56}>call</Label>
          <Label x={437} y={56}>call</Label>
          <Label x={672} y={56}>witness</Label>
          <Label x={672} y={84}>proof</Label>

          {/* Bus from SDK */}
          <line x1={555} y1={92} x2={555} y2={170} stroke={stroke} />
          <line x1={100} y1={170} x2={555} y2={170} stroke={stroke} />
          <line x1={555} y1={170} x2={600} y2={170} stroke={stroke} />
          <line x1={100} y1={170} x2={100} y2={238} stroke={stroke} markerEnd="url(#arr)" />
          <line x1={330} y1={170} x2={330} y2={238} stroke={stroke} markerEnd="url(#arr)" />
          <line x1={600} y1={170} x2={600} y2={238} stroke={stroke} markerEnd="url(#arr)" />
          <Label x={108} y={200} anchor="start">portfolio witness</Label>
          <Label x={338} y={200} anchor="start">policy commitment,</Label>
          <Label x={338} y={214} anchor="start">state root (read)</Label>
          <Label x={608} y={200} anchor="start">proof + order commitment</Label>
          <Label x={608} y={214} anchor="start">(submit)</Label>

          {/* Row 2 */}
          <Box x={20} y={240} w={160} h={64} title="Sequencer" sub="state · epoch loop" />
          <rect x={235} y={226} width={635} height={140} fill="none" stroke={muted} strokeDasharray="4 3" />
          <Label x={245} y={380 - 8 - 4} anchor="start">LOCAL ANVIL CHAIN (no public deployment)</Label>
          <Box x={250} y={240} w={160} h={64} title="MandateRegistry" sub="commitment · keys" />
          <Box x={500} y={240} w={200} h={64} title="BatchAuction" sub="+ HonkVerifier" />
          <Box x={725} y={240} w={130} h={64} title="MandateAccount" sub="funds" />

          <line x1={410} y1={272} x2={498} y2={272} stroke={stroke} markerEnd="url(#arr)" />
          <Label x={454} y={264}>public</Label>
          <Label x={454} y={290}>inputs</Label>
          <Label x={790} y={322}>owner-only escape hatch,</Label>
          <Label x={790} y={336}>independent of all others</Label>
        </svg>
      </div>
      <figcaption className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        Figure 1. Authorization flow in the prototype. The agent reaches the system only through the MCP server; an
        order commitment is accepted by the auction contract only with a proof that verifies against public inputs
        assembled from registry state.
      </figcaption>
    </figure>
  );
}
