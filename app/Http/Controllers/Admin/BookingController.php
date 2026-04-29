<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingSchedule;
use App\Models\Facility;
use App\Models\FacilityPrice;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(): Response
    {
        $this->authorize('manage-bookings');

        $bookings = Booking::with(['user', 'facility', 'transaction'])
            ->orderBy('booking_date', 'desc')
            ->orderBy('start_time', 'asc')
            ->get()
            ->map(fn($b) => $this->transformBooking($b));

        $facilities = Facility::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name']);

        $users = User::orderBy('name')
            ->get(['id', 'name', 'phone_number', 'identity_category']);

        return Inertia::render('Admin/Bookings/Index', [
            'bookings'   => $bookings,
            'facilities' => $facilities,
            'users'      => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('manage-bookings');

        $data = $request->validate([
            'user_id'      => ['required', 'exists:users,id'],
            'facility_id'  => ['required', 'exists:facilities,id'],
            'booking_date' => ['required', 'date', 'after_or_equal:today'],
            'start_time'   => ['required', 'date_format:H:i'],
            'end_time'     => ['required', 'date_format:H:i'],
            'notes'        => ['nullable', 'string', 'max:500'],
        ]);

        if ($data['end_time'] <= $data['start_time']) {
            return back()->withErrors(['end_time' => 'Jam selesai harus setelah jam mulai.']);
        }

        $date = Carbon::parse($data['booking_date']);
        if (!BookingSchedule::isOpen($date->month, $date->year)) {
            return back()->withErrors([
                'booking_date' => 'Jadwal untuk bulan ini belum dibuka oleh pengelola.',
            ]);
        }

        if ($this->hasCollision($data['facility_id'], $data['booking_date'], $data['start_time'], $data['end_time'])) {
            return back()->withErrors([
                'start_time' => 'Jadwal sudah terpesan untuk fasilitas tersebut. Silakan pilih waktu lain.',
            ]);
        }

        $subtotal = $this->calculateSubtotal(
            (int) $data['user_id'],
            (int) $data['facility_id'],
            $data['start_time'],
            $data['end_time'],
        );

        $booking = Booking::create([
            'user_id'        => $data['user_id'],
            'facility_id'    => $data['facility_id'],
            'booking_date'   => $data['booking_date'],
            'start_time'     => $data['start_time'],
            'end_time'       => $data['end_time'],
            'subtotal_price' => $subtotal,
            'status'         => 'pending',
            'notes'          => $data['notes'] ?? null,
        ]);

        $booking->transaction()->create([
            'user_id'        => $data['user_id'],
            'amount'         => $subtotal,
            'payment_status' => 'UNPAID',
            'checkout_url'   => url("/admin/bookings/{$booking->id}"),
        ]);

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking berhasil dibuat.');
    }

    public function update(Request $request, Booking $booking): RedirectResponse
    {
        $this->authorize('manage-bookings');

        $data = $request->validate([
            'status' => ['required', 'in:pending,confirmed,cancelled,completed'],
        ]);

        $booking->update(['status' => $data['status']]);

        if (in_array($data['status'], ['cancelled', 'completed'])) {
            if ($booking->transaction?->payment_status === 'UNPAID') {
                $booking->transaction->update(['payment_status' => 'FAILED']);
            }
        }

        return back()->with('success', 'Status booking berhasil diperbarui.');
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $this->authorize('manage-bookings');

        $booking->update(['status' => 'cancelled']);

        if ($booking->transaction?->payment_status === 'UNPAID') {
            $booking->transaction->update(['payment_status' => 'FAILED']);
        }

        return back()->with('success', 'Booking berhasil dibatalkan.');
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function hasCollision(int $facilityId, string $date, string $startTime, string $endTime): bool
    {
        return Booking::where('facility_id', $facilityId)
            ->where('booking_date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($q) use ($startTime, $endTime) {
                $q->where('start_time', '<', $endTime)
                  ->where('end_time', '>', $startTime);
            })
            ->exists();
    }

    private function calculateSubtotal(int $userId, int $facilityId, string $startTime, string $endTime): int
    {
        $user = User::find($userId);

        // Map identity_category → price tier (warga_kampus = warga UB)
        $priceCategory = $user?->identity_category === 'warga_kampus' ? 'warga_ub' : 'umum';

        $facilityPrice = FacilityPrice::where('facility_id', $facilityId)
            ->where('user_category', $priceCategory)
            ->first();

        if (! $facilityPrice) {
            return 0;
        }

        // Duration in minutes
        [$sh, $sm] = array_map('intval', explode(':', $startTime));
        [$eh, $em] = array_map('intval', explode(':', $endTime));
        $durationMinutes = ($eh * 60 + $em) - ($sh * 60 + $sm);

        if ($facilityPrice->duration_minutes) {
            return (int) round(($durationMinutes / $facilityPrice->duration_minutes) * $facilityPrice->price);
        }

        return (int) $facilityPrice->price;
    }

    private function transformBooking(Booking $booking): array
    {
        $userCategory = $booking->user->identity_category === 'warga_kampus' ? 'warga_ub' : 'umum';

        return [
            'id'             => $booking->id,
            'user_id'        => $booking->user_id,
            'facility_id'    => $booking->facility_id,
            'booking_date'   => $booking->booking_date->format('Y-m-d'),
            'start_time'     => substr($booking->start_time, 0, 5), // HH:MM
            'end_time'       => substr($booking->end_time, 0, 5),
            'subtotal_price' => $booking->subtotal_price,
            'status'         => $booking->status,
            'notes'          => $booking->notes,
            'customer_name'  => $booking->user->name,
            'customer_phone' => $booking->user->phone_number,
            'user_category'  => $userCategory,
            'facility_name'  => $booking->facility->name,
            'transaction'    => $booking->transaction ? [
                'id'             => $booking->transaction->id,
                'amount'         => $booking->transaction->amount,
                'payment_status' => $booking->transaction->payment_status,
                'checkout_url'   => $booking->transaction->checkout_url,
                'paid_at'        => $booking->transaction->paid_at?->format('Y-m-d H:i'),
            ] : null,
        ];
    }
}
