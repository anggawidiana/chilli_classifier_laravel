import { Head } from '@inertiajs/react';

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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                                        Belum ada data riwayat deteksi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
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
