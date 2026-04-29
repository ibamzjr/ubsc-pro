<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Membership;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function simulatePay(Transaction $transaction): RedirectResponse
    {
        $this->authorize('manage-bookings');

        abort_unless($transaction->payment_status === 'UNPAID', 403, 'Transaksi sudah diproses.');

        DB::transaction(function () use ($transaction) {
            $transaction->update([
                'payment_status' => 'PAID',
                'paid_at'        => now(),
            ]);

            $subject = $transaction->transactionable;
            if ($subject instanceof Booking) {
                $subject->update(['status' => 'confirmed']);
            } elseif ($subject instanceof Membership) {
                $subject->update(['status' => 'active']);
            }
        });

        return back()->with('success', 'Pembayaran berhasil dikonfirmasi (Simulasi).');
    }
}
