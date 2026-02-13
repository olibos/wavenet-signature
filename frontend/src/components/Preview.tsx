import { useMemo, type CSSProperties } from "react";
import { parsePhoneNumber } from "react-phone-number-input";
import logo from '@/images/wavenet.png?base64';
import { useQuery } from "@tanstack/react-query";
import { optimizeProfileImage } from "@/helpers/images";

const containerStyle: CSSProperties = {
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px',
    lineHeight: '1.4',
    color: '#333333',
    maxWidth: '600px',
    padding: '20px 0'
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
    display: 'block',
    border: '2px solid #E0E0E0'
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

const logoSectionStyle: CSSProperties = {
    paddingTop: '15px',
    borderTop: '1px solid #E0E0E0',
    marginTop: '15px',
    textAlign: 'center'
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

type Props = {
    name?: string;
    jobTitle?: string;
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
    email,
    phone: phoneNumberRaw,
    address,
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
        <div style={containerStyle}>
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
                                <div style={titleStyle}>{jobTitle}</div>
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
                                    <span><a target="_blank" rel="noopener noreferrer" style={linkStyle} href={`https://maps.google.com/?q=${address} ${city} ${country}`}>{address} | {city} | {country}</a></span>
                                </div>
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

            <div style={logoSectionStyle}>
                <a href="https://www.wavenet.be/" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    <img src={logo} alt="Wavenet" style={logoStyle} />
                </a>
            </div>

        </div>
    )
}