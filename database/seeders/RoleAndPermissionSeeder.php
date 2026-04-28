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

        $permissions = [
            'view-dashboard',
            'manage-users',
            'manage-roles-permissions',
            'verify-identity',
            'manage-facilities',
            'manage-pricing',
            'view-reports',
            'manage-cms',
            'publish-news',
            'manage-bookings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $matrix = [
            'Administrator' => [
                'view-dashboard',
                'manage-users',
                'manage-roles-permissions',
                'verify-identity',
                'manage-facilities',
                'manage-pricing',
                'view-reports',
                'manage-cms',
                'publish-news',
                'manage-bookings',
            ],
            'Manager' => [
                'view-dashboard',
                'manage-users',
                'manage-facilities',
                'manage-pricing',
                'view-reports',
                'manage-cms',
                'publish-news',
                'manage-bookings',
            ],
            'Finance' => [
                'view-dashboard',
                'manage-pricing',
                'view-reports',
            ],
            'Staff Front Officer' => [
                'view-dashboard',
                'verify-identity',
                'manage-bookings',
            ],
            'Staff Central' => [
                'view-dashboard',
                'manage-cms',
                'publish-news',
            ],
        ];

        foreach ($matrix as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($rolePermissions);
        }
    }
}
