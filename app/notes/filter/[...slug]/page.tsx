import {
    QueryClient,
    HydrationBoundary,
    dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from '@/app/notes/Notes.client';
import type { NoteTag } from '@/types/note';

interface FilterNotesPageProps {
    params: Promise<{
        slug?: string[];
    }>;
}

export default async function FilterNotesPage({
    params,
}: FilterNotesPageProps) {
    const resolvedParams = await params;
    const rawTag = resolvedParams.slug?.[0];

    const tag: NoteTag | undefined =
        rawTag && rawTag !== 'all' ? (rawTag as NoteTag) : undefined;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['notes', '', 1, tag || ''],
        queryFn: () => fetchNotes('', 1, tag),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient tag={tag} />
        </HydrationBoundary>
    );
}
