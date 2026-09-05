import NotePreviewClient from './NotePreview.client';
interface InterceptedModalPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function InterceptedModalPage({
    params,
}: InterceptedModalPageProps) {
    const resolvedParams = await params;

    return <NotePreviewClient id={resolvedParams.id} />;
}
