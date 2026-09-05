import NotePreview from '@/components/NotePreview/NotePreview';

interface InterceptedModalPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function InterceptedModalPage({
    params,
}: InterceptedModalPageProps) {
    const resolvedParams = await params;

    return <NotePreview id={resolvedParams.id} />;
}
