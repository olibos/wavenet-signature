import { parsePhoneNumber } from "react-phone-number-input";

const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px',
    lineHeight: '1.4',
    color: '#333333',
    maxWidth: '600px',
    padding: '20px 0'
} as const;

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
} as const;

const photoStyle = {
    width: '80px',
    height: 'auto',
    borderRadius: '50%',
    objectFit: 'cover',
    display: 'block',
    border: '2px solid #E0E0E0'
} as const;

const nameStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#0D4A9B',
    marginBottom: '5px'
} as const;

const titleStyle = {
    fontSize: '13px',
    color: '#666666',
    marginBottom: '15px'
} as const;

const contactItemStyle = {
    padding: '3px 0',
    color: '#666666'
} as const;

const linkStyle = {
    color: '#0563C1',
    textDecoration: 'none'
} as const;

const logoSectionStyle = {
    paddingTop: '15px',
    borderTop: '1px solid #E0E0E0',
    marginTop: '15px',
    textAlign: 'center'
} as const;

const logoStyle = {
    display: 'block',
    border: 'none'
} as const;


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
}
export function SignaturePreview({
    name,
    jobTitle,
    email,
    phone: phoneNumberRaw,
    address,
    city,
    country,
    profileImage
}: Props) {
    const phone = parsePhoneNumber(phoneNumberRaw ?? '', "BE");
    return (
        <div style={containerStyle}>
            <table style={tableStyle} cellPadding="0" cellSpacing="0">
                <tbody>
                    <tr>
                        {profileImage && (
                            <td style={{ width: '80px', paddingRight: '20px', verticalAlign: 'top' }}>
                                <img src={`data:image/jpeg;base64,${profileImage}`} alt={name} style={photoStyle} width={80} height={80} />
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

            <div style={logoSectionStyle}>
                <a href="https://www.wavenet.be/" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    <img src="data:image/png;base64,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" alt="Wavenet" style={logoStyle} />
                </a>
            </div>
        </div>
    )
}