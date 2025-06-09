export enum FolderType {
    Register = "register",
    Events = "events"
}

export type DriveImage = {
    id: string;
    name: string;
    url: string;
    sizeKB: number;
    isOverSizeLimit: boolean;
};

export type DriveImages = DriveImage[];