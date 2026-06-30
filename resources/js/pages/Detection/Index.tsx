import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { UploadCloud, ImageIcon, Loader2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface PredictionResult {
    predicted_class: string;
    confidence: number;
    severity_percent: number;
    probabilities: Record<string, number>;
}

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

export default function Index({ histories }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            if (selectedFile.type.startsWith('image/')) {
                setFile(selectedFile);
                setPreviewUrl(URL.createObjectURL(selectedFile));
                setResult(null);
                setError(null);
            } else {
                setError('Hanya file gambar yang diperbolehkan.');
            }
        }
    };

    const handleDetect = async () => {
        if (!file) {
            setError('Silakan pilih gambar terlebih dahulu.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const apiUrl = import.meta.env.VITE_API_DETECTION_URL || 'http://localhost:8080/predict';
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Gagal terhubung ke API Deteksi');

            const data: PredictionResult = await response.json();
            setResult(data);

            router.post('/histories', {
                predicted_class: data.predicted_class,
                confidence: data.confidence,
                severity_percent: data.severity_percent,
                image: file,
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    router.reload({ only: ['histories'] });
                },
                onError: (errors) => {
                    console.error('Gagal menyimpan riwayat:', errors);
                },
            });

        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat memproses gambar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Deteksi Penyakit" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Deteksi Penyakit Daun Cabai</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Unggah foto daun cabai untuk menganalisis kemungkinan penyakit dan tingkat keparahannya.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                    {/* Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Unggah Gambar</CardTitle>
                            <CardDescription>
                                Pilih atau tarik gambar daun cabai ke area di bawah ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-sidebar-border/70 p-12 text-center hover:bg-muted/20 transition-colors ${file ? 'bg-muted/10 border-primary/50' : 'bg-background'}`}
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                />

                                {previewUrl ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-lg border border-sidebar-border shadow-sm">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground truncate max-w-[200px]">
                                            {file?.name}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                                            <UploadCloud className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">Tarik & lepas gambar di sini</p>
                                            <p className="text-sm mt-1">atau klik untuk memilih file</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <p className="mt-4 text-sm font-medium text-destructive">{error}</p>
                            )}

                            <div className="mt-6">
                                <Button onClick={handleDetect} disabled={!file || loading} className="w-full">
                                    {loading ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menganalisis...</>
                                    ) : (
                                        'Deteksi Penyakit'
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Result */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hasil Analisis</CardTitle>
                            <CardDescription>Hasil deteksi dari model akan muncul di sini.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!result && !loading ? (
                                <div className="flex h-[300px] flex-col items-center justify-center text-muted-foreground text-center">
                                    <ImageIcon className="h-16 w-16 mb-4 opacity-20" />
                                    <p>Belum ada hasil.</p>
                                    <p className="text-sm">Silakan unggah gambar dan klik deteksi terlebih dahulu.</p>
                                </div>
                            ) : loading ? (
                                <div className="flex h-[300px] flex-col items-center justify-center text-muted-foreground gap-4">
                                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                    <p className="animate-pulse">Model sedang menganalisis gambar...</p>
                                </div>
                            ) : result ? (
                                <div className="flex flex-col gap-6">
                                    <div className="rounded-xl border border-sidebar-border bg-muted/30 p-6 flex flex-col items-center text-center">
                                        <h3 className="text-lg font-medium text-muted-foreground mb-1">Prediksi Kelas</h3>
                                        <p className="text-3xl font-bold text-primary capitalize tracking-tight">
                                            {result.predicted_class.replace('_', ' ')}
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="flex flex-col p-4 rounded-xl border border-sidebar-border/70 bg-background">
                                            <span className="text-sm text-muted-foreground mb-2">Akurasi / Confidence</span>
                                            <span className="text-2xl font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                                            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                                                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${result.confidence * 100}%` }} />
                                            </div>
                                        </div>

                                        <div className="flex flex-col p-4 rounded-xl border border-sidebar-border/70 bg-background">
                                            <span className="text-sm text-muted-foreground mb-2">Tingkat Keparahan</span>
                                            <span className="text-2xl font-bold">{result.severity_percent.toFixed(1)}%</span>
                                            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                                                <div className="h-full bg-destructive rounded-full transition-all duration-1000" style={{ width: `${result.severity_percent}%` }} />
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-center text-muted-foreground border-t border-sidebar-border/70 pt-4">
                                        Hasil deteksi ini telah otomatis disimpan ke riwayat.
                                    </p>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent history */}
                {histories.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <History className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">Riwayat Terakhir</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-muted/50 text-muted-foreground border-y border-sidebar-border/70 dark:border-sidebar-border">
                                        <tr>
                                            <th className="px-4 py-2.5 font-medium">Tanggal</th>
                                            <th className="px-4 py-2.5 font-medium">Prediksi</th>
                                            <th className="px-4 py-2.5 font-medium">Akurasi</th>
                                            <th className="px-4 py-2.5 font-medium">Keparahan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                        {histories.slice(0, 5).map((h) => (
                                            <tr key={h.id} className="hover:bg-muted/40 transition-colors">
                                                <td className="px-4 py-2.5 text-muted-foreground">
                                                    {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(h.created_at))}
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary capitalize">
                                                        {h.predicted_class.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5">{Number(h.confidence * 100).toFixed(2)}%</td>
                                                <td className="px-4 py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                                                            <div className="h-full bg-destructive rounded-full" style={{ width: `${h.severity_percent}%` }} />
                                                        </div>
                                                        <span className="text-muted-foreground">{Number(h.severity_percent).toFixed(1)}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Deteksi Penyakit', href: '/detection' }],
};
