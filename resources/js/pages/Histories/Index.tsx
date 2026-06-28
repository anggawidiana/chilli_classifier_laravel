import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2, UploadCloud, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    const [deleteTarget, setDeleteTarget] = useState<DetectionHistory | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [updateTarget, setUpdateTarget] = useState<DetectionHistory | null>(null);
    const [updateFile, setUpdateFile] = useState<File | null>(null);
    const [updatePreviewUrl, setUpdatePreviewUrl] = useState<string | null>(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const openUpdateModal = (history: DetectionHistory) => {
        setUpdateTarget(history);
        setUpdateFile(null);
        setUpdatePreviewUrl(null);
        setUpdateError(null);
    };

    const closeUpdateModal = () => {
        if (updateLoading) return;
        setUpdateTarget(null);
        setUpdateFile(null);
        setUpdatePreviewUrl(null);
        setUpdateError(null);
    };

    const handleUpdateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            setUpdateFile(selected);
            setUpdatePreviewUrl(URL.createObjectURL(selected));
            setUpdateError(null);
        }
    };

    const handleUpdateDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selected = e.dataTransfer.files[0];
            if (selected.type.startsWith('image/')) {
                setUpdateFile(selected);
                setUpdatePreviewUrl(URL.createObjectURL(selected));
                setUpdateError(null);
            } else {
                setUpdateError('Hanya file gambar yang diperbolehkan.');
            }
        }
    };

    const handleRedetect = async () => {
        if (!updateFile || !updateTarget) return;

        setUpdateLoading(true);
        setUpdateError(null);

        const formData = new FormData();
        formData.append('file', updateFile);

        try {
            const apiUrl = import.meta.env.VITE_API_DETECTION_URL || 'http://localhost:8000/predict';
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Gagal terhubung ke API Deteksi');

            const data: PredictionResult = await response.json();

            router.patch(`/histories/${updateTarget.id}`, {
                predicted_class: data.predicted_class,
                confidence: data.confidence,
                severity_percent: data.severity_percent,
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

    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        router.delete(`/histories/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onFinish: () => setDeleteLoading(false),
        });
    };

    return (
        <>
            <Head title="Riwayat Deteksi" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Riwayat Deteksi</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Daftar riwayat klasifikasi penyakit daun cabai yang pernah Anda lakukan.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 bg-background shadow-sm dark:border-sidebar-border">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-sidebar-border/70 dark:border-sidebar-border">
                            <tr>
                                <th className="px-4 py-3 font-medium">No</th>
                                <th className="px-4 py-3 font-medium">Tanggal Deteksi</th>
                                <th className="px-4 py-3 font-medium">Prediksi Penyakit</th>
                                <th className="px-4 py-3 font-medium">Akurasi Model</th>
                                <th className="px-4 py-3 font-medium">Tingkat Keparahan</th>
                                <th className="px-4 py-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {histories.length > 0 ? (
                                histories.map((history, index) => (
                                    <tr key={history.id} className="hover:bg-muted/50 transition-colors">
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
                                                        className="h-full bg-destructive rounded-full"
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
                                                    onClick={() => openUpdateModal(history)}
                                                    title="Perbarui deteksi"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white border-destructive/30"
                                                    onClick={() => setDeleteTarget(history)}
                                                    title="Hapus riwayat"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                        Belum ada data riwayat deteksi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
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
                            {deleteLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                'Hapus'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update / Reupload Dialog */}
            <Dialog open={!!updateTarget} onOpenChange={(open) => { if (!open) closeUpdateModal(); }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Perbarui Deteksi</DialogTitle>
                        <DialogDescription>
                            Unggah gambar baru untuk mendeteksi ulang dan memperbarui hasil riwayat ini.
                        </DialogDescription>
                    </DialogHeader>

                    <div
                        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-sidebar-border/70 p-10 text-center hover:bg-muted/20 transition-colors ${updateFile ? 'bg-muted/10 border-primary/50' : 'bg-background'}`}
                        onDrop={handleUpdateDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleUpdateFileChange}
                            disabled={updateLoading}
                        />
                        {updatePreviewUrl ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-lg border border-sidebar-border shadow-sm">
                                    <img src={updatePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <p className="text-sm font-medium text-muted-foreground truncate max-w-[220px]">
                                    {updateFile?.name}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
                                    <UploadCloud className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">Tarik & lepas gambar di sini</p>
                                    <p className="text-sm mt-1">atau klik untuk memilih file</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {updateError && (
                        <p className="text-sm font-medium text-destructive">{updateError}</p>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={closeUpdateModal} disabled={updateLoading}>
                            Batal
                        </Button>
                        <Button onClick={handleRedetect} disabled={!updateFile || updateLoading}>
                            {updateLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Menganalisis...
                                </>
                            ) : (
                                'Deteksi Ulang'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Riwayat Deteksi',
            href: '/histories',
        },
    ],
};
