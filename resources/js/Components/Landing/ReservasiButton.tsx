const ArrowIcon: React.FC = () => (
    <svg
        width="21"
        height="21"
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

import { Link } from "@inertiajs/react";

interface ReservasiButtonProps {
    onClick?: () => void;
    label?: string;
    href?: string;
}

export default function ReservasiButton({
    onClick,
    label = "Mulai Reservasi",
    href = "/coming-soon",
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
                    padding: 6px 32px 6px 6px;
                    cursor: pointer;
                    overflow: hidden;
                    height: 64px;
                    outline: none;
                    -webkit-tap-highlight-color: transparent;
                }
                .reservasi-btn-fill {
                    position: absolute;
                    left: 6px;
                    top: 6px;
                    bottom: 6px;
                    width: 52px;
                    border-radius: 9999px;
                    background-color: #E8190A;
                    z-index: 0;
                    transition: width 0.5s cubic-bezier(0.76, 0, 0.24, 1);
                    pointer-events: none;
                }
                .reservasi-btn:hover .reservasi-btn-fill {
                    width: calc(100% - 12px);
                }
                .reservasi-icon-wrap {
                    position: relative;
                    z-index: 1;
                    width: 52px;
                    height: 52px;
                    overflow: hidden;
                    flex-shrink: 0;
                    border-radius: 9999px;
                }
                .reservasi-arrow-track {
                    display: flex;
                    width: 104px;
                    height: 100%;
                    transform: translateX(-52px);
                    transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
                }
                .reservasi-btn:hover .reservasi-arrow-track {
                    transform: translateX(0px);
                }
                .reservasi-arrow-slot {
                    width: 52px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .reservasi-text-wrap {
                    position: relative;
                    z-index: 1;
                    overflow: hidden;
                    height: 52px;
                    padding-left: 16px;
                    padding-right: 4px;
                }
                .reservasi-text-track {
                    display: flex;
                    flex-direction: column;
                    transform: translateY(0px);
                    transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
                }
                .reservasi-btn:hover .reservasi-text-track {
                    transform: translateY(-52px);
                }
                .reservasi-text-slot {
                    height: 52px;
                    display: flex;
                    align-items: center;
                    font-size: 18px;
                    font-weight: 600;
                    letter-spacing: -0.3px;
                    white-space: nowrap;
                    line-height: 1;
                    font-family: inherit;
                }
                .reservasi-text-1 { color: #111111; }
                .reservasi-text-2 { color: #FFFFFF; }
            `}</style>

            <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="reservasi-btn"
                aria-label={label}
            >
                <div className="reservasi-btn-fill" />

                <div className="reservasi-icon-wrap">
                    <div className="reservasi-arrow-track">
                        <div className="daftar-arrow-slot">
                            <ArrowIcon />
                        </div>
                        <div className="daftar-arrow-slot">
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
            </a>
        </>
    );
}
