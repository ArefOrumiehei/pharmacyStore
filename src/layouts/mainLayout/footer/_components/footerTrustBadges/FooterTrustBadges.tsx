interface TrustBadge {
    href: string;
    imgSrc: string;
    alt: string;
}

const TRUST_BADGES: TrustBadge[] = [
    {
        href: "https://trustseal.enamad.ir/?id=XXXXX&Code=YYYYY",
        imgSrc: "/images/trust/enamad.png",
        alt: "نماد اعتماد الکترونیکی",
    },
    {
        href: "https://logo.samandehi.ir/Verify.aspx?id=XXXXX",
        imgSrc: "/images/trust/samandehi.png",
        alt: "نماد ساماندهی",
    },
];

function FooterTrustBadges() {
    if (TRUST_BADGES.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {TRUST_BADGES.map((badge) => (
                <a
                    key={badge.href}
                    href={badge.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                >
                    <img
                        src={badge.imgSrc}
                        alt={badge.alt}
                        className="h-14 sm:h-16 w-auto object-contain grayscale-0 hover:opacity-90 transition-opacity"
                        loading="lazy"
                    />
                </a>
            ))}
        </div>
    );
}

export default FooterTrustBadges;