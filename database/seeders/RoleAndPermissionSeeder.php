<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Rename legacy role name if it exists
        Role::where('name', 'Staff Front Officer')->update(['name' => 'Staff Front Office']);

        // ── Define all permissions ────────────────────────────────────────────
        $allPermissions = [
            // Beranda & Dasbor
            'view-stats',
            'view-finance-reports',
            'view-balance',
            'withdraw-balance',
            // Reservasi & Jadwal
            'view-bookings',
            'create-manual-booking',
            'cancel-booking',
            'manage-booking-limits',
            // Fasilitas & Lapangan
            'view-facilities',
            'manage-facilities',
            'manage-pricing',
            'manage-venue-details',
            // Promosi & CMS
            'view-promos',
            'manage-promos',
            // Member & Pelanggan
            'view-members',
            'manage-members',
            'manage-payment-links',
            // Verifikasi UBSC
            'verify-identity-queue',
        ];

        // Remove obsolete permissions no longer defined
        Permission::whereNotIn('name', $allPermissions)->delete();

        foreach ($allPermissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        // ── Role → Permission matrix ──────────────────────────────────────────
        $matrix = [
            'Administrator'      => $allPermissions,
            'Manager'            => $allPermissions,
            'Finance'            => [
                'view-stats',
                'view-finance-reports',
                'view-balance',
                'withdraw-balance',
                'view-bookings',
                'view-members',
                'manage-payment-links',
            ],
            'Staff Central'      => [
                'view-bookings',
                'create-manual-booking',
                'cancel-booking',
                'view-facilities',
                'view-promos',
                'view-members',
            ],
            'Staff Front Office' => [
                'view-bookings',
                'verify-identity-queue',
            ],
        ];

        foreach ($matrix as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($rolePermissions);
        }
    }
}
