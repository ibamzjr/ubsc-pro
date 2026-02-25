const ArrowIcon: React.FC = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M6 16H26M26 16L16 6M26 16L16 26"
            stroke="white"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

interface ReservasiButtonProps {
    onClick?: () => void;
    label?: string;
}

export default function ReservasiButton({
    onClick,
    label = "Mulai Reservasi",
}: ReservasiButtonProps) {
    return (
        <>
            <style>{`
                .reservasi-btn {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    background-color: #E8E8E8;
                    border: none;
                    border-radius: 9999px;
                    padding: 4px 24px 4px 4px;
                    cursor: pointer;
                    overflow: hidden;
                    height: 44px;
                    outline: none;
                    -webkit-tap-highlight-color: transparent;
                }

                /* Expanding red fill */
                .reservasi-btn-fill {
                    position: absolute;
                    left: 4px;
                    top: 4px;
                    bottom: 4px;
                    width: 36px;
                    border-radius: 9999px;
                    background-color: #E8190A;
                    z-index: 0;
                    transition: width 0.5s cubic-bezier(0.76, 0, 0.24, 1);
                    pointer-events: none;
                }
                .reservasi-btn:hover .reservasi-btn-fill {
                    width: calc(100% - 8px);
                }

                /* Icon wrapper */
                .reservasi-icon-wrap {
                    position: relative;
                    z-index: 1;
                    width: 36px;
                    height: 36px;
                    overflow: hidden;
                    flex-shrink: 0;
                    border-radius: 9999px;
                }

                /* Arrow track: [arrow-new | arrow-old] */
                .reservasi-arrow-track {
                    display: flex;
                    width: 72px;
                    height: 100%;
                    transform: translateX(-36px);
                    transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
                }
                .reservasi-btn:hover .reservasi-arrow-track {
                    transform: translateX(0px);
                }

                .reservasi-arrow-slot {
                    width: 36px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                /* Text wrapper */
                .reservasi-text-wrap {
                    position: relative;
                    z-index: 1;
                    overflow: hidden;
                    height: 36px;
                    padding-left: 12px;
                    padding-right: 4px;
                }

                /* Text track */
                .reservasi-text-track {
                    display: flex;
                    flex-direction: column;
                    transform: translateY(0px);
                    transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
                }
                .reservasi-btn:hover .reservasi-text-track {
                    transform: translateY(-36px);
                }

                .reservasi-text-slot {
                    height: 36px;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: -0.2px;
                    white-space: nowrap;
                    line-height: 1;
                    font-family: inherit;
                }

                .reservasi-text-1 { color: #111111; }
                .reservasi-text-2 { color: #FFFFFF; }
            `}</style>

            <button
                type="button"
                onClick={onClick}
                className="reservasi-btn"
                aria-label={label}
            >
                <div className="reservasi-btn-fill" />

                <div className="reservasi-icon-wrap">
                    <div className="reservasi-arrow-track">
                        <div className="reservasi-arrow-slot">
                            <ArrowIcon />
                        </div>
                        <div className="reservasi-arrow-slot">
                            <ArrowIcon />
                        </div>
                    </div>
                </div>

                <div className="reservasi-text-wrap">
                    <div className="reservasi-text-track">
                        <div className="reservasi-text-slot reservasi-text-1">
                            {label}
                        </div>
                        <div className="reservasi-text-slot reservasi-text-2">
                            {label}
                        </div>
                    </div>
                </div>
            </button>
        </>
    );
}
