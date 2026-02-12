type Props = {
    label?: string;
    checked?: boolean;
    onChange: (selected: boolean) => void;
}
export function Toggle({ label, checked, onChange }: Props) {
    return (
        <label className="items-center cursor-pointer inline-block align-middle">
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className={`block w-14 h-8 rounded-full transition ${checked ? 'bg-accent' : 'bg-gray-300'
                    }`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${checked ? 'translate-x-6' : ''
                    }`}></div>
            </div>
            {label && (
                <div className="ml-3 text-gray-700 font-medium select-none">
                    {label}
                </div>
            )}
        </label>
    );
}