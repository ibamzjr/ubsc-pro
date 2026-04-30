<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1f2937; background: #fff; }

    .header { background: #111827; color: #fff; padding: 28px 32px; border-radius: 0 0 16px 16px; }
    .header-title { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 4px; }
    .header-sub { font-size: 11px; color: #9ca3af; }
    .header-meta { margin-top: 12px; font-size: 10px; color: #6b7280; }

    .body { padding: 28px 32px; }

    .section-title {
        font-size: 11px; font-weight: 700; text-transform: uppercase;
        letter-spacing: 1.5px; color: #6b7280; margin-bottom: 12px; margin-top: 24px;
    }

    .kpi-grid { display: table; width: 100%; border-collapse: separate; border-spacing: 8px 0; margin-bottom: 8px; }
    .kpi-cell { display: table-cell; width: 33%; vertical-align: top; }
    .kpi-card {
        background: #f9fafb; border: 1px solid #e5e7eb;
        border-radius: 12px; padding: 14px 16px;
    }
    .kpi-label { font-size: 10px; color: #6b7280; margin-bottom: 4px; }
    .kpi-value { font-size: 20px; font-weight: 700; color: #111827; }
    .kpi-trend { font-size: 10px; margin-top: 4px; }
    .trend-up { color: #059669; }
    .trend-down { color: #dc2626; }

    table.data { width: 100%; border-collapse: collapse; font-size: 11px; }
    table.data th {
        background: #f3f4f6; text-align: left; padding: 8px 10px;
        font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;
    }
    table.data td {
        padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #374151;
    }
    table.data tr:last-child td { border-bottom: none; }
    .text-right { text-align: right; }
    .badge {
        display: inline-block; padding: 2px 8px; border-radius: 999px;
        font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .badge-paid { background: #d1fae5; color: #065f46; }

    .footer { margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 14px; color: #9ca3af; font-size: 9.5px; }
</style>
</head>
<body>

<div class="header">
    <div class="header-title">UB Sport Center</div>
    <div class="header-sub">Laporan Keuangan Bulanan — {{ $month_label }}</div>
    <div class="header-meta">Dicetak: {{ $generated_at }}</div>
</div>

<div class="body">

    {{-- KPI Cards --}}
    <div class="section-title">Ringkasan Keuangan</div>
    <div class="kpi-grid">
        <div class="kpi-cell">
            <div class="kpi-card">
                <div class="kpi-label">Total Pendapatan</div>
                <div class="kpi-value">
                    Rp {{ number_format($stats['totalRevenue'], 0, ',', '.') }}
                </div>
                @if($revenueTrend !== 0)
                <div class="kpi-trend {{ $revenueTrend > 0 ? 'trend-up' : 'trend-down' }}">
                    {{ $revenueTrend > 0 ? '▲' : '▼' }} {{ abs($revenueTrend) }}% vs bulan lalu
                </div>
                @endif
            </div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-card">
                <div class="kpi-label">Total Reservasi</div>
                <div class="kpi-value">{{ number_format($stats['totalBookings'], 0, ',', '.') }}</div>
                <div class="kpi-trend" style="color:#6b7280;">booking bulan ini</div>
            </div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-card">
                <div class="kpi-label">Membership Aktif</div>
                <div class="kpi-value">{{ $stats['activeMemberships'] }}</div>
                <div class="kpi-trend" style="color:#6b7280;">member gym</div>
            </div>
        </div>
    </div>

    {{-- Revenue by Facility --}}
    @if(count($facilityRevenue) > 0)
    <div class="section-title">Pendapatan per Fasilitas</div>
    <table class="data">
        <thead>
            <tr>
                <th>Fasilitas</th>
                <th class="text-right">Pendapatan</th>
                <th class="text-right">Kontribusi</th>
            </tr>
        </thead>
        <tbody>
            @foreach($facilityRevenue as $row)
            <tr>
                <td>{{ $row['name'] }}</td>
                <td class="text-right">Rp {{ number_format($row['revenue'], 0, ',', '.') }}</td>
                <td class="text-right">{{ $row['share'] }}%</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    {{-- Recent Paid Transactions --}}
    @if(count($recentTransactions) > 0)
    <div class="section-title">5 Transaksi Terakhir (Lunas)</div>
    <table class="data">
        <thead>
            <tr>
                <th>#</th>
                <th>Pelanggan</th>
                <th>Tipe</th>
                <th class="text-right">Jumlah</th>
                <th>Waktu</th>
                <th class="text-right">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($recentTransactions as $tx)
            <tr>
                <td>{{ $tx['id'] }}</td>
                <td>{{ $tx['user_name'] }}</td>
                <td>{{ $tx['type'] ?: '-' }}</td>
                <td class="text-right">Rp {{ number_format($tx['amount'], 0, ',', '.') }}</td>
                <td>{{ $tx['paid_at'] }}</td>
                <td class="text-right"><span class="badge badge-paid">Lunas</span></td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

</div>

<div class="footer" style="padding: 0 32px 28px;">
    Dokumen ini dibuat secara otomatis oleh sistem UBSC Admin. Hanya untuk keperluan internal.
</div>

</body>
</html>
