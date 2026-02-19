import { createFileRoute } from '@tanstack/react-router'

import { SignaturePreview } from '@/components/Preview';
import type { CountryCode, E164Number } from 'node_modules/libphonenumber-js/types';
import { useState, useRef, type ChangeEvent, type MouseEvent, useEffect } from 'react';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import { Toggle } from '@/components/Toggle';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/services/user';

export const Route = createFileRoute('/')({ component: App })
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const defaultCountry: CountryCode = 'BE';
type FormData = {
  firstName?: string,
  lastName?: string,
  jobTitle?: string,
  bookingUrl?: string,
  email?: string,
  phone?: string,
  address?: string,
  postalCode?: string,
  city?: string,
  country?: string,
  usePicture?: boolean,
  useEcoFooter?: boolean,
  photo?: string,
};
function App() {
  const [formData, setFormData] = useState<FormData>();

  const { isLoading, data } = useQuery({
    queryKey: ['signature'],
    queryFn: getUser,
  });

  useEffect(() => {
    setFormData({
      email: data?.email ?? '',
      firstName: data?.firstName ?? '',
      lastName: data?.lastName ?? '',
      jobTitle: data?.jobTitle ?? '',
      bookingUrl: '',
      phone: parsePhoneNumber(data?.mobilePhone ?? '', defaultCountry)?.number ?? '',
      photo: data?.photo,
      usePicture: true,
      useEcoFooter: true,
      address: data?.streetAddress ?? 'Rue de l\'Artisanat 16',
      postalCode: data?.postalCode ?? '7900',
      city: data?.city ?? 'Leuze-en-Hainaut',
      country: data?.country ?? 'Belgique',
    });
  }, [data]);
  const [copySuccess, setCopySuccess] = useState(false);
  const signatureRef = useRef<HTMLDivElement>(null);

  function update(key: keyof FormData | (string & {}), value: string | boolean | undefined) {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  }
  const handleInputChange = (e: ChangeEvent<HTMLInputElement> | E164Number | undefined) => {
    if (!e || typeof e === 'string') {
      update('phone', e);
      return;
    }

    const { name, value } = e.target;
    update(name, value);
  };

  const copyToClipboard = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!signatureRef.current) return;
    const target = e.currentTarget;
    target.inert = true;
    const signatureHtml = signatureRef.current.innerHTML;
    const signatureText = signatureRef.current.innerText;

    const htmlBlob = new Blob([signatureHtml], { type: 'text/html' });
    const textBlob = new Blob([signatureText], { type: 'text/plain' });
    const clipboardItem = new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob });

    await navigator.clipboard.write([clipboardItem]);
    setCopySuccess(true);
    await delay(3000);
    setCopySuccess(false)
    target.inert = false;
  };

  if (isLoading || !formData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800/70 dark:border dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-black/40 p-8 h-fit backdrop-blur-sm">
          <h2 className="text-2xl font-display font-semibold text-primary mb-6">
            Your Information
          </h2>

          <form className="space-y-5">
            {formData.photo && (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={`data:image/jpeg;base64,${formData.photo}`}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-2 border-accent"
                    />
                  </div>
                </div>
                <Toggle checked={formData.usePicture} onChange={(checked) => update('usePicture', checked)} label="Use profile picture in signature" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <PhoneInput
                  type="tel"
                  id="phone"
                  name="phone"
                  international={false}
                  defaultCountry="BE"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="bookingUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Booking (<a href="https://outlook.office.com/bookwithme/me" target="_blank" className="text-accent" rel="noopener noreferrer">🛈︎ information about how to book a meeting with you</a>)
                </label>
                <input
                  type="text"
                  id="bookingUrl"
                  name="bookingUrl"
                  value={formData.bookingUrl}
                  placeholder='https://outlook.office.com/bookwithme/user/...'
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Toggle checked={formData.useEcoFooter} onChange={(checked) => update('useEcoFooter', checked)} label='Eco Footer?' />
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800/70 dark:border dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-black/40 p-2 lg:p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-semibold text-primary">
                Preview
              </h2>
              <button
                onClick={copyToClipboard}
                className={`px-5 py-2.5 rounded-lg cursor-pointer font-medium transition-all flex items-center gap-2 ${copySuccess
                  ? 'bg-green-500 text-white'
                  : 'bg-accent hover:bg-primary text-white'
                  }`}
              >
                {copySuccess ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="border-2 border-gray-100 dark:border-gray-700 rounded-lg p-6 bg-white signature-preview text-gray-900" ref={signatureRef}>
              <SignaturePreview
                {...formData}
                name={`${formData.firstName} ${formData.lastName}`}
                profileImage={formData.usePicture ? formData.photo : undefined} />
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-slate-800/60 border border-blue-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
              <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How to use in Outlook
              </h3>
              <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 ml-7 list-decimal">
                <li>Click "Copy Signature" button above</li>
                <li>Open <a href="https://outlook.office.com/mail/options/accounts-category/signatures-subcategory" target="_blank" rel="noopener noreferrer" className="text-accent">Outlook Settings</a></li>
                <li>Navigate to Mail → Compose and reply</li>
                <li>Under "Email signature", paste (Ctrl+V) the signature</li>
                <li>Choose when to add signature automatically</li>
                <li>Click "Save"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};