import { baseUrl } from '@/components/utils';
import AdminClient from './AdminClient';
import { DriveImage } from '@/types/googleDrive';

// Server component for static fetching of Google Drive images
export default async function AdminPage() {
    let driveImages: DriveImage[] = [];
    
    try {
        // Static fetch for Google Drive images
        const res = await fetch(`${baseUrl}/api/drive-images`, { cache: 'force-cache' });
        
        if (!res.ok) {
            console.warn(`Failed to fetch drive images: ${res.status}`);
            return <AdminClient driveImages={[]} />;
        }
        
        const data = await res.json();
        if (data.success && Array.isArray(data.images)) {
            driveImages = data.images;
        }
    } catch (error) {
        console.error('Error fetching drive images:', error);
        // fallback: empty array
        driveImages = [];
    }
    
    return <AdminClient driveImages={driveImages} />;
}