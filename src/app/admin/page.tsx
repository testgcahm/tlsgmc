import { baseUrl } from '@/components/utils';
import AdminClient from './AdminClient';
import { DriveImage } from '@/types/googleDrive';

// Server component for static fetching of Google Drive images
export default async function AdminPage() {
    // Static fetch for Google Drive images
    const res = await fetch(`${baseUrl}/api/drive-images`, { cache: 'force-cache' });
    let driveImages: DriveImage[] = [];
    try {
        const data = await res.json();
        if (data.success) driveImages = data.images;
    } catch (e) {
        // fallback: empty array
    }
    return <AdminClient driveImages={driveImages} />;
}