const PHASES = [
    {
        status: "done",
        tag: "Shipped",
        title: "Payments & wallet",
        items: ["Freighter connect", "Send XLM on Testnet", "Live balance & history"],
    },
    {
        status: "done",
        tag: "Shipped",
        title: "On-chain crowdfunding",
        items: ["StellarFund Soroban contract", "Real donations & events", "Live progress feed"],
    },
    {
        status: "done",
        tag: "Shipped",
        title: "Inter-contract loyalty",
        items: ["DonorBadge contract", "Cross-contract awards", "Bronze / Silver / Gold tiers"],
    },
    {
        status: "active",
        tag: "In progress",
        title: "Scale & Ecosystem",
        items: ["50+ testnet users onboarded", "Analytics dashboard", "User feedback iteration", "Pitch deck & demo"],
    },
    {
        status: "next",
        tag: "Planned",
        title: "Mainnet & beyond",
        items: ["Mainnet deployment", "USDC & multi-asset support", "Campaign creation UI", "DAO governance"],
    },
];


/* Product roadmap timeline — communicates momentum and where the project is headed. */
export default function Roadmap() {
    return (
        <div className="roadmap-grid-container">
            <style>{`
                .rm-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
                    gap: 32px;
                    margin-top: 24px;
                }
                .rm-card {
                    position: relative;
                    padding: 40px;
                    border-radius: 24px;
                    background: #000;
                    display: flex;
                    flex-direction: column;
                }
                .rm-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    padding: 1px; /* border thickness */
                    background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                }
                .rm-title {
                    font-size: 1.4rem;
                    font-weight: 500;
                    color: #fff;
                    margin: 0 0 16px 0;
                    line-height: 1.4;
                }
                .rm-items {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.95rem;
                    line-height: 1.6;
                    flex: 1;
                }
                .rm-items li {
                    margin-bottom: 8px;
                }
                .rm-footer {
                    margin-top: 40px;
                    display: flex;
                    align-items: center;
                }
            `}</style>
            
            <div className="rm-grid">
                {PHASES.map((p, i) => (
                    <div className="rm-card" key={i}>
                        <h3 className="rm-title">{p.title}</h3>
                        
                        <ul className="rm-items">
                            {p.items.map((it) => (
                                <li key={it}>{it}</li>
                            ))}
                        </ul>
                        
                        <div className="rm-footer">
                            <span className={`roadmap-tag roadmap-tag-${p.status}`} style={{ margin: 0 }}>
                                {p.tag}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
