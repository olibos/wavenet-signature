import { useMemo, type CSSProperties } from "react";
import { parsePhoneNumber } from "react-phone-number-input";
import logoAI from '@/images/wavenet-ai.png?base64';
import { useQuery } from "@tanstack/react-query";
import { optimizeProfileImage } from "@/helpers/images";

const outerTableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    maxWidth: "600px",
};

const aiFooterStyle: CSSProperties = {
    backgroundColor: "#222246",
    borderRadius: '8px',
    padding: '9px 25px',
    color: '#FFFFFF',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
    fontStyle: 'italic',
    fontSize: '12px',
    lineHeight: '100%',
    letterSpacing: '0%',
    marginTop: '12px',
};

const aiFooterHeadingStyle: CSSProperties = {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: '28px',
    lineHeight: '33px',
    letterSpacing: '0%',
    margin: '0 0 6px 0',
};

const aiFooterButtonStyle: CSSProperties = {
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#FFFFFF',
    color: '#FFFFFF',
    textDecoration: 'none',
    paddingTop: 8,
    paddingRight: 16,
    paddingBottom: 8,
    paddingLeft: 16,
    margin: '12px 0',
    display: 'inline-block',
};

const containerStyle: CSSProperties = {
    fontFamily: "Arial, sans-serif",
    fontSize: "13px",
    lineHeight: "1.4",
    color: "#333333",
    padding: "20px 0"
};

const tableStyle: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse'
};

const photoStyle: CSSProperties = {
    width: '80px',
    height: 'auto',
    borderRadius: '50%',
    objectFit: 'cover',
    display: 'block'
};

const nameStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#0D4A9B',
    marginBottom: '5px'
};

const titleStyle: CSSProperties = {
    fontSize: '13px',
    color: '#666666',
    marginBottom: '15px'
};

const contactItemStyle: CSSProperties = {
    padding: '3px 0',
    color: '#666666'
};

const linkStyle: CSSProperties = {
    color: '#0563C1',
    textDecoration: 'none'
};

const logoStyle: CSSProperties = {
    display: 'block',
    border: 'none'
};

const ecoFooterStyle: CSSProperties = {
    paddingTop: 12,
    fontSize: 10,
    color: '#4CAF50',
    fontStyle: 'italic'
};

const bookingButton: CSSProperties = {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#0078D4',
    color: '#FFFFFF',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    marginTop: '12px'
}

type Props = {
    name?: string;
    jobTitle?: string;
    bookingUrl?: string;
    email?: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    profileImage?: string;
    useEcoFooter?: boolean;
}
export function SignaturePreview({
    name,
    jobTitle,
    bookingUrl,
    email,
    phone: phoneNumberRaw,
    address,
    postalCode,
    city,
    country,
    profileImage,
    useEcoFooter
}: Props) {
    const phone = useMemo(() => parsePhoneNumber(phoneNumberRaw ?? '', "BE"), [phoneNumberRaw]);
    const { data: [image, width, height] = [] } = useQuery({
        queryKey: ['optimizedImage', profileImage],
        queryFn: () => optimizeProfileImage(profileImage ?? ''),
        enabled: !!profileImage
    });
    return (
        <table role="presentation" cellPadding="0" cellSpacing="0" width="600" style={outerTableStyle}>
            <tbody>
                <tr>
                    <td style={containerStyle}>
                        <table style={tableStyle} cellPadding="0" cellSpacing="0">
                            <tbody>
                                <tr>
                                    {image && (
                                        <td style={{ width: '80px', paddingRight: '20px', verticalAlign: 'top' }}>
                                            <img src={image} alt={name} style={photoStyle} width={width} height={height} />
                                        </td>
                                    )}

                                    <td style={{ verticalAlign: 'top' }}>
                                        <div>
                                            <div style={nameStyle}>{name}</div>
                                            {jobTitle && <div style={titleStyle}>{jobTitle}</div>}
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={contactItemStyle}>
                                                <span>📧 </span>
                                                <a target="_blank" rel="noopener noreferrer" href={`mailto:${email}`} style={linkStyle}>
                                                    {email}
                                                </a>
                                            </div>
                                            {phone && (
                                                <div style={contactItemStyle}>
                                                    <span>📱 </span>
                                                    <a href={`tel:${phone.number}`} style={linkStyle}>
                                                        {phone.formatInternational()}
                                                    </a>
                                                </div>
                                            )}
                                            <div style={contactItemStyle}>
                                                <span>📍 </span>
                                                <span><a target="_blank" rel="noopener noreferrer" style={linkStyle} href={`https://maps.google.com/?q=${address} ${postalCode} ${city} ${country}`}>{address} | {postalCode} {city} | {country}</a></span>
                                            </div>
                                            {bookingUrl && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <a href={bookingUrl} style={bookingButton}>
                                                        📅 Planifier un rendez-vous
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {useEcoFooter && (
                            <div style={ecoFooterStyle}>
                                Think green, keep it on the screen. 🌳
                            </div>
                        )}

                        <table role="presentation" cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: 'collapse', marginTop: '12px' }}>
                            <tbody>
                                <tr>
                                    <td bgcolor="#222246" style={aiFooterStyle}>
                                        <img src={logoAI} alt="Wavenet" style={logoStyle} />
                                        <p style={aiFooterHeadingStyle}><span style={{ color: '#FFFFFF' }}>IA Starter Pack</span></p>
                                        <p style={{ lineHeight: '100%' }}><span style={{ color: '#FFFFFF' }}>"Tout le monde parle d'IA, mais peu de personnes savent par où commencer... Wavenet vous propose de passer du flou artistique à deux agents fonctionnels en 5 jours."</span></p>
                                        <div><a style={aiFooterButtonStyle} href="https://www.wavenet.be/fr/etudes-de-cas/starter-pack-ia/" target="_blank" rel="noopener noreferrer"><span style={{ color: '#FFFFFF' }}>Contactez-nous</span></a></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </td>
                </tr>
            </tbody>
        </table>
    )
}