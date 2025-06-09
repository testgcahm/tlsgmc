export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;

export const baseImage = 'https://takhayul-literary-society-gmc.vercel.app/og.png'

export const spaceInNumber = (phoneNumber: string) => {
    // Remove all spaces first
    const clean = phoneNumber.replace(/\s+/g, '');
    if (clean.length < 8) return phoneNumber;
    // Insert space at 7th last and 10th last position
    const first = clean.slice(0, clean.length - 10);
    const second = clean.slice(clean.length - 10, clean.length - 7);
    const third = clean.slice(clean.length - 7);
    return [first, second, third].filter(Boolean).join(' ');
}

export const phoneNumber = '+923096262036';
export const email = 'takhayulliterarysocietygmc@gmail.com';

export const Url = ''

export let ALLOWED_EMAILS = [
    'abidahmed094@gmail.com',
    'takhayulliterarysocietygmc@gmail.com',
    'mshakeelmabbas@gmail.com'
];

export const MERGE_EMAILS = [
    'abidahmed094@gmail.com',
    'takhayulliterarysocietygmc@gmail.com',
    'mshakeelmabbas@gmail.com'
];