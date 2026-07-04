const QUOTES = [
    {
        text: "Settlement in seconds and fees you can't even feel. This is what on-chain payments should have always felt like.",
        name: "Maya R.",
        role: "Indie developer",
        avatar: "https://i.pravatar.cc/150?u=maya",
    },
    {
        text: "The crowdfunding flow is genuinely trustless — funds go straight into the contract and progress updates live. No backend to trust.",
        name: "Daniel K.",
        role: "Web3 builder",
        avatar: "https://i.pravatar.cc/150?u=daniel",
    },
    {
        text: "Non-custodial, sign everything in Freighter, and it just works. Exactly the UX I want before sending real value.",
        name: "Priya S.",
        role: "Stellar community",
        avatar: "https://i.pravatar.cc/150?u=priya",
    },
];

/* Social-proof band. Illustrative testimonials for this Testnet demo. */
export default function Testimonials() {
    return (
        <div className="testimonials-container">
            <style>{`
                .t-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 32px;
                    margin-top: 40px;
                }
                .t-card {
                    padding: 48px 32px;
                    background: rgba(255, 255, 255, 0.04);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 80px 16px 80px 16px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    transition: transform 0.3s ease, background 0.3s ease;
                }
                .t-card:hover {
                    transform: translateY(-4px);
                    background: rgba(255, 255, 255, 0.06);
                }
                .t-stars {
                    color: #FFB800;
                    font-size: 1.2rem;
                    letter-spacing: 2px;
                    margin-bottom: 24px;
                }
                .t-text {
                    color: rgba(255, 255, 255, 0.85);
                    font-size: 1.05rem;
                    line-height: 1.6;
                    flex: 1;
                    margin: 0 0 32px 0;
                    font-style: italic;
                }
                .t-author {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .t-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                }
                .t-meta {
                    display: flex;
                    flex-direction: column;
                }
                .t-name {
                    color: #fff;
                    font-weight: 600;
                    font-size: 0.95rem;
                }
                .t-role {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.85rem;
                }
            `}</style>
            <div className="t-grid">
                {QUOTES.map((q, i) => (
                    <div className="t-card" key={i}>
                        <div className="t-stars">★★★★★</div>
                        <p className="t-text">“{q.text}”</p>
                        <div className="t-author">
                            <img src={q.avatar} alt={q.name} className="t-avatar" />
                            <div className="t-meta">
                                <span className="t-name">{q.name}</span>
                                <span className="t-role">{q.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
