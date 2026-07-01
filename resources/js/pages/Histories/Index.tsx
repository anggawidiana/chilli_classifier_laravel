import { useState, useRef, useEffect, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2, UploadCloud, Loader2, Eye, ImageIcon, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn, compressImage } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface DetectionHistory {
    id: number;
    predicted_class: string;
    confidence: number;
    severity_percent: number;
    image_path: string | null;
    created_at: string;
}

interface Props {
    histories: DetectionHistory[];
}

interface PredictionResult {
    predicted_class: string;
    confidence: number;
    severity_percent: number;
    probabilities: Record<string, number>;
}

export default function Index({ histories }: Props) {
    // ── multi-select ───────────────────────────────────────────────────────────
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
    const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

    // ── filter kategori ────────────────────────────────────────────────────────
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const uniqueCategories = [
        'Bacterial Spot', 
        'Cercospora Leaf Spot', 
        'Curl Virus', 
        'Healthy Leaf', 
        'Nutrition Deficiency', 
        'White Spot'
    ];

    // ── sorting ────────────────────────────────────────────────────────────────
    type SortKey = 'created_at' | 'confidence' | 'severity_percent' | null;
    type SortOrder = 'asc' | 'desc';
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const sortedAndFilteredHistories = useMemo(() => {
        let result = filterCategory === "all"
            ? [...histories]
            : histories.filter(h => {
                const dbClass = h.predicted_class.replace(/_/g, ' ').toLowerCase();
                const filterClass = filterCategory.replace(/_/g, ' ').toLowerCase();
                if (filterClass === 'healthy leaf' && dbClass === 'healthy') return true;
                return dbClass === filterClass;
            });

        if (sortKey) {
            result.sort((a, b) => {
                let aVal: number | string = a[sortKey as keyof DetectionHistory] as number | string;
                let bVal: number | string = b[sortKey as keyof DetectionHistory] as number | string;

                if (sortKey === 'created_at') {
                    aVal = new Date(a.created_at).getTime();
                    bVal = new Date(b.created_at).getTime();
                }

                if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [histories, filterCategory, sortKey, sortOrder]);

    const selectAllRef = useRef<HTMLInputElement>(null);
    const allSelected = sortedAndFilteredHistories.length > 0 && selectedIds.size === sortedAndFilteredHistories.length;
    const someSelected = selectedIds.size > 0 && !allSelected;

    useEffect(() => {
        if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
    }, [someSelected]);

    const toggleSelectAll = () =>
        setSelectedIds(allSelected ? new Set() : new Set(sortedAndFilteredHistories.map((h) => h.id)));

    const toggleSelect = (id: number) =>
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const handleBulkDelete = () => {
        setBulkDeleteLoading(true);
        router.post('/histories/bulk-delete', { ids: [...selectedIds] }, {
            preserveScroll: true,
            onSuccess: () => { setBulkDeleteConfirm(false); setSelectedIds(new Set()); },
            onFinish: () => setBulkDeleteLoading(false),
        });
    };

    // ── detail ───────────────────────────────────────────────────────────────
    const [detailTarget, setDetailTarget] = useState<DetectionHistory | null>(null);

    // ── single delete ──────────────────────────────────────────────────────────
    const [deleteTarget, setDeleteTarget] = useState<DetectionHistory | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        router.delete(`/histories/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onFinish: () => setDeleteLoading(false),
        });
    };

    // ── update / reupload ──────────────────────────────────────────────────────
    const [updateTarget, setUpdateTarget] = useState<DetectionHistory | null>(null);
    const [updateFile, setUpdateFile] = useState<File | null>(null);
    const [updatePreviewUrl, setUpdatePreviewUrl] = useState<string | null>(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const closeUpdateModal = () => {
        if (updateLoading) return;
        setUpdateTarget(null);
        setUpdateFile(null);
        setUpdatePreviewUrl(null);
        setUpdateError(null);
    };

    const applyUpdateFile = async (raw: File) => {
        const compressed = await compressImage(raw);
        setUpdateFile(compressed);
        setUpdatePreviewUrl(URL.createObjectURL(compressed));
        setUpdateError(null);
    };

    const handleUpdateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) applyUpdateFile(e.target.files[0]);
    };

    const handleUpdateDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (!f) return;
        if (!f.type.startsWith('image/')) { setUpdateError('Hanya file gambar yang diperbolehkan.'); return; }
        applyUpdateFile(f);
    };

    const handleRedetect = async () => {
        if (!updateFile || !updateTarget) return;
        setUpdateLoading(true);
        setUpdateError(null);
        const formData = new FormData();
        formData.append('file', updateFile);
        try {
            const apiUrl = import.meta.env.VITE_API_DETECTION_URL || 'http://localhost:8080/predict';
            const res = await fetch(apiUrl, { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Gagal terhubung ke API Deteksi');
            const data: PredictionResult = await res.json();
            router.post(`/histories/${updateTarget.id}`, {
                _method: 'patch',
                predicted_class: data.predicted_class,
                confidence: data.confidence,
                severity_percent: data.severity_percent,
                image: updateFile,
            }, {
                preserveScroll: true,
                onSuccess: () => closeUpdateModal(),
                onError: () => setUpdateError('Gagal menyimpan hasil deteksi.'),
                onFinish: () => setUpdateLoading(false),
            });
        } catch (err: any) {
            setUpdateError(err.message || 'Terjadi kesalahan saat memproses gambar.');
            setUpdateLoading(false);
        }
    };

    return (
        <>
            <Head title="Riwayat Deteksi" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between gap-4 w-full p-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Riwayat Deteksi</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Daftar riwayat klasifikasi penyakit daun cabai yang pernah Anda lakukan.
                        </p>
                    </div>
                    <div>
                        <div className="w-[200px]">
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {uniqueCategories.map(cat => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 bg-background shadow-sm dark:border-sidebar-border">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-sidebar-border/70 dark:border-sidebar-border">
                            <tr>
                                <th className="w-10 px-4 py-3">
                                    <input
                                        ref={selectAllRef}
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleSelectAll}
                                        className="h-4 w-4 cursor-pointer rounded accent-primary"
                                    />
                                </th>
                                <th className="px-4 py-3 font-medium">No</th>
                                <th
                                    className="px-4 py-3 font-medium cursor-pointer hover:bg-muted/50 transition-colors select-none"
                                    onClick={() => handleSort('created_at')}
                                >
                                    <div className="flex items-center gap-1.5">
                                        Tanggal Deteksi
                                        {sortKey === 'created_at' ? (sortOrder === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />}
                                    </div>
                                </th>
                                <th className="px-4 py-3 font-medium">Prediksi Penyakit</th>
                                <th
                                    className="px-4 py-3 font-medium cursor-pointer hover:bg-muted/50 transition-colors select-none"
                                    onClick={() => handleSort('confidence')}
                                >
                                    <div className="flex items-center gap-1.5">
                                        Akurasi Model
                                        {sortKey === 'confidence' ? (sortOrder === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />}
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 font-medium cursor-pointer hover:bg-muted/50 transition-colors select-none"
                                    onClick={() => handleSort('severity_percent')}
                                >
                                    <div className="flex items-center gap-1.5">
                                        Tingkat Keparahan
                                        {sortKey === 'severity_percent' ? (sortOrder === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />}
                                    </div>
                                </th>
                                <th className="px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Aksi</span>
                                        {selectedIds.size > 0 && (
                                            <button
                                                onClick={() => setBulkDeleteConfirm(true)}
                                                className="ml-2 flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive hover:text-white"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                {selectedIds.size}
                                            </button>
                                        )}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {sortedAndFilteredHistories.length > 0 ? (
                                sortedAndFilteredHistories.map((history, index) => {
                                    const isSelected = selectedIds.has(history.id);
                                    return (
                                        <tr
                                            key={history.id}
                                            className={cn(
                                                'transition-colors hover:bg-muted/50',
                                                isSelected && 'bg-primary/5 hover:bg-primary/8',
                                            )}
                                        >
                                            <td className="w-10 px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(history.id)}
                                                    className="h-4 w-4 cursor-pointer rounded accent-primary"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                                            <td className="px-4 py-3">
                                                {new Intl.DateTimeFormat('id-ID', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                }).format(new Date(history.created_at))}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary capitalize">
                                                    {history.predicted_class.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {Number(history.confidence * 100).toFixed(2)}%
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                                                        <div
                                                            className="h-full rounded-full bg-destructive"
                                                            style={{ width: `${history.severity_percent}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-muted-foreground">
                                                        {Number(history.severity_percent).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => setDetailTarget(history)}
                                                        title="Lihat detail"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => { setUpdateTarget(history); setUpdateFile(null); setUpdatePreviewUrl(null); setUpdateError(null); }}
                                                        title="Perbarui deteksi"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
                                                        onClick={() => setDeleteTarget(history)}
                                                        title="Hapus riwayat"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                        Belum ada data riwayat deteksi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Bulk delete confirmation ── */}
            <Dialog open={bulkDeleteConfirm} onOpenChange={(open) => { if (!bulkDeleteLoading) setBulkDeleteConfirm(open); }}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus {selectedIds.size} Riwayat</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus{' '}
                            <span className="font-semibold text-foreground">{selectedIds.size} data</span>{' '}
                            yang dipilih? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBulkDeleteConfirm(false)} disabled={bulkDeleteLoading}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleBulkDelete} disabled={bulkDeleteLoading}>
                            {bulkDeleteLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Menghapus...</> : `Hapus ${selectedIds.size} Data`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Detail modal ── */}
            <Dialog open={!!detailTarget} onOpenChange={(open) => { if (!open) setDetailTarget(null); }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Detail Riwayat Deteksi</DialogTitle>
                    </DialogHeader>
                    {detailTarget && (
                        <div className="flex flex-col gap-4">
                            <div className="relative h-56 w-full overflow-hidden rounded-lg border border-sidebar-border shadow-sm flex items-center justify-center bg-muted/20">
                                {detailTarget.image_path ? (
                                    <img src={`/storage/${detailTarget.image_path}`} alt="Gambar Deteksi" className="h-full w-full object-contain" />
                                ) : (
                                    <div className="flex flex-col items-center text-muted-foreground">
                                        <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                                        <span className="text-sm">Tidak ada gambar</span>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3 text-sm rounded-lg border border-sidebar-border p-4 bg-background shadow-sm">
                                <div className="grid grid-cols-3 border-b border-sidebar-border/50 pb-2">
                                    <span className="text-muted-foreground">Prediksi Kelas</span>
                                    <span className="col-span-2 font-medium capitalize text-primary">{detailTarget.predicted_class.replace('_', ' ')}</span>
                                </div>
                                <div className="grid grid-cols-3 border-b border-sidebar-border/50 pb-2">
                                    <span className="text-muted-foreground">Akurasi</span>
                                    <span className="col-span-2 font-medium">{(detailTarget.confidence * 100).toFixed(2)}%</span>
                                </div>
                                <div className="grid grid-cols-3 border-b border-sidebar-border/50 pb-2">
                                    <span className="text-muted-foreground">Tingkat Keparahan</span>
                                    <span className="col-span-2 font-medium text-destructive">{Number(detailTarget.severity_percent).toFixed(1)}%</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="text-muted-foreground">Tanggal</span>
                                    <span className="col-span-2 font-medium">
                                        {new Intl.DateTimeFormat('id-ID', {
                                            dateStyle: 'long',
                                            timeStyle: 'short',
                                        }).format(new Date(detailTarget.created_at))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailTarget(null)}>Tutup</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Single delete confirmation ── */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open && !deleteLoading) setDeleteTarget(null); }}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Riwayat</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus riwayat deteksi ini? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                            {deleteLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Menghapus...</> : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Update / reupload modal ── */}
            <Dialog open={!!updateTarget} onOpenChange={(open) => { if (!open) closeUpdateModal(); }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Perbarui Deteksi</DialogTitle>
                        <DialogDescription>
                            Unggah gambar baru untuk mendeteksi ulang dan memperbarui hasil riwayat ini.
                        </DialogDescription>
                    </DialogHeader>

                    <div
                        className={cn(
                            'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-colors hover:bg-muted/20',
                            updateFile ? 'border-primary/50 bg-muted/10' : 'border-sidebar-border/70 bg-background',
                        )}
                        onDrop={handleUpdateDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <Input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            onChange={handleUpdateFileChange}
                            disabled={updateLoading}
                        />
                        {updatePreviewUrl ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-lg border border-sidebar-border shadow-sm">
                                    <img src={updatePreviewUrl} alt="Preview" className="h-full w-full object-cover" />
                                </div>
                                <p className="max-w-[220px] truncate text-sm font-medium text-muted-foreground">{updateFile?.name}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
                                    <UploadCloud className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">Tarik & lepas gambar di sini</p>
                                    <p className="mt-1 text-sm">atau klik untuk memilih file</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {updateError && <p className="text-sm font-medium text-destructive">{updateError}</p>}

                    <DialogFooter>
                        <Button variant="outline" onClick={closeUpdateModal} disabled={updateLoading}>Batal</Button>
                        <Button onClick={handleRedetect} disabled={!updateFile || updateLoading}>
                            {updateLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Menganalisis...</> : 'Deteksi Ulang'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Riwayat Deteksi', href: '/histories' }],
};
