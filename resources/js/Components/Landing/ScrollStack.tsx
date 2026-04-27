export interface ScrollStackItemProps {
    children: React.ReactNode;
    itemClassName?: string;
}

export function ScrollStackItem({ children, itemClassName = "" }: ScrollStackItemProps) {
    return <div className={`w-full overflow-hidden rounded-xl ${itemClassName}`}>{children}</div>;
}

export interface ScrollStackProps {
    children: React.ReactNode;
    cardOffset?: number;
    topStart?: number;
    className?: string;
}

export default function ScrollStack({
    children,
    cardOffset = 16,
    topStart = 80,
    className = "",
}: ScrollStackProps) {
    const items = Array.isArray(children) ? children : [children];

    return (
        <div className={`relative flex flex-col ${className}`}>
            {items.map((child, i) => (
                <div
                    key={i}
                    style={{
                        position: "sticky",
                        top: `${topStart + i * cardOffset}px`,
                        zIndex: i + 1,
                        // Scale down cards that are deeper in the stack
                        transform: `scale(${1 - (items.length - 1 - i) * 0.02})`,
                        transformOrigin: "top center",
                        marginBottom: "1rem",
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}
