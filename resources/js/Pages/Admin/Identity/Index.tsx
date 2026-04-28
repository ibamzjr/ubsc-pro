import { Head, router, usePage } from "@inertiajs/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { CheckCircle, ExternalLink, XCircle } from "lucide-react";
import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import { IdentityStatusBadge } from "@/Components/Admin/StatusBadge";
import AdminLayout from "@/Layouts/AdminLayout";
import type { IdentityUser, PageProps } from "@/types";

type Props = PageProps<{ users: IdentityUser[] }>;

const helper = createColumnHelper<IdentityUser>();

function ActionButtons({ user }: { user: IdentityUser }) {
    const [loading, setLoading] = useState(false);

    const verify = (status: "verified" | "rejected") => {
        setLoading(true);
        router.patch(
            route("admin.identity.verify", user.id),
            { status },
            { onFinish: () => setLoading(false) },
        );
    };

    if (user.identity_status === "verified" || user.identity_status === "rejected") {
        return <span className="text-xs text-gray-400">—</span>;
    }

    return (
        <div className="flex items-center gap-2">
            {user.has_document && (
                <a
                    href={route("admin.identity.document", user.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    title="View document"
                >
                    <ExternalLink size={14} />
                </a>
            )}
            <button
                type="button"
                disabled={loading}
                onClick={() => verify("verified")}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-colors hover:bg-green-100 disabled:opacity-50"
                title="Approve"
            >
                <CheckCircle size={14} />
            </button>
            <button
                type="button"
                disabled={loading}
                onClick={() => verify("rejected")}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100 disabled:opacity-50"
                title="Reject"
            >
                <XCircle size={14} />
            </button>
        </div>
    );
}

const columns = [
    helper.accessor("name", {
        header: "Name",
        cell: (info) => (
            <span className="font-medium text-gray-900">{info.getValue()}</span>
        ),
        enableSorting: true,
    }),
    helper.accessor("email", {
        header: "Email",
        cell: (info) => (
            <span className="text-gray-600">{info.getValue()}</span>
        ),
    }),
    helper.accessor("identity_category", {
        header: "Category",
        cell: (info) => (
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                {info.getValue() === "warga_kampus" ? "Warga Kampus" : "Umum"}
            </span>
        ),
    }),
    helper.accessor("identity_number", {
        header: "Identity No.",
        cell: (info) => (
            <span className="font-mono text-xs text-gray-600">
                {info.getValue() ?? "—"}
            </span>
        ),
    }),
    helper.accessor("updated_at", {
        header: "Submitted",
        cell: (info) => (
            <span className="text-xs text-gray-500">{info.getValue()}</span>
        ),
        enableSorting: true,
    }),
    helper.accessor("identity_status", {
        header: "Status",
        cell: (info) => <IdentityStatusBadge status={info.getValue()} />,
    }),
    helper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionButtons user={row.original} />,
    }),
];

export default function IdentityIndex() {
    const { users } = usePage<Props>().props;
    const pending = users.filter((u) => u.identity_status === "pending").length;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col gap-1 pt-4">
                    <span className="font-clash text-xs uppercase tracking-[0.2em] text-gray-400">
                        Staff Front Officer
                    </span>
                    <h1 className="font-monument text-3xl font-normal tracking-tight text-gray-900">
                        Identity Queue
                    </h1>
                </div>
            }
        >
            <Head title="Identity Queue" />

            <div className="flex flex-col gap-6 pt-6">
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                        {pending} pending review
                    </span>
                    <span className="text-sm text-gray-500">
                        {users.length} total submissions
                    </span>
                </div>

                <DataTable
                    columns={columns as ColumnDef<IdentityUser, unknown>[]}
                    data={users}
                    searchColumn="name"
                    searchPlaceholder="Search by name…"
                    emptyMessage="No identity submissions yet."
                />
            </div>
        </AdminLayout>
    );
}
